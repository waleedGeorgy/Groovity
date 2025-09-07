import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";

const AdminHeader = () => {
    return (
        <div className='flex items-center flex-wrap justify-between gap-2'>
            <Link to='/' className='flex flex-row items-center gap-2 group'>
                <LayoutDashboard className="shrink-0 size-7 group-hover:text-neutral-200 transition-all duration-300" />
                <h1 className='text-3xl font-roboto font-bold truncate group-hover:text-neutral-200 transition-all duration-300'>Admin Dashboard</h1>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <Button variant="secondary" size="sm" asChild>
                    <Link to="/">Return home</Link>
                </Button>
                <UserButton appearance={{
                    elements: {
                        avatarBox: {
                            width: "2rem",
                            height: "2rem",
                        },
                    },
                }} />
            </div>
        </div>
    );
};
export default AdminHeader;
