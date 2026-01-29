import { useState, useEffect, Suspense } from "react";
import { socket } from "./socket/socket.js";
import useRoomStore from "./store/roomStore.js";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsConnected } from "./contexts/isConnectedContext.jsx";
import { useIsOpenMessage } from "./contexts/isOpenMessageContext.jsx";

function App() {
  const { setRoomId, setPeer, matchCycle } = useRoomStore();
  const navigate = useNavigate();
  const { isConnected, setIsConnected } = useIsConnected()
  const { isOpenMessage, setIsOpenMessage } = useIsOpenMessage()

  useEffect(() => {
    const onMatchFound = async (payload) => {
      setIsOpenMessage((v) => ({...v, isOn: true, onClickIsOn: true }));
      const roomId = payload?.roomId;
      setRoomId(roomId);
      const peer = payload?.peer;
      setPeer(peer);
      if (!roomId) return;

      setIsConnected(false);
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, [matchCycle, setIsConnected, setIsOpenMessage, setRoomId, setPeer]);

  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
