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
    const { userId, getUserDetails } = useRoomStore();
    const { fetchRoomList } = useLogicStore();
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
        <div className={`videoCall ${isOpenMessage.isOn && isOpenMessage.onClickIsOn ? "w-[73%]" : "w-[95%]"} glass relative h-full rounded-xl overflow-hidden`}>
            <div className="remortVideo w-full h-full flex justify-center items-center">
                <video ref={remoteVideo} autoPlay playsInline className='remoteVideoElement w-full h-full object-contain'></video>
            </div>
            <div className={`localVideo ${isOpenMessage.isOn && isOpenMessage.onClickIsOn ? "h-[30%] w-[30%]" : "h-[35%] w-[30%]"} glass z-10 absolute bottom-4 right-4 border border-gray-700 rounded-xl overflow-hidden`}>
                <video ref={localVideo} autoPlay muted playsInline className='localVideoElement w-full h-full object-contain rounded-2xl'></video>
                <div className={`nameUser absolute top-4 left-4 ${theme === "light" ? "bg-emerald-500" : "bg-emerald-800 text-gray-200"} sujoy1 font-semibold px-4 py-2 rounded-md`}>
                    { getUserDetails()?.name || "John Doe"}
                </div>
            </div>
            <div className={`nameUser absolute top-4 left-4 ${theme === "light" ? "bg-emerald-400 text-black" : "bg-emerald-900 text-gray-200"} sujoy1 font-semibold px-4 py-2 rounded-md`}>
                {peerDetails?.name || "John Doe"}
            </div>
            {isConnected && <div className={`statusCall absolute w-full h-full top-0 left-0 flex justify-center items-center ${theme === "light" ? "bg-gray-400/50 text-black" : "bg-zinc-900/50 text-white"} sujoy2 bg-opacity-50 text-4xl font-bold`}>
                Connecting...
            </div>}
        </div>
    )
}

export default VideoShow