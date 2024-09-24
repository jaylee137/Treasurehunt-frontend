import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import GoogleLogo from "../components/GoogleLogo";
import Footer2 from "../layouts/Footer2";

function LoginPage() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <div className="bg-[url('img/beige.png')] bg-100 bg-no-repeat flex flex-col items-center justify-center 
                     w-screen px-10 h-[100dvh] relative">
      <div>
        <h1 className="text-xl text-center font-bold mb-2">Welcome to The Treasure Hunt</h1>
        <p className="text-md text-center mb-8">
          Sign in with your Google account to continue
        </p>
        <a
          href={redirectUrl.toString()}
          className="flex justify-center items-center border rounded-lg px-3 py-1 bg-yellow-100 hover:bg-gray-300 hover:shadow-sm active:bg-gray-200 active:scale-95 transition-all"
        >
          <GoogleLogo />
          Sign in with Google
        </a>
      </div>
      <div className= " w-full absolute bottom-10">
      <Footer2/>
      </div>
    </div>
  );
}

export default LoginPage;