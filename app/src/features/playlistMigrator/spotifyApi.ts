import axios from "axios";

type playlistResponse = {
  items: {
    name: string;
    id: string;
    tracks: { href: "string"; total: number };
  }[];
  limit: number;
  offset: number;
  total: number;
  next: string | null;
};

export const getPlaylists = async (token: string) => {
  const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });

  let playlists: {
    id: string;
    name: string;
    tracks: { href: "string"; total: number };
  }[] = [];

  let data = response.data as playlistResponse;

  playlists = playlists.concat(data.items);

  while (data.next) {
    const response = await axios.get(data.next, {
      headers: { Authorization: `Bearer ${token}` },
    });

    data = response.data as playlistResponse;

    playlists = playlists.concat(data.items);
  }

  return playlists;
};

type tracksResponse = {
  items: {
    track: {
      name: string;
      artists: { name: string }[];
    };
  }[];
  limit: number;
  offset: number;
  total: number;
  next: string | null;
};

export const getTracks = async (token: string, tracksLink: string) => {
  const response = await axios.get(tracksLink, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let tracks: {
    track: {
      name: string;
      artists: { name: string }[];
    };
  }[] = [];

  let data = response.data as tracksResponse;

  console.log("Track data ", data);

  tracks = tracks.concat(data.items);

  while (data.next) {
    const response = await axios.get(data.next, {
      headers: { Authorization: `Bearer ${token}` },
    });

    data = response.data as tracksResponse;

    tracks = tracks.concat(data.items);
  }

  return tracks.map((track) => track.track);
};
