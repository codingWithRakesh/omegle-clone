import { useState, useEffect, Suspense } from "react";
import { socket } from "./socket/socket.js";
import useRoomStore from "./store/roomStore.js";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsConnected } from "./contexts/isConnectedContext.jsx";
import { useIsOpenMessage } from "./contexts/isOpenMessageContext.jsx";
import Loading from "./components/Loading.jsx";
import useWakeUpStore from "./store/wakeUpStore.js";
import Error from "./pages/Error.jsx";

function App() {
  const { setRoomId, setPeer, matchCycle } = useRoomStore();
  const { setIsConnected } = useIsConnected()
  const { setIsOpenMessage } = useIsOpenMessage()

  const {
    socket : socketState,
    main,
    mainServerWakeUp,
    socketServerWakeUp,
  } = useWakeUpStore();

  useEffect(() => {
    const onMatchFound = async (payload) => {
      setIsOpenMessage((v) => ({ ...v, isOn: true, onClickIsOn: true }));
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

  useEffect(() => {
    const wakeUpServers = async () => {
      try {
        await Promise.allSettled([
          mainServerWakeUp(),
          socketServerWakeUp()
        ]);
      } catch (error) {
        console.error("Error waking up servers:", error);
      }
    };

    wakeUpServers();
  }, [])

  if (socketState.isLoading || main.isLoading) {
    return <Loading />;
  }

  if (socketState.error || main.error) {
    return <Error />;
  }

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
