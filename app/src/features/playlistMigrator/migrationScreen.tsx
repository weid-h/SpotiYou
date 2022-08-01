import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { MigratorState, useMigratorStore } from "./state";
import { useEffect } from "react";
import { getTracks } from "./spotifyApi";
import { createPlaylist, updatePlaylist } from "./youtubeApi";

export const MigrationScreen = () => {
  const state = useMigratorStore();

  useEffect(() => {
    migrate(state).then(() => {
      console.log("migration complete");
    });
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant={"h1"} sx={{ mb: 3 }}>
            Migrating playlists
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Paper>
    </Box>
  );
};

const migrate = async (state: MigratorState) => {
  for (const playlist of state.SpotifyPlaylists) {
    const tracks = await getTracks(
      state.SpotifyAuth.Token,
      playlist.tracksLink
    );

    console.log("Got tracks: ", tracks);

    const newPlaylist = await createPlaylist(
      state.YoutubeAuth.Token,
      playlist.name
    );

    await updatePlaylist(state.YoutubeAuth.Token, tracks, newPlaylist.id);
  }

  state.ClearState();
};
