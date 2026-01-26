import { createContext, useContext, useState } from 'react'

export const IsConnectedContext = createContext()

const IsConnectedContextProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);
    return (
        <IsConnectedContext.Provider value={{ isConnected, setIsConnected }}>
            {children}
        </IsConnectedContext.Provider>
    )
}
export default IsConnectedContextProvider

export function useIsConnected() {
    return useContext(IsConnectedContext)
}