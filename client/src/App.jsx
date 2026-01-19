import { useState, useEffect, Suspense } from "react";
import VideoCall from "./components/VideoCall";
import { socket } from "./socket/socket.js";
import TakeData from "./components/TakeData.jsx";
import useRoomStore from "./store/roomStore.js";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const { setRoomId, setPeer, matchCycle } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onMatchFound = (payload) => {
      console.log("match_found payload:", payload);

      const roomId = payload?.roomId;
      setRoomId(roomId);
      const peer = payload?.peer;
      console.log("Extracted peer:", peer);
      setPeer(peer);
      console.log("Extracted roomId:", roomId);
      if (!roomId) return;

      navigate("/call");
      socket.emit("join_room", roomId);
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, [matchCycle]);

  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
