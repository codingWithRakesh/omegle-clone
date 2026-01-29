import { useEffect, useState } from 'react'
import { socket } from '../socket/socket';
import useRoomStore from '../store/roomStore';
import useLogicStore from '../store/logicStore';
import { useIsConnected } from '../contexts/isConnectedContext';
import useMessageStore from '../store/messageStore';
import { useTheme } from '../contexts/themeContext';
import { useIsOpenMessage } from '../contexts/isOpenMessageContext';

const VideoShow = ({ remoteVideo, localVideo, peerDetails }) => {
    const { isConnected, setIsConnected } = useIsConnected()
    const { userId, peer, roomId, bumpMatchCycle, getUserDetails } = useRoomStore();
    const { fetchRoomList, endVideoCall: endCallAPI } = useLogicStore();
    const clearMessages = useMessageStore((state) => state.clearMessages);
    const { theme } = useTheme()
    const { isOpenMessage, setIsOpenMessage } = useIsOpenMessage()
    const { setRoomId } = useRoomStore();
    useEffect(() => {
        const callEnd = async (data) => {
            const {isExist} = data;
            setIsConnected(true);
            setIsOpenMessage((v) => ({...v, isOn: false }));
            setRoomId(null);

            if(isExist){
                await fetchRoomList({ userId1: userId });
            }
            clearMessages();
        };
        socket.on("call_ended", callEnd);
        return () => {
            socket.off("call_ended", callEnd);
        };
    }, [setIsConnected, fetchRoomList, userId, setRoomId]);

    return (
        <div className={`videoCall ${isOpenMessage.isOn && isOpenMessage.onClickIsOn ? "w-[73%]" : "w-[90%]"} relative h-full border border-gray-700 rounded-2xl overflow-hidden`}>
            <div className="remortVideo w-full h-full flex justify-center items-center">
                <video ref={remoteVideo} autoPlay playsInline className='remoteVideoElement w-full h-full object-contain'></video>
            </div>
            <div className={`localVideo ${isOpenMessage.isOn && isOpenMessage.onClickIsOn ? "h-[30%] w-[30%]" : "h-[35%] w-[30%]"} z-10 absolute bottom-4 right-4 border border-gray-700 rounded-2xl overflow-hidden`}>
                <video ref={localVideo} autoPlay muted playsInline className='localVideoElement w-full h-full object-contain rounded-2xl'></video>
                <div className={`nameUser absolute top-4 left-4 ${theme === "light" ? "bg-gray-300" : "bg-gray-700 text-gray-400"} px-4 py-2 rounded-2xl`}>
                    { getUserDetails()?.name || "John Doe"}
                </div>
            </div>
            <div className={`nameUser absolute top-4 left-4 ${theme === "light" ? "bg-gray-300" : "bg-gray-700 text-gray-400"} px-4 py-2 rounded-2xl`}>
                {peerDetails?.name || "John Doe"}
            </div>
            {isConnected && <div className={`statusCall absolute w-full h-full top-0 left-0 flex justify-center items-center ${theme === "light" ? "bg-gray-200 text-white" : "bg-gray-900 text-gray-700"} bg-opacity-50 text-2xl font-bold`}>
                Connecting...
            </div>}
        </div>
    )
}

export default VideoShow