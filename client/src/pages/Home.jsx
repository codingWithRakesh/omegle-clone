import { useState } from 'react'
import useRoomStore from '../store/roomStore';
import useLogicStore from '../store/logicStore';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/themeContext';

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
        <div className={`w-full ${theme === "light" ? "bg-gray-100" : "bg-gray-950"} h-screen flex justify-center items-center flex-col gap-8`}>
            <div>
                <h1 className={`text-4xl font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}>Welcome to Omegle Clone</h1>
                <p className={`text-lg text-center ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>Connect with random people around the world!</p>
            </div>
            <div className='border border-gray-700 p-6 rounded-2xl'>
                <input type="text" value={userDetails.name} onChange={(e) => setUserDetails({...userDetails, name: e.target.value})} className={`border border-gray-700 w-full outline-none p-2 rounded-md ${theme === "light" ? "text-black" : "text-white"}`} placeholder="Enter your name" />
                <div className='flex p-4 gap-4'>
                    <div className={`${userDetails.gender === "Male" ? "border-2 border-blue-700" : "border border-gray-700"} rounded-2xl p-4 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Male"})}>Male</div>
                    <div className={`${userDetails.gender === "Female" ? "border-2 border-blue-700" : "border border-gray-700"} rounded-2xl p-4 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Female"})}>Female</div>
                    <div className={`${userDetails.gender === "Other" ? "border-2 border-blue-700" : "border border-gray-700"} rounded-2xl p-4 cursor-pointer ${theme === "light" ? "text-black" : "text-white"}`} onClick={() => setUserDetails({...userDetails, gender: "Other"})}>Other</div>
                </div>
            </div>
            <div>
                <button onClick={handleChange} className='bg-blue-500 text-white px-6 py-3 rounded-xl cursor-pointer'>Start Calling</button>
            </div>
        </div>
    )
}

export default Home