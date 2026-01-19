import { create } from "zustand";
import axios from "axios";

const useLogicStore = create((set, get) => ({
    message : null,
    isLoading : false,
    error: null,

    fetchRoomList: async (roomData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v2/logic/match`, roomData);
            if (response.data) {
                set({ message: response.data, isLoading: false });
                return response.data;
            } else {
                set({ isLoading: false, error: "No data received from server" });
                throw new Error("No data received from server");
            }   
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    }

}));

export default useLogicStore;