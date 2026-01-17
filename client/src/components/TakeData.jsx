import React from 'react'
import useRoomStore from '../store/roomStore.js';

const TakeData = () => {
    const { userId } = useRoomStore();
    const matching = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v2/logic/match`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId1: userId })
            });
            const data = await response.json();
            console.log("Matching response:", data);
        } catch (error) {
            console.log("Error in matching:", error);
        }
    }
    return (
        <div>
            <h2>Take Data Component</h2>
            <button onClick={matching}>check</button>
        </div>
    )
}

export default TakeData