import { o as __toESM } from "../_runtime.mjs";
import { t as API_BASE } from "./api-CvQPumbW.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Plus, E as PenLine, H as EyeOff, L as Heart, N as LogOut, Q as Check, V as Eye, Y as CircleCheck, _ as Send, b as RefreshCw, c as TriangleAlert, et as BookOpen, g as Server, i as Users, l as Trash2, nt as ArrowLeft, q as Clock, rt as Activity, t as X, u as Terminal, v as Search, x as Radio } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Sys5rbIw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/Users/aadi/Downloads/f8225c15-5378-482e-bfe4-be001f84d384/src/routes/admin.tsx?tsr-split=component";
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "sketch bg-card p-8 text-center space-y-3 border-2 border-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Terminal, { className: "h-8 w-8 animate-spin mx-auto text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 575,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "font-display text-2xl font-bold",
					children: "Checking Classroom Records..."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 576,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground font-hand",
					children: "Opening notebook ledger"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 577,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 574,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 573,
		columnNumber: 12
	}, this);
	if (!authorized) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen px-4 py-16 flex items-center justify-center font-hand",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "notebook relative max-w-md w-full p-8 shadow-2xl border-4 border-foreground text-center space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "tape absolute -top-4 left-1/2 h-7 w-36 -translate-x-1/2 rotate-[-2deg]" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 586,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-6xl font-display font-extrabold text-primary",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 588,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
						children: "Notebook Page Not Found 📝"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 593,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-foreground/80 leading-relaxed",
						children: "Looks like this page was torn out or never existed in the classroom ledger. The imposter might have erased the clues!"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 596,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 592,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "sketch inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-display text-base font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 no-underline cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 603,
							columnNumber: 15
						}, this), "Return to Classroom"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 602,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 601,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 585,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 584,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen px-3 py-4 sm:py-8 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto max-w-6xl space-y-6 font-hand",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "sketch bg-card/95 p-4 sm:p-5 border-2 border-foreground flex flex-wrap items-center justify-between gap-3 shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold",
								children: "🎓"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 617,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
									className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
									children: "Principal Office"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 622,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase",
									children: "Super Admin"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 625,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 621,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground flex items-center gap-1 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: currentUserEmail }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 630,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-green-600 font-bold",
									children: "● Active"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 631,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 629,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 620,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 616,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/",
								className: "sketch bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 15
								}, this), " Back to Game"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 637,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => {
									fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).then(() => {
										window.location.href = "/";
									});
								},
								className: "sketch bg-accent text-accent-foreground px-3 py-1.5 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 647,
									columnNumber: 15
								}, this), " Sign Out"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 640,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 636,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 615,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
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
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setActiveTab(tab.id),
								className: `sketch px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] scale-[1.02]" : "bg-white/80 text-foreground hover:bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 682,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: tab.label }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 683,
									columnNumber: 17
								}, this)]
							}, tab.id, true, {
								fileName: _jsxFileName,
								lineNumber: 681,
								columnNumber: 18
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 653,
						columnNumber: 9
					}, this),
					activeTab === "overview" && stats && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-primary",
										children: stats.totalUsers
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 693,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Users"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 696,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 692,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-green-700",
										children: stats.registeredUsers
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 700,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Google Signups"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 703,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 699,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-amber-700",
										children: stats.activeRoomsCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 707,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Live Rooms"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 710,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 706,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-accent",
										children: stats.livePlayersCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 714,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Live CCU"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 717,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 713,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-indigo-700",
										children: stats.totalWords
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 721,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Word Pairs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 724,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 720,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-3 sm:p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-purple-700",
										children: stats.totalMatches
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 728,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Matches Played"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 731,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 727,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 691,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center justify-between border-b border-foreground/20 pb-2",
								children: [/* @__PURE__ */ (void 0)("h3", {
									className: "font-display text-xl font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)(Server, { className: "h-5 w-5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 739,
										columnNumber: 19
									}, this), " Backend Engine & Memory Health"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 738,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-mono font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded",
									children: [
										"Node ",
										stats.nodeVersion,
										" · Online"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 741,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 737,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "grid sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-muted-foreground font-bold",
											children: "Process Uptime"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 748,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-lg font-display font-bold text-foreground",
											children: [
												Math.floor(stats.serverUptimeSec / 3600),
												"h ",
												Math.floor(stats.serverUptimeSec % 3600 / 60),
												"m"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 749,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 747,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-muted-foreground font-bold",
											children: "Memory RSS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 755,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-lg font-display font-bold text-primary",
											children: [stats.memoryRssMb, " MB"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 756,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 754,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-muted-foreground font-bold",
											children: "Heap Used"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 760,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-lg font-display font-bold text-accent",
											children: [stats.memoryHeapUsedMb, " MB"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 761,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 759,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-white/80 rounded border border-foreground/20",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-muted-foreground font-bold",
											children: "Total Support Logged"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 765,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-lg font-display font-bold text-green-700",
											children: ["₹", stats.totalSupportAmount.toLocaleString("en-IN")]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 766,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 764,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 746,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 736,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 689,
						columnNumber: 47
					}, this),
					activeTab === "rooms" && /* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(Radio, { className: "h-5 w-5 text-accent animate-pulse" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 779,
									columnNumber: 19
								}, this), " Real-Time Multiplayer Rooms"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 778,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: "Active rooms in server RAM. Disband any suspicious room instantly."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 781,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 777,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								onClick: loadDashboardData,
								className: "sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 786,
									columnNumber: 17
								}, this), " Refresh"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 785,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 776,
							columnNumber: 13
						}, this), rooms.length === 0 ? /* @__PURE__ */ (void 0)("div", {
							className: "p-8 text-center text-muted-foreground text-sm",
							children: "No active multiplayer game rooms right now."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 790,
							columnNumber: 35
						}, this) : /* @__PURE__ */ (void 0)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (void 0)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (void 0)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Room Code"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 796,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Host"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 797,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Players"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 798,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Mode"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 799,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Phase"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 800,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Round"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 801,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5 text-right",
											children: "Admin Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 802,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 795,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 794,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: rooms.map((r) => /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-mono font-bold text-primary",
											children: ["#", r.roomCode]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 807,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold",
											children: r.hostName
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 808,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5",
											children: [
												r.playersCount,
												"/",
												r.maxPlayers
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 809,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 uppercase font-bold text-[10px]",
											children: r.gameMode
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 812,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5",
											children: /* @__PURE__ */ (void 0)("span", {
												className: "bg-highlight/60 px-2 py-0.5 rounded font-bold uppercase text-[10px]",
												children: r.phase
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 814,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 813,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5",
											children: ["Round ", r.currentRound]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 818,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 text-right",
											children: /* @__PURE__ */ (void 0)("button", {
												onClick: () => handleCloseRoom(r.roomCode),
												className: "sketch bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-bold hover:brightness-110 cursor-pointer",
												children: "Disband Room"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 820,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 819,
											columnNumber: 25
										}, this)
									] }, r.roomCode, true, {
										fileName: _jsxFileName,
										lineNumber: 806,
										columnNumber: 37
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 805,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 793,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 792,
							columnNumber: 24
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 775,
						columnNumber: 35
					}, this),
					activeTab === "users" && /* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(Users, { className: "h-5 w-5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 834,
									columnNumber: 17
								}, this), " Student Detective Directory"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 833,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (void 0)(Search, { className: "h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 839,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("input", {
											type: "text",
											value: userSearch,
											onChange: (e) => setUserSearch(e.target.value),
											onKeyDown: (e) => e.key === "Enter" && loadUsers(),
											placeholder: "Search name, email, @...",
											className: "sketch bg-white pl-8 pr-3 py-1 text-xs font-bold w-48 focus:outline-none"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 840,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 838,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("select", {
										value: userFilter,
										onChange: (e) => setUserFilter(e.target.value),
										className: "sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none",
										children: [
											/* @__PURE__ */ (void 0)("option", {
												value: "all",
												children: "All Users"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 844,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "registered",
												children: "Registered Google Users"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 845,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "guests",
												children: "Guest Accounts"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 846,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 843,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										onClick: loadUsers,
										className: "sketch bg-secondary px-3 py-1 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 850,
											columnNumber: 19
										}, this), " Search"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 849,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 837,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 832,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (void 0)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (void 0)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Detective"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 859,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Email"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 860,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Handle"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 861,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Location"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 862,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Wins / Played"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 863,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Win Rate"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 864,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5 text-right",
											children: "Actions"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 865,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 858,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 857,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: users.map((u) => /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)("span", { children: u.displayName }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 871,
												columnNumber: 25
											}, this), u.isGuest && /* @__PURE__ */ (void 0)("span", {
												className: "bg-muted px-1.5 py-0.2 rounded text-[10px] font-bold text-muted-foreground",
												children: "Guest"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 872,
												columnNumber: 39
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 870,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-mono text-[11px] text-muted-foreground",
											children: u.email
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 876,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-mono text-primary font-bold",
											children: u.username ? `@${u.username}` : "—"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 877,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 text-muted-foreground",
											children: [
												u.city,
												", ",
												u.state
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 880,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold",
											children: [
												u.wins,
												" / ",
												u.matchesPlayed
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 883,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold",
											children: [u.winRate, "%"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 886,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 text-right space-x-1 whitespace-nowrap",
											children: [/* @__PURE__ */ (void 0)("button", {
												onClick: () => {
													setEditingUser(u);
													setEditDisplayName(u.displayName);
													setEditUsername(u.username || "");
													setEditWins(u.wins);
												},
												className: "sketch bg-secondary px-2 py-0.5 text-[11px] font-bold hover:bg-secondary/80 cursor-pointer",
												children: [/* @__PURE__ */ (void 0)(PenLine, { className: "h-3 w-3 inline mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 894,
													columnNumber: 27
												}, this), " Edit"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 888,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("button", {
												onClick: () => handleDeleteUser(u),
												className: "sketch bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-bold hover:brightness-110 cursor-pointer",
												children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3 w-3 inline" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 897,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 896,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 887,
											columnNumber: 23
										}, this)
									] }, u.id, true, {
										fileName: _jsxFileName,
										lineNumber: 869,
										columnNumber: 35
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 868,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 856,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 855,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 831,
						columnNumber: 35
					}, this),
					activeTab === "words" && /* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-card/90 p-5 border-2 border-foreground space-y-4",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-xl font-bold flex items-center gap-2",
								children: [
									/* @__PURE__ */ (void 0)(BookOpen, { className: "h-5 w-5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 911,
										columnNumber: 19
									}, this),
									" Classroom Word Bank (",
									stats?.totalWords || 4803,
									"+)"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 910,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: "Browse, search, or add secret word pairs to the classroom rotation."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 913,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 909,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (void 0)("input", {
										type: "text",
										value: wordSearch,
										onChange: (e) => setWordSearch(e.target.value),
										onKeyDown: (e) => e.key === "Enter" && loadWords(),
										placeholder: "Search words...",
										className: "sketch bg-white px-3 py-1 text-xs font-bold w-40 focus:outline-none"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 919,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("select", {
										value: wordCategoryFilter,
										onChange: (e) => setWordCategoryFilter(e.target.value),
										className: "sketch bg-white px-2 py-1 text-xs font-bold focus:outline-none max-w-36 truncate",
										children: [/* @__PURE__ */ (void 0)("option", {
											value: "All",
											children: "All Categories"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 922,
											columnNumber: 19
										}, this), wordCategories.map((c) => /* @__PURE__ */ (void 0)("option", {
											value: c,
											children: c
										}, c, false, {
											fileName: _jsxFileName,
											lineNumber: 923,
											columnNumber: 44
										}, this))]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 921,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										onClick: () => setShowAddWordModal(true),
										className: "sketch bg-primary text-primary-foreground px-3 py-1 text-xs font-bold hover:brightness-110 flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 929,
											columnNumber: 19
										}, this), " Add Word Pair"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 928,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 918,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 908,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (void 0)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (void 0)("thead", {
									className: "bg-muted/40 border-b border-foreground/20 uppercase font-bold text-muted-foreground",
									children: /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Category"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 938,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Common Word (Detectives)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 939,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Imposter Word"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 940,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5",
											children: "Difficulty"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 941,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("th", {
											className: "p-2.5 text-right",
											children: "Actions"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 942,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 937,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 936,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("tbody", {
									className: "divide-y divide-foreground/10 bg-white/70",
									children: words.map((w) => /* @__PURE__ */ (void 0)("tr", { children: [
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold text-primary",
											children: w.category
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 947,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold text-base",
											children: w.commonWord
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 948,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 font-bold text-base text-accent",
											children: w.imposterWord
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 949,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 uppercase font-bold text-[10px]",
											children: w.difficulty
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 950,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("td", {
											className: "p-2.5 text-right",
											children: /* @__PURE__ */ (void 0)("button", {
												onClick: () => handleDeleteWord(w.id, `${w.commonWord} / ${w.imposterWord}`),
												className: "sketch bg-accent/20 text-accent hover:bg-accent hover:text-white px-2 py-0.5 text-xs font-bold rounded cursor-pointer",
												children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3 w-3 inline" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 953,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 952,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 951,
											columnNumber: 23
										}, this)
									] }, w.id, true, {
										fileName: _jsxFileName,
										lineNumber: 946,
										columnNumber: 35
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 945,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 935,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 934,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 907,
						columnNumber: 35
					}, this),
					activeTab === "supporters" && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
										children: supporterCounts.total
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 967,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Submissions"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 970,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 966,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-4 text-center border-2 border-amber-500/50 space-y-1 bg-amber-50/50",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-amber-600 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (void 0)(Clock, { className: "h-5 w-5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 977,
											columnNumber: 19
										}, this), supporterCounts.pending]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 976,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-amber-800 uppercase",
										children: "Pending Verification"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 980,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 975,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-4 text-center border-2 border-green-500/50 space-y-1 bg-green-50/50",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-green-700 flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-5 w-5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 987,
											columnNumber: 19
										}, this), supporterCounts.approved]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 986,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-green-800 uppercase",
										children: "Live on Public Wall"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 990,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 985,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "sketch bg-card/90 p-4 text-center border border-foreground/30 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-2xl sm:text-3xl font-display font-bold text-primary",
										children: ["₹", supporterCounts.totalApprovedAmount.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 996,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] font-bold text-muted-foreground uppercase",
										children: "Total Verified Chai"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 999,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 995,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 965,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "sketch bg-card/90 p-4 sm:p-6 border-2 border-foreground space-y-4",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-3",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
										className: "font-display text-2xl font-bold flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)(Heart, { className: "h-6 w-6 text-accent fill-accent" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1010,
											columnNumber: 21
										}, this), " Supporter Wall Moderation"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1009,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "User submissions stay pending until verified. Add custom supporters or approve submissions to make them visible on the wall."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1012,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1008,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (void 0)("button", {
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
											children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1027,
												columnNumber: 21
											}, this), " Add Supporter"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1018,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1017,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1007,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 text-xs",
									children: [/* @__PURE__ */ (void 0)("div", {
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
										].map((f) => /* @__PURE__ */ (void 0)("button", {
											onClick: () => setSupporterFilter(f.id),
											className: `sketch px-3 py-1 font-bold cursor-pointer transition ${supporterFilter === f.id ? "bg-foreground text-background" : "bg-white/80 text-foreground hover:bg-white"}`,
											children: f.label
										}, f.id, false, {
											fileName: _jsxFileName,
											lineNumber: 1047,
											columnNumber: 27
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1034,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2 w-full sm:w-auto",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "relative flex-1 sm:w-64",
											children: [/* @__PURE__ */ (void 0)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1054,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												type: "text",
												value: supporterSearch,
												onChange: (e) => setSupporterSearch(e.target.value),
												onKeyDown: (e) => e.key === "Enter" && loadSupporters(),
												placeholder: "Search name or message...",
												className: "sketch w-full bg-white pl-8 pr-3 py-1 font-bold text-xs focus:outline-none"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1055,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1053,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("button", {
											onClick: loadSupporters,
											className: "sketch bg-secondary p-1.5 hover:bg-secondary/80 cursor-pointer",
											title: "Refresh List",
											children: /* @__PURE__ */ (void 0)(RefreshCw, { className: `h-3.5 w-3.5 ${loadingSupporters ? "animate-spin" : ""}` }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1058,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1057,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1052,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1033,
									columnNumber: 15
								}, this),
								loadingSupporters ? /* @__PURE__ */ (void 0)("div", {
									className: "p-8 text-center text-xs font-bold text-muted-foreground animate-pulse",
									children: "Loading supporters from classroom ledger..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1064,
									columnNumber: 36
								}, this) : supporters.length === 0 ? /* @__PURE__ */ (void 0)("div", {
									className: "border-2 border-dashed border-foreground/30 bg-white/60 p-8 text-center rounded space-y-2",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "font-display text-2xl font-bold text-muted-foreground/60",
										children: "No Supporters Found"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1067,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground max-w-sm mx-auto",
										children: supporterFilter === "pending" ? "Great job! All supporter submissions have been reviewed." : "No supporters found matching the current search or filter."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1070,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1066,
									columnNumber: 52
								}, this) : /* @__PURE__ */ (void 0)("div", {
									className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2",
									children: supporters.map((s) => {
										const isPending = !s.isVerified || s.status === "pending";
										const isApproved = s.isVerified && s.status === "approved";
										return /* @__PURE__ */ (void 0)("div", {
											className: `sketch bg-card/95 p-4 border-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between transition-all ${isPending ? "border-amber-500 bg-amber-50/30" : isApproved ? "border-foreground/60" : "border-red-400/60 opacity-70"}`,
											children: [/* @__PURE__ */ (void 0)("div", { children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-start justify-between gap-2",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ (void 0)("div", {
															className: "w-9 h-9 shrink-0 border-2 border-foreground bg-highlight flex items-center justify-center font-display text-base font-bold rounded",
															children: (s.name || "?").trim().charAt(0).toUpperCase()
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1082,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ (void 0)("div", {
																className: "font-display text-base font-bold truncate text-foreground",
																children: s.name
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1086,
																columnNumber: 33
															}, this), /* @__PURE__ */ (void 0)("div", {
																className: "text-[10px] text-muted-foreground",
																children: new Date(s.paidAt || s.createdAt).toLocaleDateString("en-IN", {
																	day: "2-digit",
																	month: "short",
																	year: "numeric"
																})
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1089,
																columnNumber: 33
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1085,
															columnNumber: 31
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1081,
														columnNumber: 29
													}, this), /* @__PURE__ */ (void 0)("div", { children: isApproved ? /* @__PURE__ */ (void 0)("span", {
														className: "inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded",
														children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1102,
															columnNumber: 35
														}, this), " Live on Wall"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1101,
														columnNumber: 45
													}, this) : isPending ? /* @__PURE__ */ (void 0)("span", {
														className: "inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse",
														children: [/* @__PURE__ */ (void 0)(Clock, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1104,
															columnNumber: 35
														}, this), " Pending Review"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1103,
														columnNumber: 55
													}, this) : /* @__PURE__ */ (void 0)("span", {
														className: "inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded",
														children: [/* @__PURE__ */ (void 0)(X, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1106,
															columnNumber: 35
														}, this), " Rejected"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1105,
														columnNumber: 43
													}, this) }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1100,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1080,
													columnNumber: 27
												}, this),
												s.message ? /* @__PURE__ */ (void 0)("div", {
													className: "mt-3 pl-2.5 border-l-2 border-primary text-xs italic text-foreground/80 break-words bg-white/50 p-1.5 rounded",
													children: [
														"\"",
														s.message,
														"\""
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1112,
													columnNumber: 40
												}, this) : /* @__PURE__ */ (void 0)("div", {
													className: "mt-2 text-[11px] text-muted-foreground italic",
													children: "(No message provided)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1114,
													columnNumber: 38
												}, this),
												s.notes && /* @__PURE__ */ (void 0)("div", {
													className: "mt-2 text-[11px] text-amber-900 bg-amber-100/60 border border-amber-200 px-2 py-1 rounded",
													children: [
														/* @__PURE__ */ (void 0)("span", {
															className: "font-bold",
															children: "Admin Note:"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1120,
															columnNumber: 31
														}, this),
														" ",
														s.notes
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1119,
													columnNumber: 39
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1078,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "mt-4 pt-3 border-t border-foreground/15 space-y-3",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-xs font-bold",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "bg-highlight px-2 py-0.5 rounded border border-foreground/20 text-foreground font-display text-sm",
														children: ["₹", Number(s.amount).toLocaleString("en-IN")]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1127,
														columnNumber: 29
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "text-[10px] text-muted-foreground uppercase flex items-center gap-1",
														children: s.showAmount ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Eye, { className: "h-3 w-3 text-green-600" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1132,
															columnNumber: 35
														}, this), " Amount Public"] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1131,
															columnNumber: 47
														}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(EyeOff, { className: "h-3 w-3 text-muted-foreground" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1134,
															columnNumber: 35
														}, this), " Amount Hidden"] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1133,
															columnNumber: 39
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1130,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1126,
													columnNumber: 27
												}, this), /* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between gap-1.5 pt-1",
													children: [isPending ? /* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-1.5 flex-1",
														children: [/* @__PURE__ */ (void 0)("button", {
															onClick: () => handleVerifySupporter(s.id, true, "approved"),
															className: "sketch flex-1 bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-[1px_1px_0_0_rgba(0,0,0,1)]",
															children: [/* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1143,
																columnNumber: 35
															}, this), " Approve & Add to Wall"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1142,
															columnNumber: 33
														}, this), /* @__PURE__ */ (void 0)("button", {
															onClick: () => handleVerifySupporter(s.id, false, "rejected"),
															className: "sketch bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition",
															title: "Reject",
															children: [/* @__PURE__ */ (void 0)(X, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1146,
																columnNumber: 35
															}, this), " Reject"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1145,
															columnNumber: 33
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1141,
														columnNumber: 42
													}, this) : isApproved ? /* @__PURE__ */ (void 0)("button", {
														onClick: () => handleVerifySupporter(s.id, false, "pending"),
														className: "sketch bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition",
														children: [/* @__PURE__ */ (void 0)(EyeOff, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1149,
															columnNumber: 33
														}, this), " Hide from Wall"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1148,
														columnNumber: 53
													}, this) : /* @__PURE__ */ (void 0)("button", {
														onClick: () => handleVerifySupporter(s.id, true, "approved"),
														className: "sketch bg-green-100 hover:bg-green-200 text-green-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition",
														children: [/* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1151,
															columnNumber: 33
														}, this), " Restore & Approve"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1150,
														columnNumber: 43
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (void 0)("button", {
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
															children: /* @__PURE__ */ (void 0)(PenLine, { className: "h-3.5 w-3.5 text-foreground" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1165,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1155,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)("button", {
															onClick: () => handleDeleteSupporter(s.id, s.name),
															className: "sketch bg-red-100 hover:bg-red-200 p-1.5 rounded cursor-pointer text-red-700",
															title: "Delete Supporter",
															children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1168,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1167,
															columnNumber: 31
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1154,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1140,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1125,
												columnNumber: 25
											}, this)]
										}, s.id, true, {
											fileName: _jsxFileName,
											lineNumber: 1077,
											columnNumber: 22
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1073,
									columnNumber: 26
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1006,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 963,
						columnNumber: 40
					}, this),
					activeTab === "broadcast" && /* @__PURE__ */ (void 0)("div", {
						className: "sketch bg-card/90 p-5 sm:p-7 border-2 border-foreground space-y-5",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "border-b border-foreground/20 pb-3",
							children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-2xl font-bold flex items-center gap-2 text-foreground",
								children: [/* @__PURE__ */ (void 0)(Send, { className: "h-6 w-6 text-accent" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1183,
									columnNumber: 17
								}, this), " Live Classroom Megaphone Announcement"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1182,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Send an immediate real-time announcement banner to all connected players and game rooms."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1185,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1181,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("form", {
							onSubmit: handleSendBroadcast,
							className: "space-y-4 max-w-xl",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [
									/* @__PURE__ */ (void 0)("label", {
										className: "block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider",
										children: "Announcement Message (Max 250 characters)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1192,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("textarea", {
										rows: 3,
										value: broadcastMessage,
										onChange: (e) => setBroadcastMessage(e.target.value.slice(0, 250)),
										placeholder: "e.g. Attention students: Imposter World Tournament bracket starts in 5 minutes! Assemble in your rooms.",
										className: "sketch w-full bg-white p-3 text-sm font-hand rounded border-2 border-foreground/40 focus:outline-none focus:border-primary"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1195,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] text-muted-foreground text-right",
										children: [broadcastMessage.length, "/250"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1196,
										columnNumber: 17
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1191,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-highlight/30 rounded border border-foreground/20 text-xs text-foreground/80 space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "font-bold flex items-center gap-1.5 text-primary",
										children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1201,
											columnNumber: 19
										}, this), " Broadcast Notice"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1200,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", { children: "This announcement will appear across all active player screens in real-time as an official Principal Bulletin with sound alert." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1203,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1199,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									type: "submit",
									disabled: broadcasting,
									className: "sketch bg-accent text-accent-foreground px-6 py-2.5 rounded font-display uppercase tracking-wider text-sm font-bold hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50",
									children: [
										/* @__PURE__ */ (void 0)(Send, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1209,
											columnNumber: 17
										}, this),
										" ",
										broadcasting ? "Broadcasting..." : "Broadcast to All Rooms 📢"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1208,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1190,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1180,
						columnNumber: 39
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 613,
				columnNumber: 7
			}, this),
			showAddWordModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-2xl font-bold",
							children: "Add Secret Word Pair"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1219,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => setShowAddWordModal(false),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1221,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1220,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1218,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleCreateWord,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Category:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1227,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: newWordCategory,
								onChange: (e) => setNewWordCategory(e.target.value),
								placeholder: "e.g. Movies, Food, School",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1228,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1226,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Common Word (Detectives):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1232,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: newWordCommon,
								onChange: (e) => setNewWordCommon(e.target.value),
								placeholder: "e.g. Coffee",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-primary",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1233,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1231,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Imposter Word (Lookalike Clue):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1237,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: newWordImposter,
								onChange: (e) => setNewWordImposter(e.target.value),
								placeholder: "e.g. Tea",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none text-accent",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1238,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1236,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Difficulty:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1242,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("select", {
								value: newWordDifficulty,
								onChange: (e) => setNewWordDifficulty(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								children: [
									/* @__PURE__ */ (void 0)("option", {
										value: "easy",
										children: "Easy"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1244,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "medium",
										children: "Medium"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1245,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "hard",
										children: "Hard"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1246,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1243,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1241,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setShowAddWordModal(false),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1251,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer",
									children: "Save to Bank"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1254,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1250,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1225,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1217,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1216,
				columnNumber: 28
			}, this),
			editingUser && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-2xl font-bold",
							children: "Edit Student Profile"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1266,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => setEditingUser(null),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1268,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1267,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1265,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleSaveUser,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Display Name:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1274,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: editDisplayName,
								onChange: (e) => setEditDisplayName(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1275,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1273,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "@username Handle (optional):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1279,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: editUsername,
								onChange: (e) => setEditUsername(e.target.value),
								placeholder: "e.g. aditya.sharma",
								className: "sketch w-full bg-white px-3 py-1.5 font-mono font-bold focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1280,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1278,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Recorded Wins:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1284,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "number",
								min: 0,
								value: editWins,
								onChange: (e) => setEditWins(parseInt(e.target.value, 10) || 0),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1285,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1283,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setEditingUser(null),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1289,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer",
									children: "Save Profile"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1292,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1288,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1272,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1264,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1263,
				columnNumber: 23
			}, this),
			showAddSupporterModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-2xl font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Heart, { className: "h-5 w-5 text-accent fill-accent" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1305,
								columnNumber: 17
							}, this), " Add Supporter to Wall"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1304,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => setShowAddSupporterModal(false),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1308,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1307,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1303,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleAddSupporter,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Supporter Name:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1314,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: newSupporterName,
								onChange: (e) => setNewSupporterName(e.target.value),
								placeholder: "e.g. Guest_5981 or Aditya Sharma",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1315,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1313,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Contribution Amount (₹):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1319,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "number",
								min: 0,
								step: 1,
								value: newSupporterAmount,
								onChange: (e) => setNewSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0)),
								placeholder: "501",
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1320,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1318,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [
								/* @__PURE__ */ (void 0)("label", {
									className: "block font-bold mb-1",
									children: "Message for Developer (Optional):"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1324,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("textarea", {
									rows: 3,
									value: newSupporterMessage,
									onChange: (e) => setNewSupporterMessage(e.target.value.slice(0, 500)),
									placeholder: "Say something nice, suggest a game mode, or send chai love...",
									className: "sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1325,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "text-[10px] text-muted-foreground text-right",
									children: [newSupporterMessage.length, "/500"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1326,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1323,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2 pt-1 border-t border-foreground/10",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: newSupporterShowAmount,
										onChange: (e) => setNewSupporterShowAmount(e.target.checked),
										className: "rounded border-foreground text-primary focus:ring-primary h-4 w-4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1331,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: [
										"Display amount (₹",
										newSupporterAmount,
										") publicly on wall"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1332,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1330,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer text-green-700",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: newSupporterVerified,
										onChange: (e) => setNewSupporterVerified(e.target.checked),
										className: "rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1336,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: "Mark as Verified Supporter (Publish to wall immediately)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1337,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1335,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1329,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1 text-muted-foreground",
								children: "Admin Notes (Private):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1342,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: newSupporterNotes,
								onChange: (e) => setNewSupporterNotes(e.target.value.slice(0, 200)),
								placeholder: "e.g. Paid via UPI reference #12345",
								className: "sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1343,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1341,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setShowAddSupporterModal(false),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1347,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1351,
										columnNumber: 19
									}, this), " Save Supporter"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1350,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1346,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1312,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1302,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1301,
				columnNumber: 33
			}, this),
			editingSupporter && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs font-hand",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "notebook relative w-full max-w-md bg-card p-6 shadow-2xl border-2 border-foreground space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-foreground/20 pb-2",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-2xl font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(PenLine, { className: "h-5 w-5 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1363,
								columnNumber: 17
							}, this), " Edit Supporter"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1362,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => setEditingSupporter(null),
							className: "cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1366,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1365,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1361,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleSaveEditSupporter,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Supporter Name:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1372,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: editSupporterName,
								onChange: (e) => setEditSupporterName(e.target.value),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1373,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1371,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Contribution Amount (₹):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1377,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "number",
								min: 0,
								value: editSupporterAmount,
								onChange: (e) => setEditSupporterAmount(Math.max(0, parseInt(e.target.value, 10) || 0)),
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none font-display text-primary text-sm",
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1378,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1376,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Message:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1382,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("textarea", {
								rows: 3,
								value: editSupporterMessage,
								onChange: (e) => setEditSupporterMessage(e.target.value.slice(0, 500)),
								className: "sketch w-full bg-white p-2.5 font-hand focus:outline-none resize-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1383,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1381,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1",
								children: "Status on Wall:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1387,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("select", {
								value: editSupporterStatus,
								onChange: (e) => {
									const st = e.target.value;
									setEditSupporterStatus(st);
									setEditSupporterVerified(st === "approved");
								},
								className: "sketch w-full bg-white px-3 py-1.5 font-bold focus:outline-none",
								children: [
									/* @__PURE__ */ (void 0)("option", {
										value: "approved",
										children: "✅ Approved & Live on Public Wall"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1393,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "pending",
										children: "⏳ Pending Review (Hidden from Wall)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1394,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "rejected",
										children: "❌ Rejected (Hidden from Wall)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1395,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1388,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1386,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2 pt-1 border-t border-foreground/10",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: editSupporterShowAmount,
										onChange: (e) => setEditSupporterShowAmount(e.target.checked),
										className: "rounded border-foreground text-primary focus:ring-primary h-4 w-4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1401,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: [
										"Display amount (₹",
										editSupporterAmount,
										") publicly on wall"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1402,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1400,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 font-bold cursor-pointer text-green-700",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: editSupporterVerified,
										onChange: (e) => {
											setEditSupporterVerified(e.target.checked);
											if (e.target.checked) setEditSupporterStatus("approved");
										},
										className: "rounded border-foreground text-green-600 focus:ring-green-600 h-4 w-4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1406,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: "Verified Supporter" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1410,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1405,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1399,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold mb-1 text-muted-foreground",
								children: "Admin Notes (Private):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1415,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: editSupporterNotes,
								onChange: (e) => setEditSupporterNotes(e.target.value.slice(0, 200)),
								className: "sketch w-full bg-white px-3 py-1.5 text-xs focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1416,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1414,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setEditingSupporter(null),
									className: "sketch bg-secondary px-4 py-1.5 font-bold cursor-pointer",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1420,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "sketch bg-primary text-primary-foreground px-4 py-1.5 font-bold cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:brightness-110 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1424,
										columnNumber: 19
									}, this), " Save Changes"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1423,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1419,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1370,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1360,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1359,
				columnNumber: 28
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 612,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminPage as component };
