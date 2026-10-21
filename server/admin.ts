import { Router, Response } from "express";
import { User } from "./models/User";
import { Match } from "./models/Match";
import { WordPair } from "./models/WordPair";
import { Supporter } from "./models/Supporter";
import { RoomManager } from "./game/roomManager";
import { getSocketIO } from "./socket";
import {
  requireAdmin,
  AuthenticatedAdminRequest,
  adminLimiter,
  isValidObjectId,
  sanitizeText,
} from "./security";

const router = Router();
const roomManager = RoomManager.getInstance();

// Apply Admin Rate Limiting (35 requests/min + auto IP ban on unauthorized probes)
router.use(adminLimiter);

// 0. Verify Admin Access (Strict Stealth Authorization)
router.get("/verify", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response) => {
  res.json({
    success: true,
    isAdmin: true,
    displayName: req.adminUser?.displayName || "Principal",
    avatarUrl: req.adminUser?.avatarUrl || "",
  });
});

// 1. Dashboard Overview Stats
router.get("/stats", requireAdmin, async (_req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const [
      totalUsers,
      registeredUsers,
      guestUsers,
      totalMatches,
      totalWords,
      totalSupporters,
      supportAgg,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isGuest: false }),
      User.countDocuments({ isGuest: true }),
      Match.countDocuments({}),
      WordPair.countDocuments({}),
      Supporter.countDocuments({}),
      Supporter.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    const activeRooms = roomManager.getAllRooms();
    const livePlayersCount = activeRooms.reduce((acc, r) => acc + r.players.size, 0);
    const mem = process.memoryUsage();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        registeredUsers,
        guestUsers,
        totalMatches,
        totalWords,
        totalSupporters,
        totalSupportAmount: supportAgg[0]?.total || 0,
        activeRoomsCount: activeRooms.length,
        livePlayersCount,
        serverUptimeSec: Math.floor(process.uptime()),
        memoryRssMb: Math.round(mem.rss / (1024 * 1024)),
        memoryHeapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
        nodeVersion: process.version,
      },
    });
  } catch (err: any) {
    console.error("[Admin Stats Error]:", err.message);
    return res.status(500).json({ error: "Failed to gather statistics" });
  }
});

// 2. Live Game Rooms Monitor
router.get("/rooms", requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const rooms = roomManager.getAllRooms().map((r) => {
      const playersList = r.getPlayerList().map((p) => ({
        socketId: p.socketId,
        displayName: p.displayName,
        userId: p.userId,
        isHost: p.isHost,
        score: p.score,
        isGuest: Boolean(p.userId?.startsWith("guest_")),
      }));

      const hostPlayer = playersList.find((p) => p.isHost);

      return {
        roomCode: r.code,
        hostName: hostPlayer?.displayName || "Unknown",
        playersCount: playersList.length,
        maxPlayers: r.settings.capacity,
        gameMode: r.settings.gameMode,
        phase: r.phase,
        currentRound: r.currentRound,
        isPublic: r.settings.isPublic,
        category: r.settings.category || "All",
        players: playersList,
      };
    });

    res.json({ success: true, count: rooms.length, rooms });
  } catch {
    res.status(500).json({ error: "Failed to retrieve live rooms" });
  }
});

// 3. Force Close / Disband a Room
router.post("/rooms/close", requireAdmin, (req: AuthenticatedAdminRequest, res: Response): any => {
  const { roomCode } = req.body;
  if (!roomCode || typeof roomCode !== "string") {
    return res.status(400).json({ error: "Invalid room code" });
  }

  const cleanCode = roomCode.trim().toUpperCase().slice(0, 10);
  const room = roomManager.getRoom(cleanCode);
  if (!room) {
    return res.status(404).json({ error: "Room not found or already closed" });
  }

  const io = getSocketIO();
  if (io) {
    io.to(cleanCode).emit("room:disbanded", {
      reason: "This room was closed by the Classroom Principal Administrator.",
    });
  }

  roomManager.removeRoom(cleanCode);
  res.json({ success: true, message: `Room #${cleanCode} has been disbanded.` });
});

// 4. Users Directory (Search & Paginated)
router.get("/users", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 50) : "";
    const filter = typeof req.query.filter === "string" ? req.query.filter : "all";
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filter === "registered") {
      query.isGuest = false;
    } else if (filter === "guests") {
      query.isGuest = true;
    }

    if (search) {
      const clean = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { displayName: { $regex: clean, $options: "i" } },
        { username: { $regex: clean, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "displayName username avatarUrl country state city matchesPlayed wins imposterWins winRate isGuest createdAt"
        )
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users: users.map((u: any) => ({
        id: u._id.toString(),
        displayName: u.displayName,
        username: u.username || null,
        avatarUrl: u.avatarUrl || "",
        country: u.country || "India",
        state: u.state || "Maharashtra",
        city: u.city || "Mumbai",
        matchesPlayed: u.matchesPlayed || 0,
        wins: u.wins || 0,
        imposterWins: u.imposterWins || 0,
        winRate: u.winRate || 0,
        isGuest: Boolean(u.isGuest),
        createdAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("[Admin Users Error]:", err.message);
    res.status(500).json({ error: "Failed to list users" });
  }
});

// 5. Update User Profile as Admin
router.post("/users/update", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { userId, displayName, username, wins, matchesPlayed, country, state, city } = req.body;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user identifier" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (displayName && typeof displayName === "string") {
      user.displayName = sanitizeText(displayName, 25);
    }
    if (username !== undefined) {
      user.username = username && typeof username === "string" ? sanitizeText(username, 20).toLowerCase() : undefined;
    }
    if (country && typeof country === "string") {
      user.country = sanitizeText(country, 50);
    }
    if (state && typeof state === "string") {
      user.state = sanitizeText(state, 50);
    }
    if (city && typeof city === "string") {
      user.city = sanitizeText(city, 50);
    }
    if (typeof wins === "number" && Number.isFinite(wins)) {
      user.wins = Math.max(0, Math.floor(wins));
    }
    if (typeof matchesPlayed === "number" && Number.isFinite(matchesPlayed)) {
      user.matchesPlayed = Math.max(0, Math.floor(matchesPlayed));
    }

    if (user.matchesPlayed > 0) {
      user.winRate = Math.round((user.wins / user.matchesPlayed) * 100);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (err: any) {
    console.error("[Admin Update User Error]:", err.message);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// 6. Delete a User Account
router.delete("/users/:id", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const targetId = req.params.id;
    if (!isValidObjectId(targetId)) {
      return res.status(400).json({ error: "Invalid identifier" });
    }

    if (targetId === req.adminUser._id.toString()) {
      return res.status(400).json({ error: "Cannot delete the active admin account!" });
    }

    await User.findByIdAndDelete(targetId);
    res.json({ success: true, message: "User account deleted." });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 7. Word Bank Manager (Search & List)
router.get("/words", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 50) : "";
    const category = typeof req.query.category === "string" ? req.query.category.slice(0, 50) : "";
    const difficulty = typeof req.query.difficulty === "string" ? req.query.difficulty.slice(0, 20) : "";
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit), 10) || 25));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (category && category !== "All") query.category = category;
    if (difficulty && difficulty !== "all") query.difficulty = difficulty;

    if (search) {
      const clean = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { commonWord: { $regex: clean, $options: "i" } },
        { imposterWord: { $regex: clean, $options: "i" } },
        { category: { $regex: clean, $options: "i" } },
      ];
    }

    const [words, total, categories] = await Promise.all([
      WordPair.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      WordPair.countDocuments(query),
      WordPair.distinct("category"),
    ]);

    res.json({
      success: true,
      words: words.map((w: any) => ({
        id: w._id.toString(),
        category: w.category,
        commonWord: w.commonWord,
        imposterWord: w.imposterWord,
        difficulty: w.difficulty,
        language: w.language || "en",
        active: w.active !== false,
      })),
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("[Admin Words Error]:", err.message);
    res.status(500).json({ error: "Failed to fetch word bank" });
  }
});

// 8. Add New Word Pair
router.post("/words", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { category, commonWord, imposterWord, difficulty, language } = req.body;
    if (!category || !commonWord || !imposterWord) {
      return res.status(400).json({ error: "Category, Common Word, and Imposter Word are required." });
    }

    const cleanCat = sanitizeText(category, 50);
    const cleanCommon = sanitizeText(commonWord, 50);
    const cleanImposter = sanitizeText(imposterWord, 50);

    const doc = await WordPair.create({
      category: cleanCat,
      commonWord: cleanCommon,
      imposterWord: cleanImposter,
      difficulty: difficulty === "hard" || difficulty === "medium" ? difficulty : "easy",
      language: language === "hi" ? "hi" : "en",
      active: true,
    });

    res.json({ success: true, message: "Word pair added to database!", word: doc });
  } catch {
    res.status(500).json({ error: "Failed to add word pair" });
  }
});

// 9. Delete Word Pair
router.delete("/words/:id", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid identifier" });
    }
    await WordPair.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Word pair removed." });
  } catch {
    res.status(500).json({ error: "Failed to delete word pair" });
  }
});

// 10. Live System Announcement to All Active Game Rooms
router.post("/broadcast", requireAdmin, (req: AuthenticatedAdminRequest, res: Response): any => {
  const { message } = req.body;
  const cleanMessage = sanitizeText(message, 250);

  if (!cleanMessage) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  const io = getSocketIO();
  if (io) {
    io.emit("classroom:announcement", {
      message: cleanMessage,
      from: "Classroom Principal",
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    message: "Broadcast announcement dispatched to all connected players and rooms!",
  });
});

// 11. Supporters Wall Moderation: List all supporters with status & filter
router.get("/supporters", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 50) : "";
    const status = typeof req.query.status === "string" ? req.query.status : "all";
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit), 10) || 30));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status === "pending") {
      query.$or = [{ status: "pending" }, { isVerified: false }];
    } else if (status === "approved" || status === "verified") {
      query.$or = [{ status: "approved" }, { isVerified: true }];
    } else if (status === "rejected") {
      query.status = "rejected";
    }

    if (search) {
      const clean = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchOr = [
        { name: { $regex: clean, $options: "i" } },
        { message: { $regex: clean, $options: "i" } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    const [supporters, total, pendingCount, approvedCount, rejectedCount, agg] = await Promise.all([
      Supporter.find(query).sort({ paidAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Supporter.countDocuments(query),
      Supporter.countDocuments({ $or: [{ status: "pending" }, { isVerified: false }] }),
      Supporter.countDocuments({ $or: [{ status: "approved" }, { isVerified: true }] }),
      Supporter.countDocuments({ status: "rejected" }),
      Supporter.aggregate([
        { $match: { $or: [{ status: "approved" }, { isVerified: true }] } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return res.json({
      success: true,
      supporters: supporters.map((s: any) => ({
        id: s._id.toString(),
        name: s.name,
        amount: s.amount,
        message: s.message || "",
        paidAt: s.paidAt ? new Date(s.paidAt).toISOString() : new Date(s.createdAt).toISOString(),
        showAmount: Boolean(s.showAmount),
        isVerified: Boolean(s.isVerified),
        status: s.status || (s.isVerified ? "approved" : "pending"),
        notes: s.notes || "",
        createdAt: s.createdAt,
      })),
      counts: {
        total,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalApprovedAmount: agg[0]?.total || 0,
      },
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("[Admin Supporters Error]:", err.message);
    return res.status(500).json({ error: "Failed to fetch supporters" });
  }
});

// 12. Add New Supporter directly from Admin Panel
router.post("/supporters", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { name, amount, message, showAmount, isVerified, notes } = req.body;
    const cleanName = sanitizeText(name, 50);

    if (!cleanName) {
      return res.status(400).json({ error: "Supporter name is required." });
    }

    const cleanAmount = Math.max(0, parseInt(amount, 10) || 0);
    const cleanMessage = sanitizeText(message || "", 500);
    const cleanNotes = sanitizeText(notes || "", 500);
    const verified = isVerified !== false;

    const doc = await Supporter.create({
      name: cleanName,
      amount: cleanAmount,
      message: cleanMessage,
      showAmount: showAmount !== false,
      isVerified: verified,
      status: verified ? "approved" : "pending",
      notes: cleanNotes,
      paidAt: new Date(),
    });

    return res.json({
      success: true,
      message: `Supporter "${cleanName}" added ${verified ? "and published to Supporter Wall! 🌟" : "as pending review."}`,
      supporter: {
        id: doc._id.toString(),
        name: doc.name,
        amount: doc.amount,
        message: doc.message,
        paidAt: doc.paidAt.toISOString(),
        showAmount: doc.showAmount,
        isVerified: doc.isVerified,
        status: doc.status,
        notes: doc.notes,
      },
    });
  } catch (err: any) {
    console.error("[Admin Add Supporter Error]:", err.message);
    return res.status(500).json({ error: "Failed to add supporter" });
  }
});

// 13. Verify / Approve / Reject Supporter
router.patch("/supporters/:id/verify", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid supporter identifier." });
    }

    const { isVerified, status, notes } = req.body;
    const doc = await Supporter.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Supporter not found." });
    }

    const verified = Boolean(isVerified);
    doc.isVerified = verified;
    doc.status = verified ? "approved" : status === "rejected" ? "rejected" : "pending";
    if (typeof notes === "string") {
      doc.notes = sanitizeText(notes, 500);
    }

    await doc.save();

    return res.json({
      success: true,
      message: verified
        ? `Supporter "${doc.name}" verified and published to public wall! 🌟`
        : `Supporter "${doc.name}" set to ${doc.status} (hidden from public wall).`,
      supporter: {
        id: doc._id.toString(),
        name: doc.name,
        amount: doc.amount,
        isVerified: doc.isVerified,
        status: doc.status,
      },
    });
  } catch (err: any) {
    console.error("[Admin Verify Supporter Error]:", err.message);
    return res.status(500).json({ error: "Failed to update verification status" });
  }
});

// 14. Update Supporter Details
router.patch("/supporters/:id", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid supporter identifier." });
    }

    const { name, amount, message, showAmount, isVerified, status, notes } = req.body;
    const doc = await Supporter.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Supporter not found." });
    }

    if (name && typeof name === "string") {
      doc.name = sanitizeText(name, 50);
    }
    if (typeof amount === "number" || typeof amount === "string") {
      doc.amount = Math.max(0, parseInt(String(amount), 10) || 0);
    }
    if (typeof message === "string") {
      doc.message = sanitizeText(message, 500);
    }
    if (typeof showAmount === "boolean") {
      doc.showAmount = showAmount;
    }
    if (typeof isVerified === "boolean") {
      doc.isVerified = isVerified;
      if (isVerified && doc.status !== "approved") {
        doc.status = "approved";
      }
    }
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      doc.status = status;
      if (status === "approved") doc.isVerified = true;
      if (status === "rejected") doc.isVerified = false;
    }
    if (typeof notes === "string") {
      doc.notes = sanitizeText(notes, 500);
    }

    await doc.save();

    return res.json({
      success: true,
      message: "Supporter updated successfully.",
      supporter: {
        id: doc._id.toString(),
        name: doc.name,
        amount: doc.amount,
        message: doc.message,
        showAmount: doc.showAmount,
        isVerified: doc.isVerified,
        status: doc.status,
        notes: doc.notes,
      },
    });
  } catch (err: any) {
    console.error("[Admin Update Supporter Error]:", err.message);
    return res.status(500).json({ error: "Failed to update supporter" });
  }
});

// 15. Delete Supporter
router.delete("/supporters/:id", requireAdmin, async (req: AuthenticatedAdminRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid supporter identifier." });
    }

    await Supporter.findByIdAndDelete(id);
    return res.json({ success: true, message: "Supporter removed from database." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete supporter." });
  }
});

export default router;
