import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE } from "../lib/api";

export type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "error";

export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    return { valid: false, error: "Username cannot be empty." };
  }
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
    return { valid: false, error: "Username cannot start or end with a dot (.) or underscore (_)." };
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

export function useUsernameCheck(initialUsername = "", currentUserId = "") {
  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync initial username when changed
  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
      setStatus("available");
      setMessage("Your current username");
    }
  }, [initialUsername]);

  const checkAvailability = useCallback(
    (uname: string) => {
      const normalized = uname.trim().toLowerCase();

      // Step 1: Detect empty
      if (!normalized) {
        setStatus("idle");
        setMessage("");
        return;
      }

      // Step 2: Instant Client-Side Format Validation
      const formatCheck = validateUsernameFormat(normalized);
      if (!formatCheck.valid) {
        setStatus("invalid");
        setMessage(formatCheck.error || "Invalid username format");
        return;
      }

      // If user is just keeping their current username
      if (initialUsername && normalized === initialUsername.trim().toLowerCase()) {
        setStatus("available");
        setMessage("Your current username");
        return;
      }

      // Step 3: Set checking status
      setStatus("checking");
      setMessage("Checking availability...");

      // Step 4: 300ms Debounce + AbortController to avoid race conditions
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const params = new URLSearchParams({
            username: normalized,
            currentUserId: currentUserId || "",
          });
          const res = await fetch(`${API_BASE}/api/username/check?${params.toString()}`, {
            signal: controller.signal,
          });

          if (!res.ok) {
            throw new Error("Server error");
          }

          const data = await res.json();
          if (data.invalidFormat) {
            setStatus("invalid");
            setMessage(data.message || "Invalid format");
          } else if (data.available) {
            setStatus("available");
            setMessage(data.message || "Username is available!");
          } else {
            setStatus("taken");
            setMessage(data.message || "Username is already taken");
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            // Superseded by newer request, do nothing
            return;
          }
          setStatus("error");
          setMessage("Could not check availability. Click to retry.");
        }
      }, 300);
    },
    [initialUsername, currentUserId]
  );

  const handleUsernameChange = (newVal: string) => {
    // Automatically sanitize spaces and uppercase
    const cleaned = newVal.toLowerCase().replace(/\s+/g, "");
    setUsername(cleaned);
    checkAvailability(cleaned);
  };

  const retry = () => {
    checkAvailability(username);
  };

  return {
    username,
    setUsername: handleUsernameChange,
    status,
    message,
    isValid: status === "available",
    isChecking: status === "checking",
    retry,
  };
}
