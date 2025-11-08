// inside UserContext.jsx (where logout is defined)
import { useNavigate } from "react-router-dom";
// ... in component
const navigate = useNavigate();

const logout = async () => {
  try {
    // Try to sign out. This may throw if there is no active session.
    const { error } = await supabase.auth.signOut();
    if (error) {
      // The SDK can return an error object for known situations.
      // Ignore the 'AuthSessionMissingError' (no active session) and surface others.
      if (
        error.name === "AuthSessionMissingError" ||
        error.message?.includes("Auth session missing")
      ) {
        console.warn("No active session when signing out — ignoring.");
      } else {
        console.error("signOut error:", error);
      }
    }
  } catch (err) {
    // In case the SDK throws instead of returning an error object,
    // ignore AuthSessionMissingError and log other errors.
    if (
      err?.name === "AuthSessionMissingError" ||
      String(err).includes("Auth session missing")
    ) {
      console.warn("signOut threw AuthSessionMissingError — ignoring.");
    } else {
      console.error("Unexpected signOut error:", err);
    }
  } finally {
    // Always clear local user state and send user to auth page
    setUser(null);
    // optional: navigate to auth screen so UI is consistent
    try {
      navigate("/auth", { replace: true });
    } catch (e) {
      // navigate may not exist depending on where UserContext is used — ignore if so
      // (If you want, ensure UserProvider is inside BrowserRouter)
      console.warn("navigate unavailable (logout).");
    }
  }
};
