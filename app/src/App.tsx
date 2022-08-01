import React from "react";
import { Layout } from "./features/layout";
import { PlaylistMigrator } from "./features/playlistMigrator";

function App() {
  return (
    <div className="App">
      <Layout>
        <PlaylistMigrator />
      </Layout>
    </div>
  );
}

export default App;
