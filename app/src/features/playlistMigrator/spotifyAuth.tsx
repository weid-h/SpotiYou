import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import pkceChallenge from "pkce-challenge";
import { useMigratorStore } from "./state";
import axios from "axios";

export const SpotifyAuth = () => {
  const store = useMigratorStore();
  useEffect(() => {
    if (!window.location.href.toLowerCase().includes("spotify")) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    window.history.pushState("", "", "/");

    if (!code) return;

    exchangeCodeForToken(code, store.SpotifyAuth.Verifier).then((data) => {
      store.AuthenticateSpotify(data.access_token);
    });
  }, []);

  const authenticate = () => {
    const challenge = pkceChallenge(128);
    store.SetSpotifyVerifier(challenge.code_verifier);
    window.location.href = buildRedirectUri(challenge.code_challenge);
  };

  if (window.location.href.toLowerCase().includes("spotify"))
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 5 }}>
        <Typography variant={"h1"} sx={{ mb: 3 }}>
          Step 1
        </Typography>
        <Typography variant={"body1"} sx={{ mb: 3 }}>
          Authenticate with Spotify to fetch playlists to migrate
        </Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button variant={"contained"} onClick={authenticate}>
            Authenticate
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const buildRedirectUri = (challenge: string) => {
  const url = new URL("https://accounts.spotify.com/authorize");

  url.searchParams.append("response_type", "code");
  url.searchParams.append(
    "client_id",
    String(process.env.REACT_APP_SPOTIFY_CLIENT_ID)
  );
  url.searchParams.append("scope", "playlist-read-private");
  url.searchParams.append(
    "redirect_uri",
    String(process.env.REACT_APP_SPOTIFY_CALLBACK_URL)
  );
  url.searchParams.append("state", "state");
  url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("code_challenge", challenge);

  return url.toString();
};
const exchangeCodeForToken = async (code: string, code_verifier: string) => {
  const params = new URLSearchParams();

  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append(
    "redirect_uri",
    String(process.env.REACT_APP_SPOTIFY_CALLBACK_URL)
  );
  params.append("client_id", String(process.env.REACT_APP_SPOTIFY_CLIENT_ID));
  params.append("code_verifier", code_verifier);

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    params
  );

  return response.data as {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  };
};
