import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react"
import { useShallow } from "zustand/react/shallow";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const addRequestHeader = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete axiosInstance.defaults.headers.common.Authorization;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { checkAdmin } = useAuthStore(useShallow(state => ({ checkAdmin: state.checkAdmin })));
  const { connectSocket, disconnectSocket } = useChatStore(useShallow(state => ({
    connectSocket: state.connectSocket,
    disconnectSocket: state.disconnectSocket
  })));
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const initAuth = async () => {
      if (!isSignedIn) {
        addRequestHeader(null);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const token = await getToken();
        if (token) {
          addRequestHeader(token);
          await checkAdmin();
          if (userId) connectSocket(userId);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        addRequestHeader(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    void initAuth();

    return () => disconnectSocket();
  }, [getToken, checkAdmin, isLoaded, isSignedIn, userId, connectSocket, disconnectSocket]);

  if (!isLoaded || isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="size-16 text-indigo-500 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthProvider;