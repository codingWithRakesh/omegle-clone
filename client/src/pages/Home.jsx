import { useState } from 'react'
import useRoomStore from '../store/roomStore';
import useLogicStore from '../store/logicStore';
import useUserStore from '../store/userStore';

const Home = () => {
    const { userId } = useRoomStore();
    const { createUser } = useUserStore();
    const [first, setfirst] = useState({
        name: "",
        gender: ""
    })
    const handleChange = async () => {
        console.log(first);
        if (!first.name || !first.gender) {
            alert("Please enter all details");
            return;
        }
        try {
            const user = await createUser({ id: userId, name: first.name, gender: first.gender });
            console.log("User created:", user);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
    return (
        <div className='w-full h-screen flex justify-center items-center flex-col gap-8'>
            <div>
                <h1 className='text-4xl font-bold mb-4'>Welcome to Omegle Clone</h1>
                <p className='text-lg text-center'>Connect with random people around the world!</p>
            </div>
            <div className='border p-6 rounded-2xl'>
                <input type="text" value={first.name} onChange={(e) => setfirst({...first, name: e.target.value})} className='border w-full outline-none p-2 rounded-md' placeholder="Enter your name" />
                <div className='flex p-4 gap-4'>
                    <div className={`${first.gender === "Male" ? "border-2 border-blue-700" : "border"} rounded-2xl p-4 cursor-pointer`} onClick={() => setfirst({...first, gender: "Male"})}>Male</div>
                    <div className={`${first.gender === "Female" ? "border-2 border-blue-700" : "border"} rounded-2xl p-4 cursor-pointer`} onClick={() => setfirst({...first, gender: "Female"})}>Female</div>
                    <div className={`${first.gender === "Other" ? "border-2 border-blue-700" : "border"} rounded-2xl p-4 cursor-pointer`} onClick={() => setfirst({...first, gender: "Other"})}>Other</div>
                </div>
            </div>
            <div>
                <button onClick={handleChange} className='bg-blue-500 text-white px-6 py-3 rounded-xl cursor-pointer'>Start Calling</button>
            </div>
        </div>
    )
}

export default Home