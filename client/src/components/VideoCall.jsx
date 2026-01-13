import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket.js";

const pcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoCall = ({ roomId }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const peer = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [inCall, setInCall] = useState(true);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      // 1) local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!mounted) return;

      localStream.current = stream;
      localVideo.current.srcObject = stream;

      // 2) peer
      peer.current = new RTCPeerConnection(pcConfig);

      // add tracks
      stream.getTracks().forEach((t) => peer.current.addTrack(t, stream));

      // remote tracks
      peer.current.ontrack = (e) => {
        const [stream] = e.streams;
        remoteStream.current = stream;
        remoteVideo.current.srcObject = stream;
      };

      // ICE
      peer.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice_candidate", { roomId, candidate: e.candidate });
        }
      };

      // 3) join after peer ready
      socket.emit("join_room", roomId);
    };

    start();

    // --- signaling listeners ---
    socket.on("user_joined", async () => {
      if (!peer.current) return;

      const offer = await peer.current.createOffer();
      await peer.current.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async ({ from, offer } = {}) => {
      if (!peer.current || !offer) return;

      await peer.current.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.current.createAnswer();
      await peer.current.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ from, answer } = {}) => {
      if (!peer.current || !answer) return;
      await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice_candidate", async ({ from, candidate } = {}) => {
      if (!peer.current || !candidate) return;
      try {
        await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.log("ICE add error", err);
      }
    });

    return () => {
      mounted = false;
      socket.off("user_joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
    };
  }, [roomId]);

  // ✅ Toggle Mic
  const toggleMic = () => {
    const stream = localStream.current;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  // ✅ Toggle Camera
  const toggleCamera = () => {
    const stream = localStream.current;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    });
  };

  // ✅ Toggle Speaker (remote audio)
  const toggleSpeaker = () => {
    if (!remoteVideo.current) return;
    remoteVideo.current.muted = !remoteVideo.current.muted;
    setSpeakerOn(!remoteVideo.current.muted);
  };

  // ✅ End Call
  const endCall = () => {
    // close peer
    if (peer.current) {
      peer.current.ontrack = null;
      peer.current.onicecandidate = null;
      peer.current.close();
      peer.current = null;
    }

    // stop local tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
    }

    // stop remote tracks (optional)
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((t) => t.stop());
      remoteStream.current = null;
    }

    // clear video elements
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;

    setInCall(false);
  };

  if (!inCall) {
    return <h2>Call Ended</h2>;
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <p>Local</p>
          <video ref={localVideo} autoPlay muted playsInline width="320" />
        </div>

        <div>
          <p>Remote</p>
          <video ref={remoteVideo} autoPlay playsInline width="320" />
        </div>
      </div>

      {/* ✅ Controls */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={toggleMic}>
          {micOn ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button onClick={toggleCamera}>
          {camOn ? "Camera Off" : "Camera On"}
        </button>

        <button onClick={toggleSpeaker}>
          {speakerOn ? "Speaker Off" : "Speaker On"}
        </button>

        <button onClick={endCall} style={{ background: "red", color: "white" }}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
