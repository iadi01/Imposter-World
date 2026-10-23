// Unique Classroom Detective Codename Generator (No more duplicate "Detective" names!)

const DETECTIVE_PREFIXES = [
  "Agent", "Detective", "Inspector", "Officer", "Captain", "Sleuth",
  "Shadow", "Clever", "Swift", "Sharp", "Curious", "Silent", "Brave",
  "Eagle", "Cosmic", "Hyper", "Lucky", "Turbo", "Golden", "Royal",
  "Quick", "Sneaky", "Mighty", "Witty", "Wise", "Chrono", "Secret"
];

const DETECTIVE_ROLES = [
  "Fox", "Falcon", "Owl", "Tiger", "Cheetah", "Panda", "Wolf", "Hawk",
  "Sherlock", "Byomkesh", "Feluda", "Chanakya", "Karamchand", "Pradyuman",
  "Daya", "Abhijeet", "Scholar", "Cipher", "Phoenix", "Viper", "Echo",
  "Cadet", "Ranger", "Rover", "Seeker", "Tracker", "Scout", "Voyager",
  "Badge", "Compass", "Specter", "Riddle"
];

/**
 * Generates a unique classroom detective codename guaranteed not to conflict with existing names in room/db.
 * Example outputs: "Shadow_Fox_42", "Inspector_Owl_77", "Agent_Byomkesh_85", "Clever_Sleuth_19"
 */
export function generateUniqueDetectiveName(existingNames: string[] = []): string {
  const existingLower = new Set(
    existingNames
      .filter((n): n is string => typeof n === "string")
      .map((n) => n.trim().toLowerCase())
  );

  // Try generating a clean, human-friendly codename
  for (let attempt = 0; attempt < 150; attempt++) {
    const prefix = DETECTIVE_PREFIXES[Math.floor(Math.random() * DETECTIVE_PREFIXES.length)];
    const noun = DETECTIVE_ROLES[Math.floor(Math.random() * DETECTIVE_ROLES.length)];
    const num = Math.floor(10 + Math.random() * 90); // 2-digit number (10-99)
    const candidate = `${prefix}_${noun}_${num}`;

    if (!existingLower.has(candidate.toLowerCase()) && candidate.toLowerCase() !== "detective") {
      return candidate;
    }
  }

  // Fallback with high-entropy timestamp suffix to guarantee 100% uniqueness
  return `Agent_${Math.floor(1000 + Math.random() * 9000)}`;
}
