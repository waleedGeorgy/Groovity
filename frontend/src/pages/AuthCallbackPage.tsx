import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";

const AuthCallbackPage = () => {
    const { isLoaded, user } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        const signupUser = async () => {
            if (!isLoaded || !user) return;
            try {
                await axiosInstance.post("/auth/callback", {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl
                });
                void navigate("/");
            } catch (error) {
                console.error("Auth callback failed:", error);
                void navigate("/");
            }
        }

        void signupUser();
    }, [isLoaded, navigate, user]);

    return (
        <div className="h-screen flex items-center justify-center">
            <Card className="max-w-2xl">
                <CardContent className="space-y-2 flex flex-col justify-center items-center">
                    <Loader2 className="size-12 text-indigo-500 animate-spin mb-4" />
                    <h2 className="text-3xl font-bold">Welcome! You are being logged in.</h2>
                    <p className="text-md animate-pulse">Redirecting to home page...</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default AuthCallbackPage;