import { useState, useEffect, Suspense } from "react";
import { socket } from "./socket/socket.js";
import useRoomStore from "./store/roomStore.js";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsConnected } from "./contexts/isConnectedContext.jsx";

function App() {
  const { setRoomId, setPeer, matchCycle } = useRoomStore();
  const navigate = useNavigate();
  const { isConnected, setIsConnected } = useIsConnected()

  useEffect(() => {
    const onMatchFound = async (payload) => {
      // console.log("match_found payload:", payload);

      const roomId = payload?.roomId;
      setRoomId(roomId);
      const peer = payload?.peer;
      console.log("Extracted peer:", peer);
      setPeer(peer);
      console.log("Extracted roomId:", roomId);
      if (!roomId) return;

      await setIsConnected(false);
      console.log("Set isConnected to false");
      navigate("/call");
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, [matchCycle, setIsConnected]);

  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
