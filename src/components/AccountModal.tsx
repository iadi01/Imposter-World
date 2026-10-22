import { X, Trophy, Flame, LogOut, Check, MapPin, Globe, Loader2, AlertCircle, RefreshCw, AtSign, Lock, Music, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { sound } from "../lib/sound";
import { useUsernameCheck } from "../hooks/useUsernameCheck";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "../lib/locations";

export interface UserProfile {
  id: string;
  displayName: string;
  username?: string | undefined;
  email: string;
  avatarUrl?: string | undefined;
  country?: string | undefined;
  state?: string | undefined;
  city?: string | undefined;
  matchesPlayed: number;
  wins: number;
  imposterWins?: number | undefined;
  winRate: number;
  isGuest?: boolean | undefined;
  isAdmin?: boolean | undefined;
}

export function AccountModal({
  user,
  onClose,
  onLogout,
  onGoogleLogin,
  onUpdateProfile,
}: {
  user: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
  onGoogleLogin: () => void;
  onUpdateProfile: (data: {
    displayName: string;
    username?: string | undefined;
    country?: string | undefined;
    state?: string | undefined;
    city?: string | undefined;
  }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || "Aadi");
  const [countryInput, setCountryInput] = useState(user?.country || "India");
  const [stateInput, setStateInput] = useState(user?.state || "Maharashtra");
  const [cityInput, setCityInput] = useState(user?.city || "Mumbai");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [currentTrack, setCurrentTrack] = useState(sound.getCurrentTrack());
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  useEffect(() => {
    return sound.onTrackChange((_idx, track) => {
      setCurrentTrack(track);
    });
  }, []);

  // Hook for Instagram-style real-time username check with 300ms debounce
  const {
    username,
    setUsername,
    status: usernameStatus,
    message: usernameMessage,
    isValid: isUsernameValid,
    isChecking,
    retry,
  } = useUsernameCheck(user?.username || "", user?.id || "");

  const handleSaveProfile = () => {
    setSaveError(null);
    if (!nameInput.trim()) {
      setSaveError("Detective name cannot be empty");
      return;
    }

    // Guest users cannot set custom username
    if (user?.isGuest) {
      onUpdateProfile({
        displayName: nameInput.trim(),
        country: countryInput,
        state: stateInput,
        city: cityInput.trim() || undefined,
      });
      setEditing(false);
      return;
    }

    // If username is modified by registered user, it must be valid or empty
    if (username && username !== user?.username && !isUsernameValid) {
      setSaveError("Please pick a valid, available username before saving.");
      return;
    }

    onUpdateProfile({
      displayName: nameInput.trim(),
      username: username.trim() || undefined,
      country: countryInput,
      state: stateInput,
      city: cityInput.trim() || undefined,
    });
    setEditing(false);
  };

  const currentStates = getStatesForCountry(countryInput);
  const currentCities = getCitiesForState(stateInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs">
      <div className="notebook relative w-full max-w-md max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[-1deg]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3">
          <h2 className="text-2xl sm:text-3xl font-display text-foreground">Detective Dossier</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-secondary text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-3 font-hand">
          {/* Avatar with detective styling */}
          <div className="relative">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="sketch h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-foreground"
              />
            ) : (
              <div className="sketch flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-accent/20 border-2 border-foreground">
                <img src="/detective.png" alt="Detective" className="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 rounded-full bg-accent p-1 text-accent-foreground text-xs font-bold border border-foreground shadow-xs">
              🕵️
            </span>
          </div>

          {/* User Details & Location */}
          <div className="w-full space-y-2">
            {editing ? (
              <div className="space-y-3 text-left bg-white/75 p-3 sm:p-4 rounded border border-foreground/30">
                {/* 1. Detective Display Name */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-0.5">Detective Name:</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="sketch w-full bg-white px-2.5 py-1 font-bold text-base text-foreground focus:outline-none"
                    maxLength={25}
                    placeholder="e.g. Aadi"
                  />
                </div>

                {/* 2. Username Handle - Lock for Guest, Unlocked for Registered */}
                {user?.isGuest ? (
                  <div className="bg-amber-50/90 border border-amber-300/80 rounded-md p-2.5 sm:p-3 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-amber-700" />
                        <span>Username Handle:</span>
                      </label>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                        🔒 Lock (Unlock using Sign Up)
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-950/80 font-sans leading-tight">
                      Apna manpasand custom <strong className="font-mono">@username</strong> handle claim karne ke liye Google se sign up karein. Abhi guest mode me yeh locked hai.
                    </p>
                    <button
                      type="button"
                      onClick={onGoogleLogin}
                      className="sketch w-full flex items-center justify-center gap-2 bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-xs"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google to Unlock @username</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1">
                        <AtSign className="h-3 w-3 text-accent" /> Username handle:
                      </label>
                      <span className="text-[10px] text-muted-foreground">3-20 chars (a-z, 0-9, ., _)</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-sm font-bold text-muted-foreground select-none">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="sketch w-full bg-white pl-7 pr-8 py-1 font-mono text-sm text-foreground lowercase focus:outline-none"
                        maxLength={20}
                        placeholder="apna_username"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                      />

                      {/* Live Status Icon */}
                      <div className="absolute right-2.5 top-1.5">
                        {isChecking && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
                        {!isChecking && usernameStatus === "available" && (
                          <Check className="h-4 w-4 text-emerald-600 font-bold" />
                        )}
                        {!isChecking && usernameStatus === "taken" && (
                          <X className="h-4 w-4 text-rose-600 font-bold" />
                        )}
                        {!isChecking && usernameStatus === "invalid" && (
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        )}
                        {!isChecking && usernameStatus === "error" && (
                          <button type="button" onClick={retry} title="Click to retry">
                            <RefreshCw className="h-4 w-4 text-rose-500 hover:rotate-180 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Feedback Message */}
                    {usernameMessage && (
                      <p
                        className={`text-[11px] font-sans mt-1 flex items-center gap-1 ${
                          usernameStatus === "available"
                            ? "text-emerald-700 font-semibold"
                            : usernameStatus === "taken"
                            ? "text-rose-700 font-semibold"
                            : usernameStatus === "invalid"
                            ? "text-amber-700"
                            : usernameStatus === "error"
                            ? "text-rose-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {usernameStatus === "available" && "✅ "}
                        {usernameStatus === "taken" && "❌ "}
                        {usernameStatus === "invalid" && "⚠️ "}
                        {usernameMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* 3. Location Selectors: Country, State, City */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-0.5">Country:</label>
                    <select
                      value={countryInput}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setCountryInput(newCountry);
                        const states = getStatesForCountry(newCountry);
                        if (states && states[0]) {
                          setStateInput(states[0]);
                          const cities = getCitiesForState(states[0]);
                          if (cities && cities[0]) setCityInput(cities[0]);
                        }
                      }}
                      className="sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-0.5">State / Region:</label>
                    <select
                      value={stateInput}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setStateInput(newState);
                        const cities = getCitiesForState(newState);
                        if (cities && cities[0]) setCityInput(cities[0]);
                      }}
                      className="sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none"
                    >
                      {currentStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City Input with Datalist */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-0.5">City 🏙️:</label>
                  <input
                    type="text"
                    list="city-suggestions"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="sketch w-full bg-white px-2.5 py-1 text-xs text-foreground focus:outline-none"
                    placeholder="e.g. Mumbai, Delhi, Bengaluru, Pune"
                    maxLength={35}
                  />
                  <datalist id="city-suggestions">
                    {currentCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                {saveError && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-300 font-sans">
                    {saveError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setSaveError(null);
                    }}
                    className="sketch bg-secondary px-3 py-1 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="sketch flex items-center gap-1 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground hover:brightness-105"
                  >
                    <Check className="h-3.5 w-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    {user?.displayName || "Guest"}
                  </h3>
                  {user?.isGuest && (
                    <span className="text-[10px] font-sans font-bold bg-muted px-2 py-0.5 rounded border border-foreground/30 text-muted-foreground">
                      Guest
                    </span>
                  )}
                  {user?.username ? (
                    <span className="text-xs font-mono font-bold bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full border border-foreground/20">
                      @{user.username}
                    </span>
                  ) : user?.isGuest ? (
                    <button
                      type="button"
                      onClick={onGoogleLogin}
                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                      title="Sign in with Google to unlock custom @username handle"
                    >
                      <Lock className="h-3 w-3 text-amber-700" />
                      <span>Lock (Unlock using Sign Up)</span>
                    </button>
                  ) : null}
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-accent hover:underline font-bold px-1.5 py-0.5 rounded bg-accent/10"
                  >
                    Edit ✏️
                  </button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <span>
                    {user?.city ? `${user.city}, ` : "Mumbai, "}
                    {user?.state || stateInput || "Maharashtra"}, {user?.country || countryInput || "India"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/80">{user?.email || "guest@imposterworld.local"}</p>
              </div>
            )}
          </div>

          {/* Real Database Stats */}
          <div className="grid grid-cols-3 gap-2 w-full pt-2">
            <div className="sketch bg-white/75 p-2 sm:p-3 rounded text-center">
              <div className="text-xl sm:text-2xl font-bold font-display text-primary">
                {user?.matchesPlayed ?? 0}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-muted-foreground">MATCHES</div>
            </div>

            <div className="sketch bg-white/75 p-2 sm:p-3 rounded text-center">
              <div className="text-xl sm:text-2xl font-bold font-display text-accent">
                {user?.wins ?? 0}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-muted-foreground">WINS</div>
            </div>

            <div className="sketch bg-white/75 p-2 sm:p-3 rounded text-center">
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {user ? `${user.winRate}%` : "0%"}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-muted-foreground">WIN RATE</div>
            </div>
          </div>

          {/* Lo-Fi Classroom Music Controller with Auto-Switch */}
          <div className="sketch bg-[#FFFBEA] p-2.5 sm:p-3 rounded border border-foreground/30 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                <Music className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="truncate">{currentTrack.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <span className="bg-primary/10 text-primary px-1 rounded font-bold">Auto-Switching</span>
                <span className="truncate">{currentTrack.mood}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.nextTrack();
                  setCurrentTrack(sound.getCurrentTrack());
                }}
                className="sketch px-2 py-1 text-xs bg-card hover:bg-secondary flex items-center gap-1 font-bold cursor-pointer"
                title="Skip to next song"
              >
                <span>Next</span> ⏭️
              </button>
              <button
                type="button"
                onClick={() => {
                  const muted = sound.toggleMute();
                  setIsMuted(muted);
                }}
                className={`sketch px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  isMuted ? "bg-secondary text-foreground" : "bg-accent text-accent-foreground"
                }`}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span>{isMuted ? "Muted" : "On"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t-2 border-foreground/30 font-hand">
          {Boolean(user?.isAdmin) && (
            <a
              href="/admin"
              className="sketch w-full bg-primary text-primary-foreground py-2 text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-xs cursor-pointer text-center"
            >
              🎓 Open Principal Admin Console
            </a>
          )}
          {user?.isGuest ? (
            <button
              onClick={onGoogleLogin}
              className="sketch w-full flex items-center justify-center gap-2 bg-primary py-2.5 text-sm sm:text-base font-bold text-primary-foreground hover:brightness-110"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Link Verified Google Account
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="sketch w-full flex items-center justify-center gap-2 bg-secondary py-2 text-sm sm:text-base font-bold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          )}

          <button
            onClick={onClose}
            className="sketch w-full bg-card py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
