import axios from "axios";

export const createPlaylist = async (token: string, name: string) => {
  const response = await axios.post(
    "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
    {
      kind: "youtube#playlist",
      snippet: {
        title: name,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data as {
    kind: string;
    id: string;
    snippet: {
      title: string;
    };
  };
};

type searchResponse = {
  items: {
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      title: string;
    };
  }[];
};

export const QuerySong = async (
  token: string,
  title: string,
  artists: string[]
) => {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");

  url.searchParams.append("part", "snippet");
  url.searchParams.append("q", `${title} ${artists.join(" ")}`);

  const response = await axios.get(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = response.data as searchResponse;

  if (result.items.length == 0) return undefined;

  return result.items[0];
};

export const updatePlaylist = async (
  token: string,
  tracks: { name: string; artists: { name: string }[] }[],
  playlistId: string
) => {
  for (const track of tracks) {
    const queryResult = await QuerySong(
      token,
      track.name,
      track.artists.map((artist) => artist.name)
    );

    console.log("Query result ", queryResult);

    if (queryResult) {
      await axios.post(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
        {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: queryResult.id.kind,
              videoId: queryResult.id.videoId,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  }
};
