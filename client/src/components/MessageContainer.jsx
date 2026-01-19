import React from 'react'
import { MdSend } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'

const MessageContainer = ({setIsOpenMessage}) => {
    return (
        <div className='messaging w-[25%] border h-full rounded-2xl flex flex-col'>
            <div className='headerPartMessage h-[8%] flex m-2 justify-between items-center px-4 bg-gray-100 rounded-2xl'>
                <div>Messages</div>
                <div onClick={() => setIsOpenMessage((v) => !v)} className='cursor-pointer p-3 rounded-full hover:bg-gray-200'>
                    <RxCross1 />
                </div>
            </div>
            <div className='contentPartmessage grow p-4 overflow-y-auto'>
                <div className='message mb-4'>
                    <div className='bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]'>
                        Hello! How are you?
                    </div>
                </div>
                <div className='message mb-4 flex justify-end'>
                    <div className='bg-gray-200 px-4 py-2 rounded-2xl max-w-[70%]'>
                        I'm good, thank you! How about you?
                    </div>
                </div>
                <div className='message mb-4'>
                    <div className='bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]'>
                        I'm doing well, thanks for asking!
                    </div>
                </div>
            </div>
            <div className='footerPartMessage h-[8%] flex items-center px-2 rounded-2xl m-2 gap-2'>
                <input type="text" placeholder='Type a message...' className='grow border rounded px-2 py-2' />
                <button className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>
                    <MdSend className='text-2xl' />
                </button>
            </div>
        </div>
    )
}

export default MessageContainer