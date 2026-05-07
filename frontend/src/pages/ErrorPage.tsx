import { Button } from "@/components/ui/button";
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    const getErrorMessage = () => {
        if (isRouteErrorResponse(error)) {
            switch (error.status) {
                case 404:
                    return "Page not found";
                case 401:
                    return "Unauthorized access";
                case 403:
                    return "Forbidden";
                case 500:
                    return "Server error";
                default:
                    return error.statusText;
            }
        }
        if (error instanceof Error) {
            return error.message;
        }
        return "An unknown error occurred";
    };

    const getErrorStatus = () => {
        if (isRouteErrorResponse(error)) {
            return error.status;
        }
        return "Unknown";
    };

    return (
        <div className="min-h-screen p-5 flex flex-col items-center justify-center gap-4 font-inter text-center">
            <h1 className="text-2xl sm:text-5xl font-roboto">
                Oops! Something went wrong
            </h1>
            <p className="text-lg sm:text-2xl italic">
                {getErrorStatus()} — {getErrorMessage()}
            </p>
            <div className="flex flex-row items-center gap-3 mt-2">
                <Button onClick={() => { void navigate(-1) }} variant="outline" className="cursor-pointer">
                    Return
                </Button>
                <Button variant="secondary" className="cursor-pointer">
                    <Link to="/" className="link link-primary">
                        Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
