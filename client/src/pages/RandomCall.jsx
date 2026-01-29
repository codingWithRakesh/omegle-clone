import { useEffect, useRef, useState } from 'react'
import { FaMessage } from "react-icons/fa6";
import { IoMdMic } from "react-icons/io";
import { MdCallEnd, MdMicOff } from "react-icons/md";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { BsCaretRightFill } from "react-icons/bs";
import VideoShow from '../components/VideoShow';
import MessageContainer from '../components/MessageContainer';
import { pcConfig } from '../constants/config.js';
import useRoomStore from '../store/roomStore.js';
import { socket } from '../socket/socket.js';
import CallDuration from '../components/CallDuration.jsx';
import { useNavigate } from 'react-router-dom';
import useLogicStore from '../store/logicStore.js';
import { useIsConnected } from '../contexts/isConnectedContext.jsx';
import useMessageStore from '../store/messageStore.js';
import { useTheme } from '../contexts/themeContext.jsx';
import { WiMoonAltFull } from "react-icons/wi";
import { WiMoonAltNew } from "react-icons/wi";
import { useIsOpenMessage } from '../contexts/isOpenMessageContext.jsx';

const RandomCall = () => {
    const { isOpenMessage, setIsOpenMessage } = useIsOpenMessage()
    const [peerObj, setPeerObj] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const clearMessages = useMessageStore((state) => state.clearMessages);

    const { isConnected, setIsConnected } = useIsConnected()
    const { theme, setTheme } = useTheme()

    const localVideo = useRef(null);
    const remoteVideo = useRef(null);

    const peer = useRef(null);
    const localStream = useRef(null);
    const remoteStream = useRef(null);

    const { userId, peer: peerDetails, roomId, bumpMatchCycle } = useRoomStore();
    const { fetchRoomList, endVideoCall:endCallAPI } = useLogicStore();
    const { setRoomId, setPeer } = useRoomStore();

    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        const start = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (!mounted) return;

            localStream.current = stream;
            localVideo.current.srcObject = stream;

            peer.current = new RTCPeerConnection(pcConfig);
            setPeerObj(peer.current);

            stream.getTracks().forEach((t) => peer.current.addTrack(t, stream));

            peer.current.ontrack = (e) => {
                const [stream] = e.streams;
                remoteStream.current = stream;
                remoteVideo.current.srcObject = stream;
            };

            peer.current.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("ice_candidate", { roomId, candidate: e.candidate });
                }
            };

            socket.emit("join_room", roomId);
        };

        start();

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
                console.error("ICE add error", err);
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

    const toogleCammera = () => {
        const stream = localStream.current;
        if (!stream) return;

        stream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setCamOn(track.enabled);
        });
    }

    const toggleMic = () => {
        const stream = localStream.current;
        if (!stream) return;

        stream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setMicOn(track.enabled);
        });
    }

    const endCall = async () => {
        if (peer.current) {
            peer.current.ontrack = null;
            peer.current.onicecandidate = null;
            peer.current.close();
            peer.current = null;
        }

        if (localStream.current) {
            localStream.current.getTracks().forEach((t) => t.stop());
            localStream.current = null;
        }

        if (remoteStream.current) {
            remoteStream.current.getTracks().forEach((t) => t.stop());
            remoteStream.current = null;
        }

        if (localVideo.current) localVideo.current.srcObject = null;
        if (remoteVideo.current) remoteVideo.current.srcObject = null;
    }

    const endVideoCall = async () => {
        await endCall();
        try {
            setPeer(null);
            setRoomId(null);
            await endCallAPI({ roomId, peerId: peerDetails?.id, userId, isEnd: true });
            setIsOpenMessage((v) => ({...v, isOn: false }));
            socket.emit("leave_room", userId);
            clearMessages();
        } catch (error) {
            console.error("Error ending call:", error);
        }
        await navigate('/');
    }

    const nextCall = async () => {
        try {
            setIsOpenMessage((v) => ({...v, isOn: false }));
            setIsConnected(true);
            await endCall();
            await fetchRoomList({ userId1: userId });
            await endCallAPI({ roomId, peerId: peerDetails?.id, userId, isEnd: false });
            setRoomId(null);
            clearMessages();
            bumpMatchCycle();
        } catch (error) {
            console.error("Error fetching next call:", error);
        }
    }

    return (
        <div className={`w-full ${theme === "light" ? "" : "bg-gray-950"} h-screen flex justify-center items-center flex-col`}>
            <div className='w-full h-[90%] mainArea flex items-center justify-center p-4 gap-4'>

                <VideoShow remoteVideo={remoteVideo} localVideo={localVideo} peerDetails={peerDetails} />

                {(isOpenMessage.onClickIsOn && isOpenMessage.isOn) && <MessageContainer setIsOpenMessage={setIsOpenMessage} />}

            </div>
            <div className='buttons w-full h-[10%] px-8 flex justify-between items-center gap-8'>
                <div className='time'>
                    <CallDuration peer={peerObj} />
                </div>
                <div className='buttons flex items-center justify-center gap-2'>
                    <div onClick={toogleCammera} className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-3 rounded-full cursor-pointer`}>
                        {camOn ? <IoVideocam className='text-3xl' />
                            :
                            <IoVideocamOff className='text-3xl' />}
                    </div>
                    <div onClick={toggleMic} className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-3 rounded-full cursor-pointer`}>
                        {micOn ? <IoMdMic className='text-3xl' />
                            :
                            <MdMicOff className='text-3xl' />}
                    </div>
                    <div onClick={endVideoCall} className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-3 rounded-full cursor-pointer`}>
                        <MdCallEnd className='text-3xl text-red-600' />
                    </div>
                    <div onClick={nextCall} title='Next' className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-3 rounded-full cursor-pointer`}>
                        <BsCaretRightFill className='text-3xl' />
                    </div>
                </div>
                <div className='flex gap-4 items-center justify-center'>
                    <div onClick={() => setIsOpenMessage((v) => ({...v, onClickIsOn: !v.onClickIsOn}))} className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-4 rounded-full cursor-pointer`}>
                        <FaMessage className='text-2xl' />
                    </div>
                    <div onClick={() => setTheme(theme === "light" ? "dark" : "light")} title='Next' className={`messageBtn ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-700 bg-gray-800 text-gray-400"} transition-all p-3 rounded-full cursor-pointer`}>
                        {theme === "light" ? <WiMoonAltNew className='text-3xl' title='dark' /> : <WiMoonAltFull className='text-3xl' title='light' />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RandomCall