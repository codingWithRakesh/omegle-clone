import { useState } from 'react'
import useRoomStore from '../store/roomStore';
import useLogicStore from '../store/logicStore';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/themeContext';
import { FaMale } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";

const Home = () => {
    const { userId, setUserDetails: setUserData } = useRoomStore();
    const { createUser } = useUserStore();
    const [userDetails, setUserDetails] = useState({
        name: "",
        gender: ""
    })
    const { theme } = useTheme()
    const navigate = useNavigate();
    const handleChange = async () => {
        if (!userDetails.name || !userDetails.gender) {
            alert("Please enter all details");
            return;
        }
        try {
            await createUser({ id: userId, name: userDetails.name, gender: userDetails.gender });
            setUserData(userDetails);
            navigate("/call");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
    return (
        <div className={`min-w-full ${theme === "light" ? "bg-linear-to-b from-white to-emerald-700" : "bg-linear-to-b from-emerald-700 to-zinc-950"} h-screen flex justify-center items-center text-center flex-col gap-8`}>
            <div>
                <h1 className={`text-6xl font-bold mb-4 sujoy2 px-2 ${theme === "light" ? "text-black" : "text-white"}`}>Welcome to Omegle Clone</h1>
                <p className={`text-xl text-center sujoy1 ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}>Connect with random people around the world!</p>
            </div>
            <div className='px-6 py-1 rounded-2xl mt-8'>
                <input id="nameInput" type="text" value={userDetails.name} onChange={(e) => setUserDetails({...userDetails, name: e.target.value})} className={`border-2 border-gray-400/50 w-full outline-none py-3 px-4 rounded-4xl sujoy2 ${theme === "light" ? "text-black" : "text-white"}`} placeholder="Enter your name" />
                <div className='flex justify-between mt-6 gap-4 sujoy2 font-semibold'>
                    <div className={`${userDetails.gender === "Male" ? "border-2 bg-emerald-600 border-gray-400/50" : "border-2 border-gray-400/50"} rounded-4xl py-4 px-8 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Male"})}>Male</div>
                    <div className={`${userDetails.gender === "Female" ? "border-2 bg-emerald-600 border-gray-400/50" : "border-2 border-gray-400/50"} rounded-4xl py-4 px-8 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Female"})}>Female</div>
                    <div className={`${userDetails.gender === "Other" ? "border-2 bg-emerald-600 border-gray-400/50" : "border-2 border-gray-400/50"} rounded-4xl py-4 px-8 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Other"})}>Other</div>
                </div>
            </div>
            <div className='p-0'>
                <button onClick={handleChange} className='bg-emerald-500 text-white px-6 py-3 rounded-md cursor-pointer sujoy2 font-semibold'>Start Calling</button>
            </div>
        </div>
    )
}

export default Home