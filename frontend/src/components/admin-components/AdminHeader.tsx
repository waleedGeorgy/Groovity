import { Link } from "react-router";
import { UserButton } from "@clerk/clerk-react";
import { LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";

const AdminHeader = () => {
    return (
        <div className='flex items-center flex-wrap justify-between gap-2'>
            <div className='flex flex-row items-center gap-2 text-neutral-200'>
                <LayoutDashboard className="shrink-0 size-7" />
                <h1 className='text-3xl font-roboto font-semibold truncate'>Admin Dashboard</h1>
            </div>
            <div className="flex flex-row items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link to="/">Home</Link>
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
