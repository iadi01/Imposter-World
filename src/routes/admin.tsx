import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE } from "../lib/api";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Users,
  Server,
  Radio,
  BookOpen,
  Trophy,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
  LogOut,
  RefreshCw,
  Send,
  AlertTriangle,
  Key,
  Terminal,
  Activity,
  Globe,
  Heart,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Page Not Found — Imposter World" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

interface AdminStats {
  totalUsers: number;
  registeredUsers: number;
  guestUsers: number;
  totalMatches: number;
  totalWords: number;
  totalSupporters: number;
  totalSupportAmount: number;
  activeRoomsCount: number;
  livePlayersCount: number;
  serverUptimeSec: number;
  memoryRssMb: number;
  memoryHeapUsedMb: number;
  nodeVersion: string;
}

interface RoomItem {
  roomCode: string;
  hostName: string;
  playersCount: number;
  maxPlayers: number;
  gameMode: string;
  phase: string;
  currentRound: number;
  isPublic: boolean;
  category: string;
  players: { socketId: string; displayName: string; isHost: boolean; isGuest: boolean }[];
}

interface UserItem {
  id: string;
  displayName: string;
  username: string | null;
  email: string;
  avatarUrl: string;
  country: string;
  state: string;
  city: string;
  matchesPlayed: number;
  wins: number;
  imposterWins: number;
  winRate: number;
  isGuest: boolean;
  createdAt: string;
}

interface WordItem {
  id: string;
  category: string;
  commonWord: string;
  imposterWord: string;
  difficulty: string;
  language: string;
  active: boolean;
}

interface SupporterItem {
  id: string;
  name: string;
  amount: number;
  message: string;
  paidAt: string;
  showAmount: boolean;
  isVerified: boolean;
  status: "pending" | "approved" | "rejected";
  notes: string;
  createdAt: string;
}

interface SupporterCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalApprovedAmount: number;
}

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "rooms" | "users" | "words" | "supporters" | "broadcast"
  >("overview");

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [words, setWords] = useState<WordItem[]>([]);
  const [wordCategories, setWordCategories] = useState<string[]>([]);

  // Supporter moderation states
  const [supporters, setSupporters] = useState<SupporterItem[]>([]);
  const [supporterCounts, setSupporterCounts] = useState<SupporterCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalApprovedAmount: 0,
  });
  const [supporterFilter, setSupporterFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [supporterSearch, setSupporterSearch] = useState("");
  const [loadingSupporters, setLoadingSupporters] = useState(false);

  // Add supporter modal
  const [showAddSupporterModal, setShowAddSupporterModal] = useState(false);
  const [newSupporterName, setNewSupporterName] = useState("");
  const [newSupporterAmount, setNewSupporterAmount] = useState<number>(501);
  const [newSupporterMessage, setNewSupporterMessage] = useState("");
  const [newSupporterShowAmount, setNewSupporterShowAmount] = useState(true);
  const [newSupporterVerified, setNewSupporterVerified] = useState(true);
  const [newSupporterNotes, setNewSupporterNotes] = useState("");

  // Edit supporter modal
  const [editingSupporter, setEditingSupporter] = useState<SupporterItem | null>(null);
  const [editSupporterName, setEditSupporterName] = useState("");
  const [editSupporterAmount, setEditSupporterAmount] = useState<number>(501);
  const [editSupporterMessage, setEditSupporterMessage] = useState("");
  const [editSupporterShowAmount, setEditSupporterShowAmount] = useState(true);
  const [editSupporterVerified, setEditSupporterVerified] = useState(true);
  const [editSupporterStatus, setEditSupporterStatus] = useState<"pending" | "approved" | "rejected">("approved");
  const [editSupporterNotes, setEditSupporterNotes] = useState("");

  // Search & filter states
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [wordSearch, setWordSearch] = useState("");
  const [wordCategoryFilter, setWordCategoryFilter] = useState("All");

  // Form states
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);

  // New word modal
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [newWordCategory, setNewWordCategory] = useState("");
  const [newWordCommon, setNewWordCommon] = useState("");
  const [newWordImposter, setNewWordImposter] = useState("");
  const [newWordDifficulty, setNewWordDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  // Edit user modal
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editWins, setEditWins] = useState(0);

  // Tab loaded cache states for 0ms instantaneous tab switching
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
  const [hasLoadedWords, setHasLoadedWords] = useState(false);
  const [hasLoadedSupporters, setHasLoadedSupporters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Verify Authorization on load (Stealth Mode)
  const verifyAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          setAuthorized(true);
          setCurrentUserEmail(data.displayName || "Principal");
          // Fetch overview stats and live rooms in parallel
          loadDashboardData();
          return;
        }
      }
      setAuthorized(false);
    } catch {
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  // 2. Load Dashboard Data (Supports fast background refresh)
  const loadDashboardData = async (force = false) => {
    try {
      const freshParam = force ? "?fresh=true" : "";
      const [statsRes, roomsRes, supportersRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats${freshParam}`, { credentials: "include" }),
        fetch(`${API_BASE}/api/admin/rooms`, { credentials: "include" }),
        fetch(`${API_BASE}/api/admin/supporters?limit=1`, { credentials: "include" }),
      ]);
      const statsData = await statsRes.json();
      const roomsData = await roomsRes.json();
      const supportersData = await supportersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (roomsData.success) setRooms(roomsData.rooms);
      if (supportersData.success && supportersData.counts) {
        setSupporterCounts(supportersData.counts);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  // 3. Load Users (Cached per tab session)
  const loadUsers = async () => {
    try {
      const params = new URLSearchParams({
        search: userSearch,
        filter: userFilter,
        limit: "50",
      });
      const res = await fetch(`${API_BASE}/api/admin/users?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setHasLoadedUsers(true);
      }
    } catch {
      toast.error("Failed to load users list");
    }
  };

  useEffect(() => {
    if (authorized && activeTab === "users" && !hasLoadedUsers) {
      loadUsers();
    }
  }, [authorized, activeTab, hasLoadedUsers]);

  useEffect(() => {
    if (authorized && activeTab === "users" && hasLoadedUsers) {
      loadUsers();
    }
  }, [userFilter]);

  // 4. Load Words (Cached per tab session)
  const loadWords = async () => {
    try {
      const params = new URLSearchParams({
        search: wordSearch,
        category: wordCategoryFilter,
        limit: "50",
      });
      const res = await fetch(`${API_BASE}/api/admin/words?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setWords(data.words);
        setWordCategories(data.categories || []);
        setHasLoadedWords(true);
      }
    } catch {
      toast.error("Failed to load word pairs");
    }
  };

  useEffect(() => {
    if (authorized && activeTab === "words" && !hasLoadedWords) {
      loadWords();
    }
  }, [authorized, activeTab, hasLoadedWords]);

  useEffect(() => {
    if (authorized && activeTab === "words" && hasLoadedWords) {
      loadWords();
    }
  }, [wordCategoryFilter]);

  // 5. Load Supporters (Cached per tab session)
  const loadSupporters = async () => {
    setLoadingSupporters(true);
    try {
      const params = new URLSearchParams({
        search: supporterSearch,
        status: supporterFilter,
        limit: "50",
      });
      const res = await fetch(`${API_BASE}/api/admin/supporters?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSupporters(data.supporters);
        if (data.counts) setSupporterCounts(data.counts);
        setHasLoadedSupporters(true);
      }
    } catch {
      toast.error("Failed to load supporters list");
    } finally {
      setLoadingSupporters(false);
    }
  };

  useEffect(() => {
    if (authorized && activeTab === "supporters" && !hasLoadedSupporters) {
      loadSupporters();
    }
  }, [authorized, activeTab, hasLoadedSupporters]);

  useEffect(() => {
    if (authorized && activeTab === "supporters" && hasLoadedSupporters) {
      loadSupporters();
    }
  }, [supporterFilter]);

  // Force Full Cache Refresh
  const forceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboardData(true);
      if (activeTab === "users") await loadUsers();
      if (activeTab === "words") await loadWords();
      if (activeTab === "supporters") await loadSupporters();
      toast.success("All classroom records refreshed! ⚡");
    } catch {
      toast.error("Failed to refresh records");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Supporter Action Handlers
  const handleVerifySupporter = async (
    id: string,
    isVerified: boolean,
    status: "approved" | "rejected" | "pending"
  ) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/supporters/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isVerified, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadSupporters();
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to update verification status");
      }
    } catch {
      toast.error("Network error updating supporter status");
    }
  };

  const handleAddSupporter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupporterName.trim()) {
      toast.error("Supporter name is required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/supporters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newSupporterName.trim(),
          amount: newSupporterAmount,
          message: newSupporterMessage.trim(),
          showAmount: newSupporterShowAmount,
          isVerified: newSupporterVerified,
          notes: newSupporterNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setShowAddSupporterModal(false);
        setNewSupporterName("");
        setNewSupporterAmount(501);
        setNewSupporterMessage("");
        setNewSupporterNotes("");
        setNewSupporterShowAmount(true);
        setNewSupporterVerified(true);
        loadSupporters();
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to add supporter");
      }
    } catch {
      toast.error("Error creating supporter");
    }
  };

  const handleSaveEditSupporter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupporter) return;
    if (!editSupporterName.trim()) {
      toast.error("Supporter name is required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/supporters/${editingSupporter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editSupporterName.trim(),
          amount: editSupporterAmount,
          message: editSupporterMessage.trim(),
          showAmount: editSupporterShowAmount,
          isVerified: editSupporterVerified,
          status: editSupporterStatus,
          notes: editSupporterNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Supporter updated successfully!");
        setEditingSupporter(null);
        loadSupporters();
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to update supporter");
      }
    } catch {
      toast.error("Error updating supporter");
    }
  };

  const handleDeleteSupporter = async (id: string, name: string) => {
    if (!confirm(`Permanently remove supporter "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/supporters/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Supporter deleted.");
        loadSupporters();
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to delete supporter");
      }
    } catch {
      toast.error("Error deleting supporter");
    }
  };

  // Force close a room
  const handleCloseRoom = async (roomCode: string) => {
    if (!confirm(`Are you sure you want to disband Room #${roomCode}? Connected players will be disconnected.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/rooms/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roomCode }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to close room");
      }
    } catch {
      toast.error("Network error closing room");
    }
  };

  // Broadcast system announcement
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message to broadcast.");
      return;
    }

    setBroadcasting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: broadcastMessage.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Broadcast dispatched to all live game rooms! 📢");
        setBroadcastMessage("");
      } else {
        toast.error(data.error || "Failed to broadcast");
      }
    } catch {
      toast.error("Network error sending broadcast");
    } finally {
      setBroadcasting(false);
    }
  };

  // Add new word pair
  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordCategory.trim() || !newWordCommon.trim() || !newWordImposter.trim()) {
      toast.error("Please fill all required word fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category: newWordCategory.trim(),
          commonWord: newWordCommon.trim(),
          imposterWord: newWordImposter.trim(),
          difficulty: newWordDifficulty,
          language: "en",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("New word pair added to classroom database!");
        setShowAddWordModal(false);
        setNewWordCommon("");
        setNewWordImposter("");
        loadWords();
      } else {
        toast.error(data.error || "Failed to add word");
      }
    } catch {
      toast.error("Error creating word");
    }
  };

  // Delete word pair
  const handleDeleteWord = async (id: string, name: string) => {
    if (!confirm(`Delete word pair "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/words/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Word pair removed.");
        loadWords();
      }
    } catch {
      toast.error("Error deleting word");
    }
  };

  // Save edited user
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: editingUser.id,
          displayName: editDisplayName.trim(),
          username: editUsername.trim() || undefined,
          wins: editWins,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User profile updated!");
        setEditingUser(null);
        loadUsers();
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch {
      toast.error("Error saving user");
    }
  };

  // Delete user
  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Permanently delete account for "${user.displayName}" (${user.email})?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User deleted.");
        loadUsers();
      } else {
        toast.error(data.error || "Cannot delete user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="sketch bg-card p-8 text-center space-y-3 border-2 border-foreground">
          <Terminal className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="font-display text-2xl font-bold">Checking Classroom Records...</div>
          <p className="text-xs text-muted-foreground font-hand">Opening notebook ledger</p>
        </div>
      </main>
    );
  }

  // ACCESS DENIED / STEALTH 404 SCREEN (Zero Information Leak)
  if (!authorized) {
    return (
      <main className="min-h-screen px-4 py-16 flex items-center justify-center font-hand">
        <div className="notebook relative max-w-md w-full p-8 shadow-2xl border-4 border-foreground text-center space-y-6">
          <div className="tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" />

          <div className="text-6xl font-display font-extrabold text-primary">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Notebook Page Not Found 📝
            </h1>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Looks like this page was torn out or never existed in the classroom ledger. The imposter might have erased the clues!
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/"
              className="sketch inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-display text-base font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 no-underline cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Classroom
            </Link>

            <a
              href={`${API_BASE}/auth/google`}
              className="sketch inline-flex items-center justify-center gap-2 bg-card text-foreground px-5 py-2 font-display text-xs font-bold border-2 border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-muted no-underline cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-primary" />
              Sign In with Authorized Google Account
            </a>
          </div>
        </div>
      </main>
    );
  }

  // AUTHORIZED ADMIN PANEL
  return (
    <main className="min-h-screen px-3 py-4 sm:py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6 font-hand">
        {/* Top Navbar */}
        <header className="sketch bg-card/95 p-4 sm:p-5 border-2 border-foreground flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Principal Office
                </h1>
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Super Admin
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <span>{currentUserEmail}</span>
                <span className="text-green-600 font-bold">● Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={forceRefresh}
              disabled={isRefreshing}
              className="sketch bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
              title="Force-refresh all database counts and records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Fast Refresh"}</span>
            </button>
            <Link
              to="/"
              className="sketch bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Game
            </Link>
            <button
              onClick={() => {
                fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).then(() => {
                  window.location.href = "/";
                });
              }}
              className="sketch bg-accent text-accent-foreground px-3 py-1.5 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <nav className="flex flex-wrap gap-2 border-b-2 border-foreground/20 pb-2">
          {[
            { id: "overview", label: "Dashboard & Stats", icon: Activity },
            { id: "rooms", label: `Live Rooms (${rooms.length})`, icon: Radio },
            { id: "users", label: "Students & Users", icon: Users },
            { id: "words", label: "Word Bank", icon: BookOpen },
            {
              id: "supporters",
              label:
                supporterCounts.pending > 0
                  ? `Supporter Wall (${supporterCounts.pending} Pending ⏳)`
                  : `Supporter Wall (${supporterCounts.total})`,
              icon: Heart,
            },
            { id: "broadcast", label: "Class Megaphone", icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`sketch px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]"
                    : "bg-white/80 text-foreground hover:bg-card"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">
                  {stats.totalUsers}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Total Users</div>
              </div>

              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-green-700">
                  {stats.registeredUsers}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Google Signups</div>
              </div>

              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-amber-700">
                  {stats.activeRoomsCount}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Live Rooms</div>
              </div>

              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-accent">
                  {stats.livePlayersCount}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Live CCU</div>
              </div>

              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-indigo-700">
                  {stats.totalWords}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Word Pairs</div>
              </div>

              <div className="sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-purple-700">
                  {stats.totalMatches}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Matches Played</div>
              </div>
            </div>

            {/* Server Performance Card */}
            <div className="sketch bg-card/90 p-5 border-2 border-foreground space-y-4">
              <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" /> Backend Engine & Memory Health
                </h3>
                <span className="text-xs font-mono font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  Node {stats.nodeVersion} · Online
                </span>
              </div>

              <div className="grid sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white/80 rounded border border-foreground/20">
                  <div className="text-muted-foreground font-bold">Process Uptime</div>
                  <div className="text-lg font-display font-bold text-foreground">
                    {Math.floor(stats.serverUptimeSec / 3600)}h {Math.floor((stats.serverUptimeSec % 3600) / 60)}m
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded border border-foreground/20">
                  <div className="text-muted-foreground font-bold">Memory RSS</div>
                  <div className="text-lg font-display font-bold text-primary">{stats.memoryRssMb} MB</div>
                </div>

                <div className="p-3 bg-white/80 rounded border border-foreground/20">
                  <div className="text-muted-foreground font-bold">Heap Used</div>
                  <div className="text-lg font-display font-bold text-accent">{stats.memoryHeapUsedMb} MB</div>
                </div>

                <div className="p-3 bg-white/80 rounded border border-foreground/20">
                  <div className="text-muted-foreground font-bold">Total Support Logged</div>
                  <div className="text-lg font-display font-bold text-green-700">
                    ₹{stats.totalSupportAmount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ROOMS */}
        {activeTab === "rooms" && (
          <div className="sketch bg-card/90 p-5 border-2 border-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <Radio className="h-5 w-5 text-accent animate-pulse" /> Real-Time Multiplayer Rooms
                </h3>
                <p className="text-xs text-muted-foreground">
                  Active rooms in server RAM. Disband any suspicious room instantly.
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className="sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            {rooms.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No active multiplayer game rooms right now.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="p-2.5">Room Code</th>
                      <th className="p-2.5">Host</th>
                      <th className="p-2.5">Players</th>
                      <th className="p-2.5">Mode</th>
                      <th className="p-2.5">Phase</th>
                      <th className="p-2.5">Round</th>
                      <th className="p-2.5 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10 bg-white/70">
                    {rooms.map((r) => (
                      <tr key={r.roomCode}>
                        <td className="p-2.5 font-mono font-bold text-primary">#{r.roomCode}</td>
                        <td className="p-2.5 font-bold">{r.hostName}</td>
                        <td className="p-2.5">
                          {r.playersCount}/{r.maxPlayers}
                        </td>
                        <td className="p-2.5 uppercase font-bold text-[10px]">{r.gameMode}</td>
                        <td className="p-2.5">
                          <span className="bg-highlight/60 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                            {r.phase}
                          </span>
                        </td>
                        <td className="p-2.5">Round {r.currentRound}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => handleCloseRoom(r.roomCode)}
                            className="sketch bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-bold hover:brightness-110 cursor-pointer"
                          >
                            Disband Room
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="sketch bg-card/90 p-5 border-2 border-foreground space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3">
              <h3 className="font-display text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Student Detective Directory
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadUsers()}
                    placeholder="Search name, email, @..."
                    className="sketch bg-white pl-8 pr-3 py-1 text-xs font-bold w-48 focus:outline-none"
                  />
                </div>

                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="registered">Registered Google Users</option>
                  <option value="guests">Guest Accounts</option>
                </select>

                <button
                  onClick={loadUsers}
                  className="sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground">
                  <tr>
                    <th className="p-2.5">Detective</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Handle</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Wins / Played</th>
                    <th className="p-2.5">Win Rate</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10 bg-white/70">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-2.5 font-bold flex items-center gap-2">
                        <span>{u.displayName}</span>
                        {u.isGuest && (
                          <span className="bg-muted px-1.5 py-0.2 rounded text-[10px] font-bold text-muted-foreground">
                            Guest
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-muted-foreground">{u.email}</td>
                      <td className="p-2.5 font-mono text-primary font-bold">
                        {u.username ? `@${u.username}` : "—"}
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        {u.city}, {u.state}
                      </td>
                      <td className="p-2.5 font-bold">
                        {u.wins} / {u.matchesPlayed}
                      </td>
                      <td className="p-2.5 font-bold">{u.winRate}%</td>
                      <td className="p-2.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditDisplayName(u.displayName);
                            setEditUsername(u.username || "");
                            setEditWins(u.wins);
                          }}
                          className="sketch bg-secondary px-2 py-0.5 text-[11px] font-bold hover:bg-secondary/80 cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3 inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="sketch bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-bold hover:brightness-110 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WORD BANK MANAGER */}
        {activeTab === "words" && (
          <div className="sketch bg-card/90 p-5 border-2 border-foreground space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Classroom Word Bank ({stats?.totalWords || 4803}+)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Browse, search, or add secret word pairs to the classroom rotation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={wordSearch}
                  onChange={(e) => setWordSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadWords()}
                  placeholder="Search words..."
                  className="sketch bg-white px-3 py-1 text-xs font-bold w-40 focus:outline-none"
                />

                <select
                  value={wordCategoryFilter}
                  onChange={(e) => setWordCategoryFilter(e.target.value)}
                  className="sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none max-w-36 truncate"
                >
                  <option value="All">All Categories</option>
                  {wordCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddWordModal(true)}
                  className="sketch bg-primary text-primary-foreground px-3 py-1 text-xs font-bold hover:brightness-110 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Word Pair
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Common Word (Detectives)</th>
                    <th className="p-2.5">Imposter Word</th>
                    <th className="p-2.5">Difficulty</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10 bg-white/70">
                  {words.map((w) => (
                    <tr key={w.id}>
                      <td className="p-2.5 font-bold text-primary">{w.category}</td>
                      <td className="p-2.5 font-bold text-base">{w.commonWord}</td>
                      <td className="p-2.5 font-bold text-base text-accent">{w.imposterWord}</td>
                      <td className="p-2.5 uppercase font-bold text-[10px]">{w.difficulty}</td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleDeleteWord(w.id, `${w.commonWord} / ${w.imposterWord}`)}
                          className="sketch bg-accent/20 text-accent hover:bg-accent hover:text-white px-2 py-0.5 text-xs font-bold rounded cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORTERS & WALL MODERATION */}
        {activeTab === "supporters" && (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {supporterCounts.total}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">
                  Total Submissions
                </div>
              </div>

              <div className="sketch bg-card/90 p-4 text-center border-2 border-amber-500/50 space-y-1 bg-amber-50/50">
                <div className="text-2xl sm:text-3xl font-display font-bold text-amber-600 flex items-center justify-center gap-1.5">
                  <Clock className="h-5 w-5" />
                  {supporterCounts.pending}
                </div>
                <div className="text-[11px] font-bold text-amber-800 uppercase">
                  Pending Verification
                </div>
              </div>

              <div className="sketch bg-card/90 p-4 text-center border-2 border-green-500/50 space-y-1 bg-green-50/50">
                <div className="text-2xl sm:text-3xl font-display font-bold text-green-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5" />
                  {supporterCounts.approved}
                </div>
                <div className="text-[11px] font-bold text-green-800 uppercase">
                  Live on Public Wall
                </div>
              </div>

              <div className="sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">
                  ₹{supporterCounts.totalApprovedAmount.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase">
                  Total Verified Chai
                </div>
              </div>
            </div>

            {/* Supporter Management Card */}
            <div className="sketch bg-card/90 p-4 sm:p-6 border-2 border-foreground space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3">
                <div>
                  <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                    <Heart className="h-6 w-6 text-accent fill-accent" /> Supporter Wall Moderation
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    User submissions stay pending until verified. Add custom supporters or approve submissions to make them visible on the wall.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewSupporterName("");
                      setNewSupporterAmount(501);
                      setNewSupporterMessage("");
                      setNewSupporterShowAmount(true);
                      setNewSupporterVerified(true);
                      setNewSupporterNotes("");
                      setShowAddSupporterModal(true);
                    }}
                    className="sketch bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  >
                    <Plus className="h-4 w-4" /> Add Supporter
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: `All (${supporterCounts.total})` },
                    { id: "pending", label: `⏳ Pending (${supporterCounts.pending})` },
                    { id: "approved", label: `✅ Live on Wall (${supporterCounts.approved})` },
                    { id: "rejected", label: `❌ Rejected (${supporterCounts.rejected})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSupporterFilter(f.id as any)}
                      className={`sketch px-3 py-1 font-bold cursor-pointer transition ${
                        supporterFilter === f.id
                          ? "bg-foreground text-background"
                          : "bg-white/80 text-foreground hover:bg-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={supporterSearch}
                      onChange={(e) => setSupporterSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && loadSupporters()}
                      placeholder="Search name or message..."
                      className="sketch w-full bg-white pl-8 pr-3 py-1 font-bold text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={loadSupporters}
                    className="sketch bg-secondary p-1.5 hover:bg-secondary/80 cursor-pointer"
                    title="Refresh List"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingSupporters ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Supporters Cards / Grid */}
              {loadingSupporters ? (
                <div className="p-8 text-center text-xs font-bold text-muted-foreground animate-pulse">
                  Loading supporters from classroom ledger...
                </div>
              ) : supporters.length === 0 ? (
                <div className="border-2 border-dashed border-foreground/30 bg-white/60 p-8 text-center rounded space-y-2">
                  <div className="font-display text-2xl font-bold text-muted-foreground/60">
                    No Supporters Found
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {supporterFilter === "pending"
                      ? "Great job! All supporter submissions have been reviewed."
                      : "No supporters found matching the current search or filter."}
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {supporters.map((s) => {
                    const isPending = !s.isVerified || s.status === "pending";
                    const isApproved = s.isVerified && s.status === "approved";

                    return (
                      <div
                        key={s.id}
                        className={`sketch bg-card/95 p-4 border-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between transition-all ${
                          isPending
                            ? "border-amber-500 bg-amber-50/30"
                            : isApproved
                            ? "border-foreground/60"
                            : "border-red-400/60 opacity-70"
                        }`}
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 shrink-0 border-2 border-foreground bg-highlight flex items-center justify-center font-display text-base font-bold rounded">
                                {(s.name || "?").trim().charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-display text-base font-bold truncate text-foreground">
                                  {s.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {new Date(s.paidAt || s.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <CheckCircle2 className="h-3 w-3" /> Live on Wall
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                                  <Clock className="h-3 w-3" /> Pending Review
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <X className="h-3 w-3" /> Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Message Body */}
                          {s.message ? (
                            <div className="mt-3 pl-2.5 border-l-2 border-primary text-xs italic text-foreground/80 break-words bg-white/50 p-1.5 rounded">
                              "{s.message}"
                            </div>
                          ) : (
                            <div className="mt-2 text-[11px] text-muted-foreground italic">
                              (No message provided)
                            </div>
                          )}

                          {/* Admin Notes */}
                          {s.notes && (
                            <div className="mt-2 text-[11px] text-amber-900 bg-amber-100/60 border border-amber-200 px-2 py-1 rounded">
                              <span className="font-bold">Admin Note:</span> {s.notes}
                            </div>
                          )}
                        </div>

                        {/* Amount & Actions */}
                        <div className="mt-4 pt-3 border-t border-foreground/15 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="bg-highlight px-2 py-0.5 rounded border border-foreground/20 text-foreground font-display text-sm">
                              ₹{Number(s.amount).toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                              {s.showAmount ? (
                                <>
                                  <Eye className="h-3 w-3 text-green-600" /> Amount Public
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 text-muted-foreground" /> Amount Hidden
                                </>
                              )}
                            </span>
                          </div>

                          {/* Moderation Controls */}
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            {isPending ? (
                              <div className="flex items-center gap-1.5 flex-1">
                                <button
                                  onClick={() => handleVerifySupporter(s.id, true, "approved")}
                                  className="sketch flex-1 bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                                >
                                  <Check className="h-3.5 w-3.5" /> Approve & Add to Wall
                                </button>
                                <button
                                  onClick={() => handleVerifySupporter(s.id, false, "rejected")}
                                  className="sketch bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                                  title="Reject"
                                >
                                  <X className="h-3.5 w-3.5" /> Reject
                                </button>
                              </div>
                            ) : isApproved ? (
                              <button
                                onClick={() => handleVerifySupporter(s.id, false, "pending")}
                                className="sketch bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                              >
                                <EyeOff className="h-3.5 w-3.5" /> Hide from Wall
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifySupporter(s.id, true, "approved")}
                                className="sketch bg-green-100 hover:bg-green-200 text-green-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                              >
                                <Check className="h-3.5 w-3.5" /> Restore & Approve
                              </button>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingSupporter(s);
                                  setEditSupporterName(s.name);
                                  setEditSupporterAmount(s.amount);
                                  setEditSupporterMessage(s.message || "");
                                  setEditSupporterShowAmount(s.showAmount);
                                  setEditSupporterVerified(s.isVerified);
                                  setEditSupporterStatus(s.status);
                                  setEditSupporterNotes(s.notes || "");
                                }}
                                className="sketch bg-secondary hover:bg-secondary/80 p-1.5 rounded cursor-pointer"
                                title="Edit Supporter"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-foreground" />
                              </button>
                              <button
                                onClick={() => handleDeleteSupporter(s.id, s.name)}
                                className="sketch bg-red-100 hover:bg-red-200 p-1.5 rounded cursor-pointer text-red-700"
                                title="Delete Supporter"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CLASSROOM MEGAPHONE BROADCAST */}
        {activeTab === "broadcast" && (
          <div className="sketch bg-card/90 p-5 sm:p-7 border-2 border-foreground space-y-5">
            <div className="border-b border-foreground/20 pb-3">
              <h3 className="font-display text-2xl font-bold flex items-center gap-2 text-foreground">
                <Send className="h-6 w-6 text-accent" /> Live Classroom Megaphone Announcement
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send an immediate real-time announcement banner to all connected players and game rooms.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  Announcement Message (Max 250 characters)
                </label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value.slice(0, 250))}
                  placeholder="e.g. Attention students: Imposter World Tournament bracket starts in 5 minutes! Assemble in your rooms."
                  className="sketch w-full bg-white p-3 text-sm font-hand rounded border-2 border-foreground/40 focus:outline-none focus:border-primary"
                />
                <div className="text-[11px] text-muted-foreground text-right">{broadcastMessage.length}/250</div>
              </div>

              <div className="p-3 bg-highlight/30 rounded border border-foreground/20 text-xs text-foreground/80 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-primary">
                  <AlertTriangle className="h-3.5 w-3.5" /> Broadcast Notice
                </div>
                <p>
                  This announcement will appear across all active player screens in real-time as an official Principal Bulletin with sound alert.
                </p>
              </div>

              <button
                type="submit"
                disabled={broadcasting}
                className="sketch bg-accent text-accent-foreground px-6 py-2.5 rounded font-display uppercase tracking-wider text-sm font-bold hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> {broadcasting ? "Broadcasting..." : "Broadcast to All Rooms 📢"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD WORD PAIR */}
      {showAddWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand">
          <div className="notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
              <h3 className="font-display text-2xl font-bold">Add Secret Word Pair</h3>
              <button onClick={() => setShowAddWordModal(false)} className="cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Category:</label>
                <input
                  type="text"
                  value={newWordCategory}
                  onChange={(e) => setNewWordCategory(e.target.value)}
                  placeholder="e.g. Movies, Food, School"
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Common Word (Detectives):</label>
                <input
                  type="text"
                  value={newWordCommon}
                  onChange={(e) => setNewWordCommon(e.target.value)}
                  placeholder="e.g. Coffee"
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Imposter Word (Lookalike Clue):</label>
                <input
                  type="text"
                  value={newWordImposter}
                  onChange={(e) => setNewWordImposter(e.target.value)}
                  placeholder="e.g. Tea"
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-accent"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Difficulty:</label>
                <select
                  value={newWordDifficulty}
                  onChange={(e) => setNewWordDifficulty(e.target.value as any)}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWordModal(false)}
                  className="sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer"
                >
                  Save to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand">
          <div className="notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
              <h3 className="font-display text-2xl font-bold">Edit Student Profile</h3>
              <button onClick={() => setEditingUser(null)} className="cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Display Name:</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">@username Handle (optional):</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="e.g. aditya.sharma"
                  className="sketch w-full bg-white px-3 py-1.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Recorded Wins:</label>
                <input
                  type="number"
                  min={0}
                  value={editWins}
                  onChange={(e) => setEditWins(parseInt(e.target.value, 10) || 0)}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPORTER */}
      {showAddSupporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand">
          <div className="notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
              <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent fill-accent" /> Add Supporter to Wall
              </h3>
              <button onClick={() => setShowAddSupporterModal(false)} className="cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupporter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Supporter Name:</label>
                <input
                  type="text"
                  value={newSupporterName}
                  onChange={(e) => setNewSupporterName(e.target.value)}
                  placeholder="e.g. Guest_5981 or Aditya Sharma"
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Contribution Amount (₹):</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={newSupporterAmount}
                  onChange={(e) => setNewSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="501"
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Message for Developer (Optional):</label>
                <textarea
                  rows={3}
                  value={newSupporterMessage}
                  onChange={(e) => setNewSupporterMessage(e.target.value.slice(0, 500))}
                  placeholder="Say something nice, suggest a game mode, or send chai love..."
                  className="sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
                />
                <div className="text-[10px] text-muted-foreground text-right">{newSupporterMessage.length}/500</div>
              </div>

              <div className="space-y-2 pt-1 border-t border-foreground/10">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSupporterShowAmount}
                    onChange={(e) => setNewSupporterShowAmount(e.target.checked)}
                    className="rounded border-foreground text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Display amount (₹{newSupporterAmount}) publicly on wall</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer text-green-700">
                  <input
                    type="checkbox"
                    checked={newSupporterVerified}
                    onChange={(e) => setNewSupporterVerified(e.target.checked)}
                    className="rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
                  />
                  <span>Mark as Verified Supporter (Publish to wall immediately)</span>
                </label>
              </div>

              <div>
                <label className="block font-bold mb-1 text-muted-foreground">Admin Notes (Private):</label>
                <input
                  type="text"
                  value={newSupporterNotes}
                  onChange={(e) => setNewSupporterNotes(e.target.value.slice(0, 200))}
                  placeholder="e.g. Paid via UPI reference #12345"
                  className="sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupporterModal(false)}
                  className="sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Save Supporter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUPPORTER */}
      {editingSupporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand">
          <div className="notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-2">
              <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" /> Edit Supporter
              </h3>
              <button onClick={() => setEditingSupporter(null)} className="cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSupporter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Supporter Name:</label>
                <input
                  type="text"
                  value={editSupporterName}
                  onChange={(e) => setEditSupporterName(e.target.value)}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Contribution Amount (₹):</label>
                <input
                  type="number"
                  min={0}
                  value={editSupporterAmount}
                  onChange={(e) => setEditSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Message:</label>
                <textarea
                  rows={3}
                  value={editSupporterMessage}
                  onChange={(e) => setEditSupporterMessage(e.target.value.slice(0, 500))}
                  className="sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Status on Wall:</label>
                <select
                  value={editSupporterStatus}
                  onChange={(e) => {
                    const st = e.target.value as any;
                    setEditSupporterStatus(st);
                    setEditSupporterVerified(st === "approved");
                  }}
                  className="sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
                >
                  <option value="approved">✅ Approved & Live on Public Wall</option>
                  <option value="pending">⏳ Pending Review (Hidden from Wall)</option>
                  <option value="rejected">❌ Rejected (Hidden from Wall)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1 border-t border-foreground/10">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editSupporterShowAmount}
                    onChange={(e) => setEditSupporterShowAmount(e.target.checked)}
                    className="rounded border-foreground text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Display amount (₹{editSupporterAmount}) publicly on wall</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer text-green-700">
                  <input
                    type="checkbox"
                    checked={editSupporterVerified}
                    onChange={(e) => {
                      setEditSupporterVerified(e.target.checked);
                      if (e.target.checked) setEditSupporterStatus("approved");
                    }}
                    className="rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
                  />
                  <span>Verified Supporter</span>
                </label>
              </div>

              <div>
                <label className="block font-bold mb-1 text-muted-foreground">Admin Notes (Private):</label>
                <input
                  type="text"
                  value={editSupporterNotes}
                  onChange={(e) => setEditSupporterNotes(e.target.value.slice(0, 200))}
                  className="sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSupporter(null)}
                  className="sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
