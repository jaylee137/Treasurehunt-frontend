import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";

function CallbackPage() {
  const isLoading = useRef(false);
  const switchKeylessAccount = useKeylessAccounts((state) => state.switchKeylessAccount);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading.current) return;
    isLoading.current = true;

    const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = fragmentParams.get("id_token");
    
    console.log("Retrieved ID Token:", idToken); // Log the token for debugging

    async function deriveAccount(idToken: string) {
      try {
        await switchKeylessAccount(idToken);
        navigate("/home");
      } catch (error) {
        console.error("Failed to switch account:", error); // Log error for debugging
        navigate("/");
      }
    }

    if (!idToken) {
      console.error("No ID token found in the URL fragment.");
      navigate("/");
      return;
    }

    deriveAccount(idToken);
  }, [navigate, switchKeylessAccount]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border bg-gray-100 rounded-lg px-5 py-1 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Please wait...
      </div>
    </div>
  );
}

export default CallbackPage;
