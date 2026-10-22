import { Trophy, X, Globe, MapPin, Flag, Building2, Search } from "lucide-react";
import { useEffect, useState, useCallback, useDeferredValue } from "react";
import { API_BASE } from "../lib/api";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "../lib/locations";

interface LeaderboardEntry {
  _id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  country?: string;
  state?: string;
  city?: string;
  matchesPlayed: number;
  wins: number;
  imposterWins?: number;
  winRate: number;
  isGuest?: boolean;
}

export function LeaderboardModal({ onClose }: { onClose: () => void }) {
  const [scope, setScope] = useState<"global" | "country" | "state" | "city">("global");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("scope", scope);

    if (scope === "country" || scope === "state" || scope === "city") {
      params.set("country", selectedCountry);
    }
    if (scope === "state" || scope === "city") {
      params.set("state", selectedState);
    }
    if (scope === "city") {
      params.set("city", selectedCity);
    }
    if (deferredSearch.trim()) {
      params.set("search", deferredSearch.trim());
    }

    fetch(`${API_BASE}/api/leaderboard?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          setEntries(data.leaderboard);
        }
      })
      .catch((err) => console.error("Leaderboard fetch error:", err))
      .finally(() => setLoading(false));
  }, [scope, selectedCountry, selectedState, selectedCity, deferredSearch]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const stateList = getStatesForCountry(selectedCountry);
  const cityList = getCitiesForState(selectedState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs">
      <div className="notebook relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-sm bg-card p-4 sm:p-6 md:p-8 space-y-3.5 shadow-2xl">
        <div className="tape absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 rotate-[1deg]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/trophy-gold.png"
              alt="Trophy"
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm"
            />
            <div>
              <span className="text-xs font-bold text-accent uppercase font-hand">Hall of Fame</span>
              <h2 className="text-2xl sm:text-3xl font-display text-foreground leading-none">
                Classroom Rankings
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-secondary text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="relative shrink-0 font-hand">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search detective name or @username..."
            className="sketch w-full bg-white pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground font-bold p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scope Selector Tabs: Global | Country | State | City */}
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-white/70 p-1 rounded border border-foreground/30 shrink-0 font-hand">
          <button
            type="button"
            onClick={() => setScope("global")}
            className={`sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${
              scope === "global"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-transparent text-foreground hover:bg-secondary"
            }`}
          >
            <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Global 🌍</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("country")}
            className={`sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${
              scope === "country"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-transparent text-foreground hover:bg-secondary"
            }`}
          >
            <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Country 🇮🇳</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("state")}
            className={`sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${
              scope === "state"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-transparent text-foreground hover:bg-secondary"
            }`}
          >
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>State 🏛️</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("city")}
            className={`sketch flex items-center justify-center gap-1 py-1.5 px-1.5 text-[11px] sm:text-xs font-bold transition-all ${
              scope === "city"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "bg-transparent text-foreground hover:bg-secondary"
            }`}
          >
            <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>City 🏙️</span>
          </button>
        </div>

        {/* Filter Dropdowns for Country, State & City */}
        {scope !== "global" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 font-hand bg-white/50 p-2 rounded border border-foreground/20">
            <div>
              <label className="text-[10px] font-bold text-foreground block mb-0.5">Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  setSelectedCountry(newCountry);
                  const states = getStatesForCountry(newCountry);
                  if (states && states.length > 0 && states[0]) {
                    setSelectedState(states[0]);
                    const cities = getCitiesForState(states[0]);
                    if (cities && cities.length > 0 && cities[0]) {
                      setSelectedCity(cities[0]);
                    }
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

            {(scope === "state" || scope === "city") && (
              <div>
                <label className="text-[10px] font-bold text-foreground block mb-0.5">State / Region:</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedState(newState);
                    const cities = getCitiesForState(newState);
                    if (cities && cities.length > 0 && cities[0]) {
                      setSelectedCity(cities[0]);
                    }
                  }}
                  className="sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                  {stateList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scope === "city" && (
              <div>
                <label className="text-[10px] font-bold text-foreground block mb-0.5">City 🏙️:</label>
                <input
                  type="text"
                  list="leaderboard-city-suggestions"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="sketch w-full bg-white px-2 py-1 text-xs text-foreground focus:outline-none"
                  placeholder="e.g. Mumbai"
                />
                <datalist id="leaderboard-city-suggestions">
                  {cityList.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            )}
          </div>
        )}

        {/* Rankings List */}
        <div className="space-y-2 flex-1 overflow-y-auto font-hand pr-1">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Checking classroom rankings... 📜</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground space-y-1">
              <div className="text-2xl">🏆</div>
              <div className="font-bold">
                {deferredSearch ? `No detectives found matching "${deferredSearch}"` : "No completed matches recorded yet!"}
              </div>
              <div className="text-xs">
                {deferredSearch
                  ? "Try checking the spelling or searching another name/handle."
                  : "Play a match and be the #1 ranked detective here!"}
              </div>
            </div>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={entry._id}
                className="sketch flex items-center justify-between p-2.5 sm:p-3 bg-white/80 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold shadow-xs ${
                      idx === 0
                        ? "bg-yellow-400 text-yellow-950 font-display ring-2 ring-yellow-500"
                        : idx === 1
                        ? "bg-slate-300 text-slate-800 font-display ring-1 ring-slate-400"
                        : idx === 2
                        ? "bg-amber-600 text-white font-display ring-1 ring-amber-700"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-foreground truncate">
                        {entry.displayName}
                      </span>
                      {entry.username && (
                        <span className="text-[10px] font-mono font-bold bg-accent/20 text-accent-foreground px-1.5 py-0.2 rounded-full border border-foreground/15">
                          @{entry.username}
                        </span>
                      )}
                      {!entry.isGuest ? (
                        <span className="text-[10px] font-mono font-bold bg-primary/15 text-primary px-1.5 py-0.2 rounded-full border border-primary/20">
                          Verified 🎓
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold bg-secondary text-muted-foreground px-1.5 py-0.2 rounded-full border border-foreground/15">
                          Guest 👤
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                      {entry.matchesPlayed === 0 ? (
                        <span className="text-primary font-semibold">New Detective 🌟</span>
                      ) : (
                        <>
                          <span>{entry.matchesPlayed} matches</span>
                          <span>•</span>
                          <span>{entry.winRate}% win rate</span>
                        </>
                      )}
                      {(entry.city || entry.state || entry.country) && (
                        <>
                          <span>•</span>
                          <span className="text-accent font-semibold truncate max-w-[150px]">
                            📍 {entry.city ? `${entry.city}, ` : ""}
                            {entry.state ? `${entry.state}, ` : ""}
                            {entry.country || "India"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="font-display text-lg sm:text-xl font-bold text-accent">
                    {entry.wins} {entry.wins === 1 ? "Win" : "Wins"}
                  </div>
                  {Boolean(entry.imposterWins) && (
                    <div className="text-[10px] text-muted-foreground font-sans">
                      🕵️ {entry.imposterWins} Imposter
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t-2 border-foreground/30 shrink-0">
          <button
            onClick={onClose}
            className="sketch w-full bg-secondary py-2 text-sm sm:text-base font-bold text-foreground hover:bg-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
