import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import MainLayout from "./Layouts/MainLayout";
import ChatPage from "./pages/ChatPage";
import AlbumPage from "./pages/AlbumPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  // todo: Improve responsiveness
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/chat",
          element: <ChatPage />
        },
        {
          path: "/albums/:albumID",
          element: <AlbumPage />
        },
      ]
    },
    {
      path: "/sso-callback",
      element: <AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />
    },
    {
      path: "/auth-callback",
      element: <AuthCallbackPage />
    },
    {
      path: "/admin",
      element: <AdminPage />
    },
  ]);

  return (
    <main className="font-lato">
      <Toaster position="bottom-right" reverseOrder={true} />
      <RouterProvider router={router} />
    </main>
  );
}

export default App
