import { useState, useEffect, Suspense } from "react";
import { socket } from "./socket/socket.js";
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

      socket.emit("join_room", roomId);
      navigate("/call");
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
