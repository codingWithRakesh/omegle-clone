import { create } from "zustand";

const useRoomStore = create((set, get) => ({
    userId: null,
    setUserId: (id) => {
        set({ userId: id })
    },
    getUserId: () => {
        return get().userId
    },
    peer: null,
    setPeer: (peerConnection) => {
        set({ peer: peerConnection })
    },
    getPeer: () => {
        return get().peer
    },
    roomId: null,
    setRoomId: (id) => {
        set({ roomId: id })
    },
    getRoomId: () => {
        return get().roomId
    },
    matchCycle: 0,
    bumpMatchCycle: () => {
        set((state) => ({ matchCycle: state.matchCycle + 1 }));
    },
}));

export default useRoomStore;