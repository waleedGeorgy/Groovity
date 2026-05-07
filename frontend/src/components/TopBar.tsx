import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import { Button } from "./ui/button";
import logo from "@/assets/icon.png";

const TopBar = () => {
    const { isAdmin } = useAuthStore(useShallow(state => ({ isAdmin: state.isAdmin })));

    return (
        <nav className="flex flex-row flex-wrap gap-3 items-center justify-between sticky top-0 backdrop-blur-lg z-10 bg-card py-3 px-4 rounded-t-lg">
            <div className="flex items-center justify-center gap-2">
                <img src={logo} alt="Icon of groovity" className="size-8" />
                <h1 className="font-roboto font-bold text-2xl tracking-wide">Groovity</h1>
            </div>
            <div className="flex items-center justify-center gap-3">
                {isAdmin && (
                    <Button asChild variant="outline" size="sm">
                        <Link viewTransition to="/admin" className="flex items-center justify-center gap-2">
                            <LayoutDashboard className="size-4" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </Button>
                )}
                <SignedOut>
                    <SignInWithGoogleButton />
                </SignedOut>
                <UserButton />
            </div>
        </nav>
    )
}

export default TopBar