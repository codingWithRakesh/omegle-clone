import React, { useEffect, useState } from 'react'
import { socket } from '../socket/socket';
import useRoomStore from '../store/roomStore';
import useLogicStore from '../store/logicStore';
import { useIsConnected } from '../contexts/isConnectedContext';

const VideoShow = ({ isOpenMessage, remoteVideo, localVideo, peerDetails }) => {
    const { isConnected, setIsConnected } = useIsConnected()
    const { userId, peer, roomId, bumpMatchCycle } = useRoomStore();
    const { fetchRoomList, endVideoCall: endCallAPI } = useLogicStore();
    useEffect(() => {
        const callEnd = async (data) => {
            const {isExist} = data;
            console.log("Call ended by peer",{data, isExist});
            await setIsConnected(true);

            if(isExist){
                const roomList = await fetchRoomList({ userId1: userId });
                console.log("Room List:", roomList);
            }
            
        };
        socket.on("call_ended", callEnd);
        return () => {
            socket.off("call_ended", callEnd);
        };
    }, [setIsConnected, fetchRoomList, userId]);

    return (
        <div className={`videoCall ${isOpenMessage ? "w-[73%]" : "w-[90%]"} relative h-full border rounded-2xl overflow-hidden`}>
            <div className="remortVideo w-full h-full flex justify-center items-center">
                <video ref={remoteVideo} autoPlay playsInline className='remoteVideoElement w-full h-full object-contain'></video>
            </div>
            <div className={`localVideo ${isOpenMessage ? "h-[30%] w-[30%]" : "h-[35%] w-[30%]"} z-10 absolute bottom-4 right-4 border rounded-2xl overflow-hidden`}>
                <video ref={localVideo} autoPlay muted playsInline className='localVideoElement w-full h-full object-contain rounded-2xl'></video>
            </div>
            <div className="nameUser absolute top-4 left-4 bg-gray-300 px-4 py-2 rounded-2xl">
                {peerDetails?.name || "John Doe"}
            </div>
            {isConnected && <div className='statusCall absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-200 bg-opacity-50 text-white text-2xl font-bold'>
                Connecting...
            </div>}
        </div>
    )
}

export default VideoShow