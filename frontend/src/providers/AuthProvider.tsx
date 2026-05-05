import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react"
import { useShallow } from "zustand/react/shallow";
import logo from "../../public/icon.png";
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
        <div className="relative">
          <div
            className='absolute -inset-6 bg-conic from-indigo-500 via-emerald-500 to-yellow-500 rounded-full blur-md opacity-85 animate-spin -z-10'
            aria-hidden="true"
          />
          <img src={logo} alt="Logo of Groovity" className="size-24" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthProvider;