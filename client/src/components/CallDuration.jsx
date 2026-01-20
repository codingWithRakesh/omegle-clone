import React, { useEffect, useRef, useState } from "react";

const CallDuration = ({ peer }) => {
  const [duration, setDuration] = useState("00:00");

  const startRef = useRef(null);
  const timerRef = useRef(null);

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;

    if (hh > 0) {
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (timerRef.current) return;
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setDuration(formatDuration(Date.now() - startRef.current));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startRef.current = null;
    setDuration("00:00");
  };

  useEffect(() => {
    if (!peer) return;

    const onStateChange = () => {
      const state = peer.connectionState;

      if (state === "connected") startTimer();
      if (state === "disconnected" || state === "failed" || state === "closed") stopTimer();
    };

    peer.addEventListener("connectionstatechange", onStateChange);

    onStateChange();

    return () => {
      peer.removeEventListener("connectionstatechange", onStateChange);
      stopTimer();
    };
  }, [peer]);

  return (
    <div className="bg-gray-200 px-4 py-2 rounded-2xl">
      Call Duration: {duration}
    </div>
  );
};

export default CallDuration;
