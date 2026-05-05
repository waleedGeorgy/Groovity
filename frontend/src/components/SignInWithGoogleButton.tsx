import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";
import googleLogo from "../../public/google-icon.png";

const SignInWithGoogleButton = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const signInWithGoogle = async () => {
    await signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback"
    })
  }

  return (
    <Button
      onClick={() => void signInWithGoogle()}
      variant="secondary"
      className="w-full cursor-pointer border"
      size="sm"
      disabled={!isLoaded}
    >
      <img src={googleLogo} alt="Logo of google" className="size-4" />Continue with Google
    </Button>
  )
}

export default SignInWithGoogleButton