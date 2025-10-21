export function generateId() {
  // Prefer crypto.randomUUID if available (secure and unique)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  //Fallback: timestamp + random suffix
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}
