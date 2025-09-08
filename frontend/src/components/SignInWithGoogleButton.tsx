import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";
import googleLogo from "@/assets/google-icon.png";

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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button onClick={signInWithGoogle} variant="secondary" className="w-full cursor-pointer border" size="sm">
      <img src={googleLogo} alt="Logo of google" className="size-4" /> Continue with Google
    </Button>
  )
}

export default SignInWithGoogleButton