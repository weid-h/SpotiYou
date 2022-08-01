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

export const YoutubeAuth = () => {
  const store = useMigratorStore();
  useEffect(() => {
    if (!window.location.href.toLowerCase().includes("youtube")) return;

    const params = new URLSearchParams(window.location.hash);

    const token = params.get("access_token");

    window.history.pushState("", "", "/");

    if (!token) return;

    store.AuthenticateYoutube(token);
  }, []);

  const authenticate = () => {
    const challenge = pkceChallenge(128);
    store.SetYoutubeVerifier(challenge.code_verifier);
    window.location.href = buildRedirectUri(challenge.code_challenge);
  };

  if (window.location.href.toLowerCase().includes("youtube"))
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 5 }}>
        <Typography variant={"h1"} sx={{ mb: 3 }}>
          Step 3
        </Typography>
        <Typography variant={"body1"} sx={{ mb: 3 }}>
          Authenticate with youtube to create playlists from spotify
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant={"contained"} onClick={authenticate}>
            Log in with Youtube
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const buildRedirectUri = (challenge: string) => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.append("response_type", "token");
  url.searchParams.append(
    "client_id",
    String(process.env.REACT_APP_YOUTUBE_CLIENT_ID)
  );
  url.searchParams.append("scope", "https://www.googleapis.com/auth/youtube");
  url.searchParams.append("include_granted_scopes", "true");
  url.searchParams.append(
    "redirect_uri",
    String(process.env.REACT_APP_YOUTUBE_CALLBACK_URL)
  );
  url.searchParams.append("state", "state");

  return url.toString();
};
