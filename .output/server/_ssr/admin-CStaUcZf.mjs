import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-CvQPumbW.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { $ as ArrowLeft, B as Eye, C as Plus, E as PenLine, I as Heart, K as Clock, N as LogOut, V as EyeOff, Y as Check, Z as BookOpen, _ as Send, b as RefreshCw, c as TriangleAlert, et as Activity, g as Server, i as Users, l as Trash2, q as CircleCheck, t as X, u as Terminal, v as Search, x as Radio } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CStaUcZf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [authorized, setAuthorized] = (0, import_react.useState)(false);
	const [currentUserEmail, setCurrentUserEmail] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [stats, setStats] = (0, import_react.useState)(null);
	const [rooms, setRooms] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [words, setWords] = (0, import_react.useState)([]);
	const [wordCategories, setWordCategories] = (0, import_react.useState)([]);
	const [supporters, setSupporters] = (0, import_react.useState)([]);
	const [supporterCounts, setSupporterCounts] = (0, import_react.useState)({
		total: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		totalApprovedAmount: 0
	});
	const [supporterFilter, setSupporterFilter] = (0, import_react.useState)("all");
	const [supporterSearch, setSupporterSearch] = (0, import_react.useState)("");
	const [loadingSupporters, setLoadingSupporters] = (0, import_react.useState)(false);
	const [showAddSupporterModal, setShowAddSupporterModal] = (0, import_react.useState)(false);
	const [newSupporterName, setNewSupporterName] = (0, import_react.useState)("");
	const [newSupporterAmount, setNewSupporterAmount] = (0, import_react.useState)(501);
	const [newSupporterMessage, setNewSupporterMessage] = (0, import_react.useState)("");
	const [newSupporterShowAmount, setNewSupporterShowAmount] = (0, import_react.useState)(true);
	const [newSupporterVerified, setNewSupporterVerified] = (0, import_react.useState)(true);
	const [newSupporterNotes, setNewSupporterNotes] = (0, import_react.useState)("");
	const [editingSupporter, setEditingSupporter] = (0, import_react.useState)(null);
	const [editSupporterName, setEditSupporterName] = (0, import_react.useState)("");
	const [editSupporterAmount, setEditSupporterAmount] = (0, import_react.useState)(501);
	const [editSupporterMessage, setEditSupporterMessage] = (0, import_react.useState)("");
	const [editSupporterShowAmount, setEditSupporterShowAmount] = (0, import_react.useState)(true);
	const [editSupporterVerified, setEditSupporterVerified] = (0, import_react.useState)(true);
	const [editSupporterStatus, setEditSupporterStatus] = (0, import_react.useState)("approved");
	const [editSupporterNotes, setEditSupporterNotes] = (0, import_react.useState)("");
	const [userSearch, setUserSearch] = (0, import_react.useState)("");
	const [userFilter, setUserFilter] = (0, import_react.useState)("all");
	const [wordSearch, setWordSearch] = (0, import_react.useState)("");
	const [wordCategoryFilter, setWordCategoryFilter] = (0, import_react.useState)("All");
	const [broadcastMessage, setBroadcastMessage] = (0, import_react.useState)("");
	const [broadcasting, setBroadcasting] = (0, import_react.useState)(false);
	const [showAddWordModal, setShowAddWordModal] = (0, import_react.useState)(false);
	const [newWordCategory, setNewWordCategory] = (0, import_react.useState)("");
	const [newWordCommon, setNewWordCommon] = (0, import_react.useState)("");
	const [newWordImposter, setNewWordImposter] = (0, import_react.useState)("");
	const [newWordDifficulty, setNewWordDifficulty] = (0, import_react.useState)("easy");
	const [editingUser, setEditingUser] = (0, import_react.useState)(null);
	const [editDisplayName, setEditDisplayName] = (0, import_react.useState)("");
	const [editUsername, setEditUsername] = (0, import_react.useState)("");
	const [editWins, setEditWins] = (0, import_react.useState)(0);
	const verifyAdmin = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/api/admin/verify`, { credentials: "include" });
			if (res.ok) {
				const data = await res.json();
				if (data.isAdmin) {
					setAuthorized(true);
					setCurrentUserEmail(data.displayName || "Principal");
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
	(0, import_react.useEffect)(() => {
		verifyAdmin();
	}, []);
	const loadDashboardData = async () => {
		try {
			const [statsRes, roomsRes, supportersRes] = await Promise.all([
				fetch(`${API_BASE}/api/admin/stats`, { credentials: "include" }),
				fetch(`${API_BASE}/api/admin/rooms`, { credentials: "include" }),
				fetch(`${API_BASE}/api/admin/supporters?limit=1`, { credentials: "include" })
			]);
			const statsData = await statsRes.json();
			const roomsData = await roomsRes.json();
			const supportersData = await supportersRes.json();
			if (statsData.success) setStats(statsData.stats);
			if (roomsData.success) setRooms(roomsData.rooms);
			if (supportersData.success && supportersData.counts) setSupporterCounts(supportersData.counts);
		} catch (err) {
			console.error("Dashboard data load error:", err);
		}
	};
	const loadUsers = async () => {
		try {
			const params = new URLSearchParams({
				search: userSearch,
				filter: userFilter,
				limit: "50"
			});
			const data = await (await fetch(`${API_BASE}/api/admin/users?${params.toString()}`, { credentials: "include" })).json();
			if (data.success) setUsers(data.users);
		} catch {
			toast.error("Failed to load users list");
		}
	};
	(0, import_react.useEffect)(() => {
		if (authorized && activeTab === "users") loadUsers();
	}, [
		authorized,
		activeTab,
		userFilter
	]);
	const loadWords = async () => {
		try {
			const params = new URLSearchParams({
				search: wordSearch,
				category: wordCategoryFilter,
				limit: "50"
			});
			const data = await (await fetch(`${API_BASE}/api/admin/words?${params.toString()}`, { credentials: "include" })).json();
			if (data.success) {
				setWords(data.words);
				setWordCategories(data.categories || []);
			}
		} catch {
			toast.error("Failed to load word pairs");
		}
	};
	(0, import_react.useEffect)(() => {
		if (authorized && activeTab === "words") loadWords();
	}, [
		authorized,
		activeTab,
		wordCategoryFilter
	]);
	const loadSupporters = async () => {
		setLoadingSupporters(true);
		try {
			const params = new URLSearchParams({
				search: supporterSearch,
				status: supporterFilter,
				limit: "50"
			});
			const data = await (await fetch(`${API_BASE}/api/admin/supporters?${params.toString()}`, { credentials: "include" })).json();
			if (data.success) {
				setSupporters(data.supporters);
				if (data.counts) setSupporterCounts(data.counts);
			}
		} catch {
			toast.error("Failed to load supporters list");
		} finally {
			setLoadingSupporters(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (authorized && activeTab === "supporters") loadSupporters();
	}, [
		authorized,
		activeTab,
		supporterFilter
	]);
	const handleVerifySupporter = async (id, isVerified, status) => {
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/supporters/${id}/verify`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					isVerified,
					status
				})
			})).json();
			if (data.success) {
				toast.success(data.message);
				loadSupporters();
				loadDashboardData();
			} else toast.error(data.error || "Failed to update verification status");
		} catch {
			toast.error("Network error updating supporter status");
		}
	};
	const handleAddSupporter = async (e) => {
		e.preventDefault();
		if (!newSupporterName.trim()) {
			toast.error("Supporter name is required.");
			return;
		}
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/supporters`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					name: newSupporterName.trim(),
					amount: newSupporterAmount,
					message: newSupporterMessage.trim(),
					showAmount: newSupporterShowAmount,
					isVerified: newSupporterVerified,
					notes: newSupporterNotes.trim()
				})
			})).json();
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
			} else toast.error(data.error || "Failed to add supporter");
		} catch {
			toast.error("Error creating supporter");
		}
	};
	const handleSaveEditSupporter = async (e) => {
		e.preventDefault();
		if (!editingSupporter) return;
		if (!editSupporterName.trim()) {
			toast.error("Supporter name is required.");
			return;
		}
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/supporters/${editingSupporter.id}`, {
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
					notes: editSupporterNotes.trim()
				})
			})).json();
			if (data.success) {
				toast.success("Supporter updated successfully!");
				setEditingSupporter(null);
				loadSupporters();
				loadDashboardData();
			} else toast.error(data.error || "Failed to update supporter");
		} catch {
			toast.error("Error updating supporter");
		}
	};
	const handleDeleteSupporter = async (id, name) => {
		if (!confirm(`Permanently remove supporter "${name}"?`)) return;
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/supporters/${id}`, {
				method: "DELETE",
				credentials: "include"
			})).json();
			if (data.success) {
				toast.success("Supporter deleted.");
				loadSupporters();
				loadDashboardData();
			} else toast.error(data.error || "Failed to delete supporter");
		} catch {
			toast.error("Error deleting supporter");
		}
	};
	const handleCloseRoom = async (roomCode) => {
		if (!confirm(`Are you sure you want to disband Room #${roomCode}? Connected players will be disconnected.`)) return;
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/rooms/close`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ roomCode })
			})).json();
			if (data.success) {
				toast.success(data.message);
				loadDashboardData();
			} else toast.error(data.error || "Failed to close room");
		} catch {
			toast.error("Network error closing room");
		}
	};
	const handleSendBroadcast = async (e) => {
		e.preventDefault();
		if (!broadcastMessage.trim()) {
			toast.error("Please enter a message to broadcast.");
			return;
		}
		setBroadcasting(true);
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/broadcast`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ message: broadcastMessage.trim() })
			})).json();
			if (data.success) {
				toast.success("Broadcast dispatched to all live game rooms! 📢");
				setBroadcastMessage("");
			} else toast.error(data.error || "Failed to broadcast");
		} catch {
			toast.error("Network error sending broadcast");
		} finally {
			setBroadcasting(false);
		}
	};
	const handleCreateWord = async (e) => {
		e.preventDefault();
		if (!newWordCategory.trim() || !newWordCommon.trim() || !newWordImposter.trim()) {
			toast.error("Please fill all required word fields.");
			return;
		}
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/words`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					category: newWordCategory.trim(),
					commonWord: newWordCommon.trim(),
					imposterWord: newWordImposter.trim(),
					difficulty: newWordDifficulty,
					language: "en"
				})
			})).json();
			if (data.success) {
				toast.success("New word pair added to classroom database!");
				setShowAddWordModal(false);
				setNewWordCommon("");
				setNewWordImposter("");
				loadWords();
			} else toast.error(data.error || "Failed to add word");
		} catch {
			toast.error("Error creating word");
		}
	};
	const handleDeleteWord = async (id, name) => {
		if (!confirm(`Delete word pair "${name}"?`)) return;
		try {
			if ((await (await fetch(`${API_BASE}/api/admin/words/${id}`, {
				method: "DELETE",
				credentials: "include"
			})).json()).success) {
				toast.success("Word pair removed.");
				loadWords();
			}
		} catch {
			toast.error("Error deleting word");
		}
	};
	const handleSaveUser = async (e) => {
		e.preventDefault();
		if (!editingUser) return;
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/users/update`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					userId: editingUser.id,
					displayName: editDisplayName.trim(),
					username: editUsername.trim() || void 0,
					wins: editWins
				})
			})).json();
			if (data.success) {
				toast.success("User profile updated!");
				setEditingUser(null);
				loadUsers();
			} else toast.error(data.error || "Failed to update user");
		} catch {
			toast.error("Error saving user");
		}
	};
	const handleDeleteUser = async (user) => {
		if (!confirm(`Permanently delete account for "${user.displayName}" (${user.email})?`)) return;
		try {
			const data = await (await fetch(`${API_BASE}/api/admin/users/${user.id}`, {
				method: "DELETE",
				credentials: "include"
			})).json();
			if (data.success) {
				toast.success("User deleted.");
				loadUsers();
			} else toast.error(data.error || "Cannot delete user");
		} catch {
			toast.error("Error deleting user");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sketch bg-card p-8 text-center space-y-3 border-2 border-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-8 w-8 animate-spin mx-auto text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl font-bold",
					children: "Checking Classroom Records..."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground font-hand",
					children: "Opening notebook ledger"
				})
			]
		})
	});
	if (!authorized) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen px-4 py-16 flex items-center justify-center font-hand",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notebook relative max-w-md w-full p-8 shadow-2xl border-4 border-foreground text-center space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl font-display font-extrabold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
						children: "Notebook Page Not Found 📝"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground/80 leading-relaxed",
						children: "Looks like this page was torn out or never existed in the classroom ledger. The imposter might have erased the clues!"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "sketch inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-display text-base font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 no-underline cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Return to Classroom"]
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen px-3 py-4 sm:py-8 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl space-y-6 font-hand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sketch bg-card/95 p-4 sm:p-5 border-2 border-foreground flex flex-wrap items-center justify-between gap-3 shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold",
								children: "🎓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
									children: "Principal Office"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase",
									children: "Super Admin"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground flex items-center gap-1 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUserEmail }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-green-600 font-bold",
									children: "● Active"
								})]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "sketch bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to Game"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).then(() => {
										window.location.href = "/";
									});
								},
								className: "sketch bg-accent text-accent-foreground px-3 py-1.5 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign Out"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-wrap gap-2 border-b-2 border-foreground/20 pb-2",
						children: [
							{
								id: "overview",
								label: "Dashboard & Stats",
								icon: Activity
							},
							{
								id: "rooms",
								label: `Live Rooms (${rooms.length})`,
								icon: Radio
							},
							{
								id: "users",
								label: "Students & Users",
								icon: Users
							},
							{
								id: "words",
								label: "Word Bank",
								icon: BookOpen
							},
							{
								id: "supporters",
								label: supporterCounts.pending > 0 ? `Supporter Wall (${supporterCounts.pending} Pending ⏳)` : `Supporter Wall (${supporterCounts.total})`,
								icon: Heart
							},
							{
								id: "broadcast",
								label: "Class Megaphone",
								icon: Send
							}
						].map((tab) => {
							const Icon = tab.icon;
							const active = activeTab === tab.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab(tab.id),
								className: `sketch px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]" : "bg-white/80 text-foreground hover:bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
							}, tab.id);
						})
					}),
					activeTab === "overview" && stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-primary",
										children: stats.totalUsers
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Users"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-green-700",
										children: stats.registeredUsers
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Google Signups"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-amber-700",
										children: stats.activeRoomsCount
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Live Rooms"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-accent",
										children: stats.livePlayersCount
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Live CCU"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-indigo-700",
										children: stats.totalWords
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Word Pairs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-purple-700",
										children: stats.totalMatches
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Matches Played"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-foreground/20 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-xl font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-5 w-5 text-primary" }), " Backend Engine & Memory Health"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-mono font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded",
									children: [
										"Node ",
										stats.nodeVersion,
										" · Online"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground font-bold",
											children: "Process Uptime"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-display font-bold text-foreground",
											children: [
												Math.floor(stats.serverUptimeSec / 3600),
												"h ",
												Math.floor(stats.serverUptimeSec % 3600 / 60),
												"m"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground font-bold",
											children: "Memory RSS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-display font-bold text-primary",
											children: [stats.memoryRssMb, " MB"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground font-bold",
											children: "Heap Used"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-display font-bold text-accent",
											children: [stats.memoryHeapUsedMb, " MB"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground font-bold",
											children: "Total Support Logged"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-display font-bold text-green-700",
											children: ["₹", stats.totalSupportAmount.toLocaleString("en-IN")]
										})]
									})
								]
							})]
						})]
					}),
					activeTab === "rooms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5 text-accent animate-pulse" }), " Real-Time Multiplayer Rooms"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Active rooms in server RAM. Disband any suspicious room instantly."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: loadDashboardData,
								className: "sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
							})]
						}), rooms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-muted-foreground text-sm",
							children: "No active multiplayer game rooms right now."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Room Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Host"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Players"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Mode"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Phase"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-right",
											children: "Admin Action"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 font-mono font-bold text-primary",
											children: ["#", r.roomCode]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-bold",
											children: r.hostName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5",
											children: [
												r.playersCount,
												"/",
												r.maxPlayers
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 uppercase font-bold text-[10px]",
											children: r.gameMode
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-highlight/60 px-2 py-0.5 rounded font-bold uppercase text-[10px]",
												children: r.phase
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5",
											children: ["Round ", r.currentRound]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleCloseRoom(r.roomCode),
												className: "sketch bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-bold hover:brightness-110 cursor-pointer",
												children: "Disband Room"
											})
										})
									] }, r.roomCode))
								})]
							})
						})]
					}),
					activeTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), " Student Detective Directory"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: userSearch,
											onChange: (e) => setUserSearch(e.target.value),
											onKeyDown: (e) => e.key === "Enter" && loadUsers(),
											placeholder: "Search name, email, @...",
											className: "sketch bg-white pl-8 pr-3 py-1 text-xs font-bold w-48 focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: userFilter,
										onChange: (e) => setUserFilter(e.target.value),
										className: "sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												children: "All Users"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "registered",
												children: "Registered Google Users"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "guests",
												children: "Guest Accounts"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: loadUsers,
										className: "sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Search"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Detective"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Handle"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Wins / Played"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Win Rate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 font-bold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.displayName }), u.isGuest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-muted px-1.5 py-0.2 rounded text-[10px] font-bold text-muted-foreground",
												children: "Guest"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-mono text-[11px] text-muted-foreground",
											children: u.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-mono text-primary font-bold",
											children: u.username ? `@${u.username}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 text-muted-foreground",
											children: [
												u.city,
												", ",
												u.state
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 font-bold",
											children: [
												u.wins,
												" / ",
												u.matchesPlayed
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 font-bold",
											children: [u.winRate, "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 text-right space-x-1 whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setEditingUser(u);
													setEditDisplayName(u.displayName);
													setEditUsername(u.username || "");
													setEditWins(u.wins);
												},
												className: "sketch bg-secondary px-2 py-0.5 text-[11px] font-bold hover:bg-secondary/80 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3 w-3 inline mr-1" }), " Edit"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleDeleteUser(u),
												className: "sketch bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-bold hover:brightness-110 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3 inline" })
											})]
										})
									] }, u.id))
								})]
							})
						})]
					}),
					activeTab === "words" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5 text-primary" }),
									" Classroom Word Bank (",
									stats?.totalWords || 4803,
									"+)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Browse, search, or add secret word pairs to the classroom rotation."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: wordSearch,
										onChange: (e) => setWordSearch(e.target.value),
										onKeyDown: (e) => e.key === "Enter" && loadWords(),
										placeholder: "Search words...",
										className: "sketch bg-white px-3 py-1 text-xs font-bold w-40 focus:outline-none"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: wordCategoryFilter,
										onChange: (e) => setWordCategoryFilter(e.target.value),
										className: "sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none max-w-36 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "All",
											children: "All Categories"
										}), wordCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											children: c
										}, c))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setShowAddWordModal(true),
										className: "sketch bg-primary text-primary-foreground px-3 py-1 text-xs font-bold hover:brightness-110 flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add Word Pair"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Category"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Common Word (Detectives)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Imposter Word"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Difficulty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-bold text-primary",
											children: w.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-bold text-base",
											children: w.commonWord
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 font-bold text-base text-accent",
											children: w.imposterWord
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 uppercase font-bold text-[10px]",
											children: w.difficulty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleDeleteWord(w.id, `${w.commonWord} / ${w.imposterWord}`),
												className: "sketch bg-accent/20 text-accent hover:bg-accent hover:text-white px-2 py-0.5 text-xs font-bold rounded cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3 inline" })
											})
										})
									] }, w.id))
								})]
							})
						})]
					}),
					activeTab === "supporters" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
										children: supporterCounts.total
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Submissions"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-4 text-center border-2 border-amber-500/50 space-y-1 bg-amber-50/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-amber-600 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" }), supporterCounts.pending]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-amber-800 uppercase",
										children: "Pending Verification"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-4 text-center border-2 border-green-500/50 space-y-1 bg-green-50/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-green-700 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), supporterCounts.approved]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-green-800 uppercase",
										children: "Live on Public Wall"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-primary",
										children: ["₹", supporterCounts.totalApprovedAmount.toLocaleString("en-IN")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Verified Chai"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sketch bg-card/90 p-4 sm:p-6 border-2 border-foreground space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display text-2xl font-bold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-6 w-6 text-accent fill-accent" }), " Supporter Wall Moderation"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "User submissions stay pending until verified. Add custom supporters or approve submissions to make them visible on the wall."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setNewSupporterName("");
												setNewSupporterAmount(501);
												setNewSupporterMessage("");
												setNewSupporterShowAmount(true);
												setNewSupporterVerified(true);
												setNewSupporterNotes("");
												setShowAddSupporterModal(true);
											},
											className: "sketch bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Supporter"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [
											{
												id: "all",
												label: `All (${supporterCounts.total})`
											},
											{
												id: "pending",
												label: `⏳ Pending (${supporterCounts.pending})`
											},
											{
												id: "approved",
												label: `✅ Live on Wall (${supporterCounts.approved})`
											},
											{
												id: "rejected",
												label: `❌ Rejected (${supporterCounts.rejected})`
											}
										].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSupporterFilter(f.id),
											className: `sketch px-3 py-1 font-bold cursor-pointer transition ${supporterFilter === f.id ? "bg-foreground text-background" : "bg-white/80 text-foreground hover:bg-white"}`,
											children: f.label
										}, f.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 w-full sm:w-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative flex-1 sm:w-64",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: supporterSearch,
												onChange: (e) => setSupporterSearch(e.target.value),
												onKeyDown: (e) => e.key === "Enter" && loadSupporters(),
												placeholder: "Search name or message...",
												className: "sketch w-full bg-white pl-8 pr-3 py-1 font-bold text-xs focus:outline-none"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: loadSupporters,
											className: "sketch bg-secondary p-1.5 hover:bg-secondary/80 cursor-pointer",
											title: "Refresh List",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loadingSupporters ? "animate-spin" : ""}` })
										})]
									})]
								}),
								loadingSupporters ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-8 text-center text-xs font-bold text-muted-foreground animate-pulse",
									children: "Loading supporters from classroom ledger..."
								}) : supporters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-2 border-dashed border-foreground/30 bg-white/60 p-8 text-center rounded space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-2xl font-bold text-muted-foreground/60",
										children: "No Supporters Found"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground max-w-sm mx-auto",
										children: supporterFilter === "pending" ? "Great job! All supporter submissions have been reviewed." : "No supporters found matching the current search or filter."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2",
									children: supporters.map((s) => {
										const isPending = !s.isVerified || s.status === "pending";
										const isApproved = s.isVerified && s.status === "approved";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `sketch bg-card/95 p-4 border-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between transition-all ${isPending ? "border-amber-500 bg-amber-50/30" : isApproved ? "border-foreground/60" : "border-red-400/60 opacity-70"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-9 h-9 shrink-0 border-2 border-foreground bg-highlight flex items-center justify-center font-display text-base font-bold rounded",
															children: (s.name || "?").trim().charAt(0).toUpperCase()
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "font-display text-base font-bold truncate text-foreground",
																children: s.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground",
																children: new Date(s.paidAt || s.createdAt).toLocaleDateString("en-IN", {
																	day: "2-digit",
																	month: "short",
																	year: "numeric"
																})
															})]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Live on Wall"]
													}) : isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Pending Review"]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Rejected"]
													}) })]
												}),
												s.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 pl-2.5 border-l-2 border-primary text-xs italic text-foreground/80 break-words bg-white/50 p-1.5 rounded",
													children: [
														"\"",
														s.message,
														"\""
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 text-[11px] text-muted-foreground italic",
													children: "(No message provided)"
												}),
												s.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 text-[11px] text-amber-900 bg-amber-100/60 border border-amber-200 px-2 py-1 rounded",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold",
															children: "Admin Note:"
														}),
														" ",
														s.notes
													]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 pt-3 border-t border-foreground/15 space-y-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "bg-highlight px-2 py-0.5 rounded border border-foreground/20 text-foreground font-display text-sm",
														children: ["₹", Number(s.amount).toLocaleString("en-IN")]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-muted-foreground uppercase flex items-center gap-1",
														children: s.showAmount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 text-green-600" }), " Amount Public"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3 text-muted-foreground" }), " Amount Hidden"] })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-1.5 pt-1",
													children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => handleVerifySupporter(s.id, true, "approved"),
															className: "sketch flex-1 bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-[1px_1px_0_0_rgba(0,0,0,1)]",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Approve & Add to Wall"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => handleVerifySupporter(s.id, false, "rejected"),
															className: "sketch bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition",
															title: "Reject",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Reject"]
														})]
													}) : isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => handleVerifySupporter(s.id, false, "pending"),
														className: "sketch bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }), " Hide from Wall"]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => handleVerifySupporter(s.id, true, "approved"),
														className: "sketch bg-green-100 hover:bg-green-200 text-green-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Restore & Approve"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => {
																setEditingSupporter(s);
																setEditSupporterName(s.name);
																setEditSupporterAmount(s.amount);
																setEditSupporterMessage(s.message || "");
																setEditSupporterShowAmount(s.showAmount);
																setEditSupporterVerified(s.isVerified);
																setEditSupporterStatus(s.status);
																setEditSupporterNotes(s.notes || "");
															},
															className: "sketch bg-secondary hover:bg-secondary/80 p-1.5 rounded cursor-pointer",
															title: "Edit Supporter",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5 text-foreground" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleDeleteSupporter(s.id, s.name),
															className: "sketch bg-red-100 hover:bg-red-200 p-1.5 rounded cursor-pointer text-red-700",
															title: "Delete Supporter",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})]
													})]
												})]
											})]
										}, s.id);
									})
								})
							]
						})]
					}),
					activeTab === "broadcast" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sketch bg-card/90 p-5 sm:p-7 border-2 border-foreground space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-2xl font-bold flex items-center gap-2 text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-6 w-6 text-accent" }), " Live Classroom Megaphone Announcement"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Send an immediate real-time announcement banner to all connected players and game rooms."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSendBroadcast,
							className: "space-y-4 max-w-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider",
										children: "Announcement Message (Max 250 characters)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: broadcastMessage,
										onChange: (e) => setBroadcastMessage(e.target.value.slice(0, 250)),
										placeholder: "e.g. Attention students: Imposter World Tournament bracket starts in 5 minutes! Assemble in your rooms.",
										className: "sketch w-full bg-white p-3 text-sm font-hand rounded border-2 border-foreground/40 focus:outline-none focus:border-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground text-right",
										children: [broadcastMessage.length, "/250"]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-highlight/30 rounded border border-foreground/20 text-xs text-foreground/80 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold flex items-center gap-1.5 text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Broadcast Notice"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This announcement will appear across all active player screens in real-time as an official Principal Bulletin with sound alert." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: broadcasting,
									className: "sketch bg-accent text-accent-foreground px-6 py-2.5 rounded font-display uppercase tracking-wider text-sm font-bold hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }),
										" ",
										broadcasting ? "Broadcasting..." : "Broadcast to All Rooms 📢"
									]
								})
							]
						})]
					})
				]
			}),
			showAddWordModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold",
							children: "Add Secret Word Pair"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowAddWordModal(false),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateWord,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Category:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newWordCategory,
								onChange: (e) => setNewWordCategory(e.target.value),
								placeholder: "e.g. Movies, Food, School",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Common Word (Detectives):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newWordCommon,
								onChange: (e) => setNewWordCommon(e.target.value),
								placeholder: "e.g. Coffee",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-primary",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Imposter Word (Lookalike Clue):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newWordImposter,
								onChange: (e) => setNewWordImposter(e.target.value),
								placeholder: "e.g. Tea",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-accent",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Difficulty:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: newWordDifficulty,
								onChange: (e) => setNewWordDifficulty(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "easy",
										children: "Easy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "medium",
										children: "Medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hard",
										children: "Hard"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAddWordModal(false),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer",
									children: "Save to Bank"
								})]
							})
						]
					})]
				})
			}),
			editingUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold",
							children: "Edit Student Profile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingUser(null),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveUser,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Display Name:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editDisplayName,
								onChange: (e) => setEditDisplayName(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "@username Handle (optional):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editUsername,
								onChange: (e) => setEditUsername(e.target.value),
								placeholder: "e.g. aditya.sharma",
								className: "sketch w-full bg-white px-3 py-1.5 font-mono font-bold focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Recorded Wins:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: editWins,
								onChange: (e) => setEditWins(parseInt(e.target.value, 10) || 0),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditingUser(null),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer",
									children: "Save Profile"
								})]
							})
						]
					})]
				})
			}),
			showAddSupporterModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-2xl font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5 text-accent fill-accent" }), " Add Supporter to Wall"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowAddSupporterModal(false),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSupporter,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Supporter Name:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newSupporterName,
								onChange: (e) => setNewSupporterName(e.target.value),
								placeholder: "e.g. Guest_5981 or Aditya Sharma",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Contribution Amount (₹):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								step: 1,
								value: newSupporterAmount,
								onChange: (e) => setNewSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0)),
								placeholder: "501",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-bold mb-1",
									children: "Message for Developer (Optional):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: newSupporterMessage,
									onChange: (e) => setNewSupporterMessage(e.target.value.slice(0, 500)),
									placeholder: "Say something nice, suggest a game mode, or send chai love...",
									className: "sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground text-right",
									children: [newSupporterMessage.length, "/500"]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-1 border-t border-foreground/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: newSupporterShowAmount,
										onChange: (e) => setNewSupporterShowAmount(e.target.checked),
										className: "rounded border-foreground text-primary focus:ring-primary h-4 w-4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Display amount (₹",
										newSupporterAmount,
										") publicly on wall"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer text-green-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: newSupporterVerified,
										onChange: (e) => setNewSupporterVerified(e.target.checked),
										className: "rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mark as Verified Supporter (Publish to wall immediately)" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1 text-muted-foreground",
								children: "Admin Notes (Private):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newSupporterNotes,
								onChange: (e) => setNewSupporterNotes(e.target.value.slice(0, 200)),
								placeholder: "e.g. Paid via UPI reference #12345",
								className: "sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAddSupporterModal(false),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Save Supporter"]
								})]
							})
						]
					})]
				})
			}),
			editingSupporter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-2xl font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-5 w-5 text-primary" }), " Edit Supporter"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingSupporter(null),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveEditSupporter,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Supporter Name:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editSupporterName,
								onChange: (e) => setEditSupporterName(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Contribution Amount (₹):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: editSupporterAmount,
								onChange: (e) => setEditSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0)),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Message:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: editSupporterMessage,
								onChange: (e) => setEditSupporterMessage(e.target.value.slice(0, 500)),
								className: "sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1",
								children: "Status on Wall:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: editSupporterStatus,
								onChange: (e) => {
									const st = e.target.value;
									setEditSupporterStatus(st);
									setEditSupporterVerified(st === "approved");
								},
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "approved",
										children: "✅ Approved & Live on Public Wall"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "⏳ Pending Review (Hidden from Wall)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rejected",
										children: "❌ Rejected (Hidden from Wall)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-1 border-t border-foreground/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: editSupporterShowAmount,
										onChange: (e) => setEditSupporterShowAmount(e.target.checked),
										className: "rounded border-foreground text-primary focus:ring-primary h-4 w-4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Display amount (₹",
										editSupporterAmount,
										") publicly on wall"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer text-green-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: editSupporterVerified,
										onChange: (e) => {
											setEditSupporterVerified(e.target.checked);
											if (e.target.checked) setEditSupporterStatus("approved");
										},
										className: "rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Supporter" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold mb-1 text-muted-foreground",
								children: "Admin Notes (Private):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editSupporterNotes,
								onChange: (e) => setEditSupporterNotes(e.target.value.slice(0, 200)),
								className: "sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditingSupporter(null),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminPage as component };
