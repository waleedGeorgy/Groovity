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
          path: "/albums/:albumID",
          element: <AlbumPage />
        },
        {
          path: "/chat",
          element: <ChatPage />
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminPage />
    },
    {
      path: "/sso-callback",
      element: <AuthenticateWithRedirectCallback />
    },
    {
      path: "/auth-callback",
      element: <AuthCallbackPage />
    }
  ]);

  return (
    <main className="font-lato antialiased">
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={true} />
    </main>
  );
}

export default App
