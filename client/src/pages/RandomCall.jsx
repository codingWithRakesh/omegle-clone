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

const RandomCall = () => {
    const [isOpenMessage, setIsOpenMessage] = useState(true)
    const [peerObj, setPeerObj] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const clearMessages = useMessageStore((state) => state.clearMessages);

    const { isConnected, setIsConnected } = useIsConnected()

    const localVideo = useRef(null);
    const remoteVideo = useRef(null);

    const peer = useRef(null);
    const localStream = useRef(null);
    const remoteStream = useRef(null);

    const { userId, peer: peerDetails, roomId, bumpMatchCycle } = useRoomStore();
    const { fetchRoomList, endVideoCall:endCallAPI } = useLogicStore();

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
            console.log({ roomId, peerId: peerDetails?.id, userId, isEnd: true })
            await endCallAPI({ roomId, peerId: peerDetails?.id, userId, isEnd: true });
            socket.emit("leave_room", userId);
            clearMessages();
        } catch (error) {
            console.error("Error ending call:", error);
        }
        await navigate('/');
    }

    const nextCall = async () => {
        try {
            await setIsConnected(true);
            await endCall();
            const roomList = await fetchRoomList({ userId1: userId });
            console.log("Room List:", roomList);
            console.log({ roomId, peerId: peerDetails?.id, userId, isEnd: false })
            await endCallAPI({ roomId, peerId: peerDetails?.id, userId, isEnd: false });
            clearMessages();
            bumpMatchCycle();
        } catch (error) {
            console.error("Error fetching next call:", error);
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center flex-col'>
            <div className='w-full h-[90%] mainArea flex items-center justify-center p-4 gap-4'>

                <VideoShow isOpenMessage={isOpenMessage} remoteVideo={remoteVideo} localVideo={localVideo} peerDetails={peerDetails} />

                {isOpenMessage && <MessageContainer setIsOpenMessage={setIsOpenMessage} />}

            </div>
            <div className='buttons w-full h-[10%] px-8 flex justify-between items-center gap-8'>
                <div className='time'>
                    <CallDuration peer={peerObj} />
                </div>
                <div className='buttons flex items-center justify-center gap-2'>
                    <div onClick={toogleCammera} className='messageBtn bg-gray-100 transition-all p-3 rounded-full cursor-pointer hover:bg-gray-200'>
                        {camOn ? <IoVideocam className='text-3xl' />
                            :
                            <IoVideocamOff className='text-3xl' />}
                    </div>
                    <div onClick={toggleMic} className='messageBtn bg-gray-100 transition-all p-3 rounded-full cursor-pointer hover:bg-gray-200'>
                        {micOn ? <IoMdMic className='text-3xl' />
                            :
                            <MdMicOff className='text-3xl' />}
                    </div>
                    <div onClick={endVideoCall} className='messageBtn bg-gray-100 transition-all p-3 rounded-full cursor-pointer hover:bg-gray-200'>
                        <MdCallEnd className='text-3xl text-red-600' />
                    </div>
                    <div onClick={nextCall} title='Next' className='messageBtn bg-gray-100 transition-all p-3 rounded-full cursor-pointer hover:bg-gray-200'>
                        <BsCaretRightFill className='text-3xl' />
                    </div>
                </div>
                <div onClick={() => setIsOpenMessage((v) => !v)} className='messageBtn bg-gray-100 transition-all p-4 rounded-full cursor-pointer hover:bg-gray-200'>
                    <FaMessage className='text-2xl' />
                </div>
            </div>
        </div>
    )
}

export default RandomCall