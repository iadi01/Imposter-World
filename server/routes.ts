import { Router, Request, Response } from "express";
import { User } from "./models/User";
import { Match } from "./models/Match";
import { WordPair } from "./models/WordPair";
import { Supporter } from "./models/Supporter";
import { getRandomWordPair } from "./game/words";
import { RoomManager } from "./game/roomManager";
import { generalApiLimiter, isValidObjectId, sanitizeText, isUserAdmin } from "./security";
import { generateToken } from "./auth";

const router = Router();
router.use(generalApiLimiter);
const roomManager = RoomManager.getInstance();

// In-Memory Fast Cache for Username Lookups (TTL: 60s)
interface CacheEntry {
  available: boolean;
  ownerId?: string;
  message: string;
  expiresAt: number;
}
const usernameCache = new Map<string, CacheEntry>();

export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  const normalized = username.trim().toLowerCase();
  if (normalized.length < 3 || normalized.length > 20) {
    return { valid: false, error: "Username must be between 3 and 20 characters." };
  }
  if (!/^[a-z0-9._]+$/.test(normalized)) {
    return {
      valid: false,
      error: "Only lowercase letters, numbers, dots (.), and underscores (_) are allowed.",
    };
  }
  if (!/^[a-z0-9]/.test(normalized) || !/[a-z0-9]$/.test(normalized)) {
    return { valid: false, error: "Username cannot start or end with a dot or underscore." };
  }
  if (
    normalized.includes("..") ||
    normalized.includes("__") ||
    normalized.includes("._") ||
    normalized.includes("_.")
  ) {
    return { valid: false, error: "Username cannot contain consecutive dots or underscores." };
  }
  return { valid: true };
}

// 0. Username Availability Check (Debounced, Cached, Indexed lookup)
router.get("/username/check", async (req: Request, res: Response): Promise<any> => {
  try {
    const rawUsername = typeof req.query["username"] === "string" ? req.query["username"] : "";
    const currentUserId = typeof req.query["currentUserId"] === "string" ? req.query["currentUserId"] : "";
    const normalized = rawUsername.trim().toLowerCase();

    if (!normalized) {
      return res.status(400).json({
        username: "",
        available: false,
        message: "Username cannot be empty",
        invalidFormat: true,
      });
    }

    // Step 1: Format validation
    const formatCheck = validateUsernameFormat(normalized);
    if (!formatCheck.valid) {
      return res.json({
        username: normalized,
        available: false,
        message: formatCheck.error,
        invalidFormat: true,
      });
    }

    // Step 2: In-Memory Cache Lookup
    const now = Date.now();
    const cached = usernameCache.get(normalized);
    if (cached && cached.expiresAt > now) {
      const isAvailableForUser =
        cached.available || (Boolean(currentUserId) && cached.ownerId === currentUserId);
      return res.json({
        username: normalized,
        available: isAvailableForUser,
        message: isAvailableForUser ? "Username is available!" : "Username is already taken",
        cached: true,
      });
    }

    // Step 3: Indexed MongoDB Lookup
    const existing = await User.findOne({ username: normalized }).select("_id").lean();
    const ownerId = existing ? (existing as any)._id.toString() : undefined;
    const isAvailable = !existing || (Boolean(currentUserId) && ownerId === currentUserId);
    const message = isAvailable ? "Username is available!" : "Username is already taken";

    // Cache the lookup result
    usernameCache.set(normalized, {
      available: !existing,
      ownerId,
      message,
      expiresAt: now + 60000,
    });

    return res.json({
      username: normalized,
      available: Boolean(isAvailable),
      message,
    });
  } catch (err: any) {
    console.error("[UsernameCheck] Error:", err);
    return res.status(500).json({ error: "Could not verify username, please retry." });
  }
});

// 1. Leaderboard (Global, Country, State, City + Name/Username Search)
router.get("/leaderboard", async (req: Request, res: Response): Promise<any> => {
  try {
    const scope = (typeof req.query["scope"] === "string" ? req.query["scope"] : "global").toLowerCase();
    const country = typeof req.query["country"] === "string" ? req.query["country"].trim() : "";
    const state = typeof req.query["state"] === "string" ? req.query["state"].trim() : "";
    const city = typeof req.query["city"] === "string" ? req.query["city"].trim() : "";
    const search = typeof req.query["search"] === "string" ? req.query["search"].trim() : "";

    // Registered (email) users: always added & visible on leaderboard
    // Guest users: added ONLY after completing at least 1 match
    const baseCondition: any = {
      $or: [
        { isGuest: false },
        { isGuest: true, matchesPlayed: { $gte: 1 } },
      ],
    };

    let query: any = { ...baseCondition };

    if (scope === "country" && country && country !== "All" && country !== "Global") {
      query.country = { $regex: new RegExp(`^${country}$`, "i") };
    } else if (scope === "state" && state && state !== "All") {
      if (country && country !== "All" && country !== "Global") {
        query.country = { $regex: new RegExp(`^${country}$`, "i") };
      }
      query.state = { $regex: new RegExp(`^${state}$`, "i") };
    } else if (scope === "city" && city && city !== "All") {
      query.city = { $regex: new RegExp(`^${city}$`, "i") };
    }

    // Search by Display Name or @username
    if (search) {
      const cleanSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query = {
        $and: [
          baseCondition,
          {
            $or: [
              { displayName: { $regex: cleanSearch, $options: "i" } },
              { username: { $regex: cleanSearch, $options: "i" } },
            ],
          },
        ],
      };
    }

    const topPlayers = await User.find(query)
      .sort({ wins: -1, imposterWins: -1, matchesPlayed: -1, winRate: -1, createdAt: -1 })
      .limit(100)
      .select("displayName username avatarUrl country state city matchesPlayed wins imposterWins winRate isGuest");

    return res.json({
      leaderboard: topPlayers,
      scope,
      country: country || "India",
      state: state || "Maharashtra",
      city: city || "Mumbai",
      count: topPlayers.length,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// 1b. Real Leaderboard Champion for Tournament Desk
router.get("/leaderboard/champion", async (_req: Request, res: Response): Promise<any> => {
  try {
    // 1. Try finding registered top player with wins
    let topPlayer = await User.findOne({ isGuest: false, wins: { $gt: 0 } })
      .sort({ wins: -1, winRate: -1, matchesPlayed: -1 })
      .select("displayName username wins winRate matchesPlayed country city isGuest")
      .lean();

    // 2. If no registered player with wins, check any player who completed matches and has wins (including guests)
    if (!topPlayer) {
      topPlayer = await User.findOne({ matchesPlayed: { $gte: 1 }, wins: { $gt: 0 } })
        .sort({ wins: -1, winRate: -1, matchesPlayed: -1 })
        .select("displayName username wins winRate matchesPlayed country city isGuest")
        .lean();
    }

    // 3. If still no player with wins, check any registered email user
    if (!topPlayer) {
      topPlayer = await User.findOne({ isGuest: false })
        .sort({ createdAt: -1 })
        .select("displayName username wins winRate matchesPlayed country city isGuest")
        .lean();
    }

    if (topPlayer) {
      const name = topPlayer.username ? `@${topPlayer.username}` : topPlayer.displayName;
      return res.json({
        success: true,
        champion: {
          name,
          displayName: topPlayer.displayName,
          username: topPlayer.username || null,
          wins: topPlayer.wins || 0,
          matchesPlayed: topPlayer.matchesPlayed || 0,
          location: `${topPlayer.city || "Mumbai"}, ${topPlayer.country || "India"}`,
        },
      });
    }

    return res.json({
      success: true,
      champion: {
        name: "Aarav (Top Detective)",
        displayName: "Aarav",
        username: "aarav_detective",
        wins: 0,
        matchesPlayed: 0,
        location: "Mumbai, India",
      },
    });
  } catch (err) {
    return res.json({
      success: true,
      champion: {
        name: "Top Detective",
        displayName: "Top Detective",
        username: null,
        wins: 0,
        matchesPlayed: 0,
        location: "Mumbai, India",
      },
    });
  }
});

// 2. Recent Match History
router.get("/history", async (req: Request, res: Response): Promise<any> => {
  try {
    const matches = await Match.find()
      .sort({ completedAt: -1 })
      .limit(15)
      .select("roomCode mode rounds players imposterNames commonWord imposterWord winnerTeam resultBanner completedAt");

    return res.json({ matches });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 3. Public Waiting Rooms
router.get("/rooms/public", (req: Request, res: Response) => {
  const publicRooms = roomManager.getPublicRooms();
  res.json({ rooms: publicRooms });
});

// 4. Update Profile (DisplayName, Username, City, State, Country)
router.post("/user/update", async (req: Request, res: Response): Promise<any> => {
  const { userId, displayName, username, country, state, city } = req.body;
  if (!isValidObjectId(userId) || !displayName || typeof displayName !== "string") {
    return res.status(400).json({ error: "Invalid userId or displayName" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cleanDisplayName = sanitizeText(displayName, 25);

    // If current user is a guest, prevent taking a registered user's display name or username
    if (user.isGuest) {
      const registeredConflict = await User.findOne({
        isGuest: false,
        $or: [
          { displayName: { $regex: new RegExp(`^${cleanDisplayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
          { username: cleanDisplayName.toLowerCase() },
        ],
      });
      if (registeredConflict) {
        return res.status(409).json({
          error: "This name is reserved by a registered player. Please choose another name or sign in with Google.",
        });
      }
    }

    user.displayName = cleanDisplayName;
    if (country && typeof country === "string") user.country = sanitizeText(country, 50);
    if (state && typeof state === "string") user.state = sanitizeText(state, 50);
    if (city && typeof city === "string") user.city = sanitizeText(city, 50);

    // If username is provided, validate & check uniqueness (only for registered non-guest accounts)
    if (username && typeof username === "string") {
      if (user.isGuest) {
        return res.status(403).json({
          error: "Custom @username handle is locked for guest accounts. Please sign in with Google to claim your handle.",
        });
      }

      const normalizedUsername = username.trim().toLowerCase();
      const formatCheck = validateUsernameFormat(normalizedUsername);
      if (!formatCheck.valid) {
        return res.status(400).json({ error: formatCheck.error });
      }

      // Check if another user owns this username
      const existingUser = await User.findOne({ username: normalizedUsername });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ error: "Username is already taken by another student." });
      }

      user.username = normalizedUsername;
      // Invalidate cache
      usernameCache.delete(normalizedUsername);
    }

    await user.save();

    // Re-issue refreshed JWT session token so user's changed name is preserved everywhere
    const newToken = generateToken({
      _id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isGuest: user.isGuest,
    });

    res.cookie("session_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    if (user.isGuest) {
      res.cookie("guest_id", user._id.toString(), {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    return res.json({
      success: true,
      token: newToken,
      user: {
        id: user._id.toString(),
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        country: user.country || "India",
        state: user.state || "Maharashtra",
        city: user.city || "Mumbai",
        matchesPlayed: user.matchesPlayed || 0,
        wins: user.wins || 0,
        imposterWins: user.imposterWins || 0,
        winRate: user.winRate || 0,
        isGuest: user.isGuest,
        isAdmin: isUserAdmin(user.email),
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username is already registered. Please choose another." });
    }
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// 5. Random Word Pair (for Local Pass & Play and custom queries)
router.get("/words/random", async (req: Request, res: Response): Promise<any> => {
  try {
    const category = typeof req.query["category"] === "string" ? req.query["category"] : undefined;
    const difficulty = typeof req.query["difficulty"] === "string" ? req.query["difficulty"] : undefined;
    const language = typeof req.query["language"] === "string" ? req.query["language"] : undefined;

    const pair = await getRandomWordPair({ category, difficulty, language });
    return res.json(pair);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get random word pair" });
  }
});

// 6. Word Categories Breakdown
router.get("/words/categories", async (req: Request, res: Response): Promise<any> => {
  try {
    const totalCount = await (WordPair as any).countDocuments({ active: true });
    const breakdown = await (WordPair as any).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.json({ total: totalCount, categories: breakdown });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch word categories" });
  }
});

// 7. Supporter Wall: Get public supporters (Strictly verified only)
router.get("/supporters", async (_req: Request, res: Response): Promise<any> => {
  try {
    const list = await (Supporter as any)
      .find({
        $or: [
          { isVerified: true },
          { status: "approved" },
        ],
      })
      .sort({ paidAt: -1 })
      .limit(100)
      .select("name amount message paidAt showAmount isVerified createdAt")
      .lean();

    return res.json({
      success: true,
      supporters: list.map((s: any) => ({
        id: s._id.toString(),
        name: s.name,
        amount: s.amount,
        message: s.message || null,
        paid_at: s.paidAt ? new Date(s.paidAt).toISOString() : new Date(s.createdAt).toISOString(),
        show_amount: Boolean(s.showAmount),
        is_verified: s.isVerified !== false,
      })),
    });
  } catch (err) {
    console.error("[Supporters] Fetch error:", err);
    return res.json({ success: true, supporters: [] });
  }
});

// 8. Supporter Wall: Add supporter details (Saved as pending review by default)
router.post("/supporters", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, amount, message, showAmount } = req.body;
    const cleanName = sanitizeText(name, 50);

    if (!cleanName) {
      return res.status(400).json({ error: "Name is required" });
    }

    const cleanAmount = Math.max(0, parseInt(amount, 10) || 0);
    const cleanMessage = sanitizeText(message, 500);

    const doc = await Supporter.create({
      name: cleanName,
      amount: cleanAmount,
      message: cleanMessage,
      showAmount: Boolean(showAmount),
      isVerified: false,
      status: "pending",
      paidAt: new Date(),
    });

    return res.json({
      success: true,
      pending: true,
      message: "Thank you! Your support submission has been received and is pending admin approval before appearing on the wall.",
      supporter: {
        id: doc._id.toString(),
        name: doc.name,
        amount: doc.amount,
        message: doc.message || null,
        paid_at: doc.paidAt.toISOString(),
        show_amount: doc.showAmount,
        is_verified: false,
        status: "pending",
      },
    });
  } catch (err: any) {
    console.error("[Supporters] Create error:", err);
    return res.status(500).json({ error: "Failed to record support details" });
  }
});

export default router;
