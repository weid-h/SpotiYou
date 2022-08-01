import { useMigratorStore } from "./state";
import React, { useEffect } from "react";
import { SpotifyAuth } from "./spotifyAuth";
import { SpotifyPlaylistSelector } from "./spotifyPlaylistSelector";
import { YoutubeAuth } from "./youtubeAuth";
import { MigrationScreen } from "./migrationScreen";

export const PlaylistMigrator = (): JSX.Element => {
  const state = useMigratorStore();

  if (!state.SpotifyAuth.Authenticated) {
    return <SpotifyAuth />;
  }

  if (!state.SpotifyPlaylistsSelected) {
    return <SpotifyPlaylistSelector />;
  }

  if (
    state.SpotifyAuth.Authenticated &&
    state.SpotifyPlaylistsSelected &&
    !state.YoutubeAuth.Authenticated
  ) {
    return <YoutubeAuth />;
  }

  return <MigrationScreen />;
};
