import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const addRequestHeader = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete axiosInstance.defaults.headers.common.Authorization;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded, userId } = useAuth();

  const { checkAdmin } = useAuthStore();

  const { connectSocket, disconnectSocket } = useChatStore();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        addRequestHeader(token);

        if (token) {
          await checkAdmin();

          if (userId) connectSocket(userId);
        }

      } catch (error) {
        addRequestHeader(null);
        console.log(error)
      } finally {
        setIsCheckingAuth(false);
      }
    }
    if (isLoaded) void initAuth();

    return () => disconnectSocket();
  }, [getToken, checkAdmin, isLoaded, userId, connectSocket, disconnectSocket]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="size-16 text-indigo-500 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthProvider;