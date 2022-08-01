import create from "zustand";
import { devtools, persist } from "zustand/middleware";

type AuthState = {
  Authenticated: boolean;
  Token: string;
  Verifier: string;
};

export type MigratorState = {
  SpotifyAuth: AuthState;
  AuthenticateSpotify: (token: string) => void;
  SetSpotifyVerifier: (verifier: string) => void;
  SpotifyPlaylists: { name: string; id: string }[];
  SpotifyPlaylistsSelected: boolean;
  SetSpotifyPlaylists: (
    playlists: { name: string; id: string; tracksLink: string }[]
  ) => void;
  YoutubeAuth: AuthState;
  AuthenticateYoutube: (token: string) => void;
  SetYoutubeVerifier: (verifier: string) => void;
};

export const useMigratorStore = create<MigratorState>()(
  devtools(
    persist((set) => ({
      SpotifyAuth: {
        Authenticated: false,
        Token: "",
        Verifier: "",
      },
      AuthenticateSpotify: (token) =>
        set((state) => ({
          ...state,
          SpotifyAuth: { Authenticated: true, Token: token, Verifier: "" },
        })),
      SetSpotifyVerifier: (verifier) =>
        set((state) => ({
          ...state,
          SpotifyAuth: { ...state.SpotifyAuth, Verifier: verifier },
        })),
      SpotifyPlaylists: [],
      SpotifyPlaylistsSelected: false,
      SetSpotifyPlaylists: (playlists) =>
        set((state) => ({
          ...state,
          SpotifyPlaylists: playlists,
          SpotifyPlaylistsSelected: true,
        })),
      YoutubeAuth: {
        Authenticated: false,
        Token: "",
        Verifier: "",
      },
      AuthenticateYoutube: (token) =>
        set((state) => ({
          ...state,
          YoutubeAuth: { Authenticated: true, Token: token, Verifier: "" },
        })),
      SetYoutubeVerifier: (verifier) =>
        set((state) => ({
          ...state,
          YoutubeAuth: { ...state.YoutubeAuth, Verifier: verifier },
        })),
    }))
  )
);
