import { useState } from "react";
import VideoCall from "./components/VideoCall";

function App() {
  const [room, setRoom] = useState("");
  const [join, setJoin] = useState(false);

  return (
    <div>
      {!join ? (
        <>
          <input
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => setJoin(true)}>Join</button>
        </>
      ) : (
        <VideoCall roomId={room} />
      )}
    </div>
  );
}

export default App;
