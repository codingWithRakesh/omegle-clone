import { create } from "zustand";

const useRoomStore = create((set, get) => ({
    userId: null,
    setUserId: (id) => set({ userId: id }),
    getUserId: () => get().userId,
    peer: null,
    setPeer: (peerConnection) => set({ peer: peerConnection }),
    getPeer: () => get().peer,
    roomId: null,
    setRoomId: (id) => set({ roomId: id }),
    getRoomId: () => get().roomId,
}));

export default useRoomStore;