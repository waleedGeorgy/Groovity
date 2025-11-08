import { Link } from "react-router"
import { MessageCircle, HomeIcon } from "lucide-react"
import { SignedIn } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

const RightNavbar = () => {
    return (
        <div className="flex flex-1 flex-col justify-center p-2 bg-card rounded-lg border">
            <Link viewTransition to="/" className={cn(buttonVariants({ variant: "secondary", className: "w-full flex flex-row items-center justify-center md:justify-start gap-2 bg-card hover:bg-indigo-900 transition-colors duration-300" }))}><HomeIcon className="size-5" /><span className="hidden md:inline">Home</span></Link>
            <SignedIn>
                <Link viewTransition to="/chat" className={cn(buttonVariants({ variant: "secondary", className: "w-full flex flex-row items-center justify-center md:justify-start gap-2 bg-card hover:bg-indigo-900 transition-colors duration-300" }))}><MessageCircle className="size-5" /><span className="hidden md:inline">Chat</span></Link>
            </SignedIn>

        </div>
    )
}

export default RightNavbar