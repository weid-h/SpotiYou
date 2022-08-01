import { getPlaylists } from "./spotifyApi";
import { useMigratorStore } from "./state";
import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
  Button,
  Paper,
  Divider,
} from "@mui/material";

export const SpotifyPlaylistSelector = () => {
  const state = useMigratorStore();
  const [playlists, setPlaylists] = useState<
    {
      id: string;
      name: string;
      checked: boolean;
      tracks: { href: string; total: number };
    }[]
  >([]);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCount = playlists.filter((p) => p.checked).length;

  useEffect(() => {
    if (!fetched && !loading) {
      setLoading(true);
      getPlaylists(state.SpotifyAuth.Token).then((data) => {
        setFetched(true);
        setLoading(false);
        setPlaylists(data.map((item) => ({ ...item, checked: false })));
      });
    }
  }, [fetched, loading, playlists, state.SpotifyAuth.Token]);

  const onMigrate = () => {
    state.SetSpotifyPlaylists(
      playlists
        .filter((p) => p.checked)
        .map((p) => ({ id: p.id, name: p.name, tracksLink: p.tracks.href }))
    );
  };

  if (!fetched)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Typography variant={"h1"} sx={{ mb: 3 }}>
          Step 2
        </Typography>
        <Typography variant={"body1"} sx={{ mb: 3 }}>
          Select playlists to migrate
        </Typography>
        <List sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          {playlists.map((list) => (
            <ListItem key={list.id}>
              <ListItemText
                primary={list.name}
                secondary={`${list.tracks.total} tracks`}
              />
              <Checkbox
                checked={list.checked}
                inputProps={{ "aria-label": "controlled" }}
                onChange={() => {
                  setPlaylists(
                    playlists.map((p) => {
                      if (p.id == list.id) {
                        p.checked = !list.checked;
                      }
                      return p;
                    })
                  );
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 3 }} />
        <Typography
          sx={{ py: 3 }}
          variant={"h3"}
        >{`Migrate ${selectedCount} playlists?`}</Typography>
        <Button variant={"contained"} onClick={onMigrate}>
          Migrate
        </Button>
      </Paper>
    </Box>
  );
};
