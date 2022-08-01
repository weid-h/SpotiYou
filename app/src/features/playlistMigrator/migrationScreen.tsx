import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useMigratorStore } from "./state";
import { useEffect } from "react";

export const MigrationScreen = () => {
  const state = useMigratorStore();

  useEffect(() => {}, []);

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
