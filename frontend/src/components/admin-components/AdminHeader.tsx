import { Link } from "react-router";
import { UserButton } from "@clerk/clerk-react";
import { LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";

const AdminHeader = () => {
    return (
        <div className='flex items-center justify-between gap-2'>
            <div className='flex flex-row items-center gap-2 text-neutral-200'>
                <LayoutDashboard className="shrink-0 sm:size-7 size-5" />
                <h1 className='sm:text-3xl text-xl font-roboto font-semibold truncate'>Admin Dashboard</h1>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                    <Link to="/">Home</Link>
                </Button>
                <UserButton />
            </div>
        </div>
    );
};
export default AdminHeader;
