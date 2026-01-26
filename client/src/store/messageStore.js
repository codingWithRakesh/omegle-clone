import { create } from "zustand";
import axios from "axios";

const useMessageStore = create((set) => ({
    messages: [],
    isLoading: false,
    error: null,
    addMessage: (mesObj) => {
        set((state) => ({
            messages: [...state.messages, mesObj]
        }))
    },
    clearMessages: () => set({ messages: [] }),
    sendMessage: async (messageData) => {
        console.log("Sending message data:", messageData);
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v2/message/send`, messageData);
            if (response?.data?.statusCode !== 200) {
                set({ isLoading: false, error: response.data.message || "Failed to send message" });
                throw new Error(response.data.message || "Failed to send message");
            }

            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    }
}))

export default useMessageStore;
