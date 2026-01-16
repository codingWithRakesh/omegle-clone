import { useState, useEffect } from "react";
import VideoCall from "./components/VideoCall";
import {socket} from "./socket/socket.js";

function App() {
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const onMatchFound = (payload) => {
      console.log("match_found payload:", payload);

      // your server sends: { roomId, userDetails1, userDetails2 }
      const rid = payload?.roomId;
      if (!rid) return;

      setRoomId(rid);

      socket.emit("join_room", rid);
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, []);

  return (
    <div>
      {!roomId ? (
        <div>
          <h2>Waiting for match...</h2>
          {/* Here you should call your REST API to enter queue */}
          {/* Example: POST /user/set -> logic server -> emits match_found */}
        </div>
      ) : (
        <VideoCall roomId={roomId} />
      )}
    </div>
  );
}

export default App;
