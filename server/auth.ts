import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "./models/User";
import { isUserAdmin, authLimiter, isValidObjectId, sanitizeText } from "./security";

const router = Router();
router.use(authLimiter);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "imposter-world-secret-jwt-key-2026";

function resolveRedirectUri(req: Request, fallbackPath: string = "/auth/google/callback"): string {
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
  const isProd =
    process.env.NODE_ENV === "production" ||
    (host && !host.includes("localhost") && !host.includes("127.0.0.1"));

  // Check if GOOGLE_REDIRECT_URI is set
  if (process.env.GOOGLE_REDIRECT_URI) {
    const envUri = process.env.GOOGLE_REDIRECT_URI.trim();
    // In production, ignore misconfigured localhost env URIs
    if (isProd && (envUri.includes("localhost") || envUri.includes("127.0.0.1"))) {
      console.warn(
        `[Auth] Ignoring invalid localhost GOOGLE_REDIRECT_URI (${envUri}) on production request to host: ${host}`
      );
    } else {
      return envUri;
    }
  }

  // Derive from incoming request host (Render, custom domain, etc.)
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const proto = (req.headers["x-forwarded-proto"] as string) || (req.secure ? "https" : "https");
    return `${proto}://${host}${fallbackPath}`;
  }

  // Fallback to Render external URL if defined
  if (process.env.RENDER_EXTERNAL_URL) {
    return `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}${fallbackPath}`;
  }

  return `http://localhost:8080${fallbackPath}`;
}

export function generateToken(user: {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isGuest?: boolean;
}): string {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || "",
      isGuest: Boolean(user.isGuest),
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 1. Get Google OAuth URL
router.get("/google/url", (req: Request, res: Response) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirectUri = resolveRedirectUri(req, "/auth/google/callback");
  const options = {
    redirect_uri: redirectUri,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  res.json({ url: `${rootUrl}?${qs}` });
});

// Shared Google Auth Code Exchanger with automatic fallback for callback URIs
async function exchangeGoogleAuthCode(code: string, redirectUriOverride?: string) {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  
  const candidateUris = Array.from(
    new Set(
      [
        redirectUriOverride,
        process.env.GOOGLE_REDIRECT_URI,
        "https://imposter-world.onrender.com/auth/google/callback",
        "https://imposter-world.onrender.com/api/auth/google/callback",
        "http://localhost:8080/api/auth/google/callback",
        "http://localhost:8080/auth/google/callback",
      ].filter((u): u is string => typeof u === "string" && u.length > 0)
    )
  );

  let tokenData: any = null;
  let lastError: any = null;

  for (const redirectUri of candidateUris) {
    const values = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    try {
      const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(values).toString(),
      });

      tokenData = await tokenRes.json();
      if (tokenRes.ok && tokenData.access_token) {
        break;
      } else {
        lastError = tokenData;
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  if (!tokenData || !tokenData.access_token) {
    console.error("[Auth] Google token exchange failed on all candidate URIs:", lastError);
    throw new Error(
      lastError?.error_description || lastError?.error || "Failed to exchange Google token"
    );
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const googleUser = await userRes.json();

  if (!googleUser.email) {
    throw new Error("Could not retrieve verified email from Google");
  }

  let user = await User.findOne({ email: googleUser.email.toLowerCase() });
  if (!user) {
    user = await User.create({
      googleId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      displayName: googleUser.name || googleUser.given_name || "Detective",
      avatarUrl: googleUser.picture || "",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      matchesPlayed: 0,
      wins: 0,
      imposterWins: 0,
      winRate: 0,
      isGuest: false,
    });
  } else {
    // CRITICAL: Preserve custom chosen displayName!
    // NEVER overwrite user's saved displayName with googleUser.name on re-login
    if (!user.displayName || user.displayName.trim() === "" || user.displayName.toLowerCase() === "detective") {
      user.displayName = googleUser.name || googleUser.given_name || "Detective";
    }
    if (googleUser.picture && !user.avatarUrl) {
      user.avatarUrl = googleUser.picture;
    }
    if (googleUser.sub && !user.googleId) {
      user.googleId = googleUser.sub;
    }
    user.isGuest = false;
    await user.save();
  }

  const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    isGuest: false,
  });

  return { user, token };
}

// 2. Handle Google OAuth Callback (POST - from frontend proxy/client)
router.post("/google/callback", async (req: Request, res: Response): Promise<any> => {
  const { code, redirectUri } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const preferredUri = redirectUri || resolveRedirectUri(req, "/auth/google/callback");
    const { user, token } = await exchangeGoogleAuthCode(code, preferredUri);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        country: user.country || "India",
        state: user.state || "Maharashtra",
        city: user.city || "Mumbai",
        matchesPlayed: user.matchesPlayed,
        wins: user.wins,
        imposterWins: user.imposterWins,
        winRate: user.winRate,
        isGuest: false,
      },
    });
  } catch (error: any) {
    console.error("[Auth] Google Callback Error:", error);
    return res.status(500).json({ error: error.message || "Google Authentication failed" });
  }
});

// 2b. Handle Google OAuth Callback (GET - direct browser redirect fallback)
router.get("/google/callback", async (req: Request, res: Response): Promise<any> => {
  const code = typeof req.query.code === "string" ? req.query.code : "";
  const error = typeof req.query.error === "string" ? req.query.error : "";

  if (error || !code) {
    return res.redirect(`/?login=error&message=${encodeURIComponent(error || "Missing auth code")}`);
  }

  try {
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
    const proto = (req.headers["x-forwarded-proto"] as string) || (req.secure ? "https" : "https");
    const incomingUri = `${proto}://${host}${req.baseUrl}${req.path}`;

    const { token } = await exchangeGoogleAuthCode(code, incomingUri);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/?login=success");
  } catch (err: any) {
    console.error("[Auth] Direct Google GET Callback Error:", err);
    return res.redirect(`/?login=error&message=${encodeURIComponent(err.message || "Auth failed")}`);
  }
});

// 3. Guest Login (Instant Play with Persistent Guest ID & Anti-Collision)
router.post("/guest", async (req: Request, res: Response): Promise<any> => {
  const { name, guestId } = req.body || {};
  const cookieGuestId = req.cookies?.guest_id;
  const targetGuestId =
    guestId && isValidObjectId(guestId)
      ? guestId
      : cookieGuestId && isValidObjectId(cookieGuestId)
      ? cookieGuestId
      : null;

  try {
    // 1. If an existing persistent guest ID is provided, reuse that exact guest record!
    if (targetGuestId) {
      const existingGuest = await User.findOne({ _id: targetGuestId, isGuest: true });
      if (existingGuest) {
        if (
          name &&
          typeof name === "string" &&
          name.trim() &&
          name.trim().toLowerCase() !== "detective" &&
          existingGuest.displayName.startsWith("Guest_")
        ) {
          existingGuest.displayName = sanitizeText(name.trim(), 25);
          await existingGuest.save();
        }

        const token = generateToken({
          _id: existingGuest._id.toString(),
          email: existingGuest.email,
          displayName: existingGuest.displayName,
          isGuest: true,
        });

        res.cookie("session_token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });
        res.cookie("guest_id", existingGuest._id.toString(), {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          success: true,
          token,
          user: {
            id: existingGuest._id.toString(),
            displayName: existingGuest.displayName,
            username: existingGuest.username,
            email: existingGuest.email,
            avatarUrl: "",
            country: existingGuest.country || "India",
            state: existingGuest.state || "Maharashtra",
            city: existingGuest.city || "Mumbai",
            matchesPlayed: existingGuest.matchesPlayed || 0,
            wins: existingGuest.wins || 0,
            imposterWins: existingGuest.imposterWins || 0,
            winRate: existingGuest.winRate || 0,
            isGuest: true,
            isAdmin: false,
          },
        });
      }
    }

    // 2. Otherwise create a fresh guest user
    const rawName = (name || "").trim().slice(0, 30);
    const guestNumber = Math.floor(1000 + Math.random() * 9000);
    let finalDisplayName = rawName;

    if (!finalDisplayName || finalDisplayName.toLowerCase() === "detective") {
      finalDisplayName = `Guest_${guestNumber}`;
    } else {
      // Prevent guests from claiming/spoofing a registered user's name or handle
      const registeredConflict = await User.findOne({
        isGuest: false,
        $or: [
          { displayName: { $regex: new RegExp(`^${finalDisplayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
          { username: finalDisplayName.toLowerCase() },
        ],
      });

      if (registeredConflict) {
        finalDisplayName = `${finalDisplayName} (Guest #${guestNumber})`;
      }
    }

    const guestUser = await User.create({
      email: `guest_${Date.now()}_${guestNumber}@imposterworld.local`,
      displayName: finalDisplayName,
      avatarUrl: "",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      matchesPlayed: 0,
      wins: 0,
      imposterWins: 0,
      winRate: 0,
      isGuest: true,
    });

    const token = generateToken({
      _id: guestUser._id.toString(),
      email: guestUser.email,
      displayName: guestUser.displayName,
      isGuest: true,
    });

    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.cookie("guest_id", guestUser._id.toString(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: guestUser._id.toString(),
        displayName: guestUser.displayName,
        username: guestUser.username,
        email: guestUser.email,
        avatarUrl: "",
        country: guestUser.country || "India",
        state: guestUser.state || "Maharashtra",
        city: guestUser.city || "Mumbai",
        matchesPlayed: 0,
        wins: 0,
        imposterWins: 0,
        winRate: 0,
        isGuest: true,
        isAdmin: false,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to create guest user" });
  }
});

// 4. Get Current User (/me)
router.get("/me", async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies?.session_token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !isValidObjectId(decoded.userId)) {
      return res.status(401).json({ user: null });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ user: null });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        country: user.country || "India",
        state: user.state || "Maharashtra",
        city: user.city || "Mumbai",
        matchesPlayed: user.matchesPlayed,
        wins: user.wins,
        imposterWins: user.imposterWins,
        winRate: user.winRate,
        isGuest: user.isGuest,
        isAdmin: isUserAdmin(user.email),
      },
    });
  } catch (err) {
    return res.status(401).json({ user: null });
  }
});

// 5. Logout (Clears session cookie and restores previous persistent Guest account)
router.post("/logout", async (req: Request, res: Response): Promise<any> => {
  const { guestId } = req.body || {};
  const cookieGuestId = req.cookies?.guest_id;
  const targetGuestId =
    guestId && isValidObjectId(guestId)
      ? guestId
      : cookieGuestId && isValidObjectId(cookieGuestId)
      ? cookieGuestId
      : null;

  res.clearCookie("session_token");

  if (targetGuestId) {
    try {
      const guestUser = await User.findOne({ _id: targetGuestId, isGuest: true });
      if (guestUser) {
        const guestToken = generateToken({
          _id: guestUser._id.toString(),
          email: guestUser.email,
          displayName: guestUser.displayName,
          isGuest: true,
        });

        res.cookie("session_token", guestToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          success: true,
          guestRestored: true,
          guestUser: {
            id: guestUser._id.toString(),
            displayName: guestUser.displayName,
            username: guestUser.username,
            email: guestUser.email,
            avatarUrl: "",
            country: guestUser.country || "India",
            state: guestUser.state || "Maharashtra",
            city: guestUser.city || "Mumbai",
            matchesPlayed: guestUser.matchesPlayed || 0,
            wins: guestUser.wins || 0,
            imposterWins: guestUser.imposterWins || 0,
            winRate: guestUser.winRate || 0,
            isGuest: true,
            isAdmin: false,
          },
        });
      }
    } catch {}
  }

  res.json({ success: true, guestRestored: false, guestUser: null });
});

export default router;
