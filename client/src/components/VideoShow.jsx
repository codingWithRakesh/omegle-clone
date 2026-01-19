import React from 'react'

const VideoShow = ({isOpenMessage, remoteVideo, localVideo, peerDetails}) => {
    return (
        <div className={`videoCall ${isOpenMessage ? "w-[73%]" : "w-[90%]"} relative h-full border rounded-2xl overflow-hidden`}>
            <div className="remortVideo w-full h-full flex justify-center items-center">
                <video ref={remoteVideo} autoPlay playsInline className='remoteVideoElement w-full h-full object-contain'></video>
            </div>
            <div className={`localVideo ${isOpenMessage ? "h-[30%] w-[30%]" : "h-[35%] w-[30%]"} absolute bottom-4 right-4 border rounded-2xl overflow-hidden`}>
                <video ref={localVideo} autoPlay muted playsInline className='localVideoElement w-full h-full object-contain rounded-2xl'></video>
            </div>
            <div className="nameUser absolute top-4 left-4 bg-gray-300 px-4 py-2 rounded-2xl">
                {peerDetails?.name || "John Doe"}
            </div>
            {/* <div className='statusCall absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-200 bg-opacity-50 text-white text-2xl font-bold'>
                Connecting...
            </div> */}
        </div>
    )
}

export default VideoShow