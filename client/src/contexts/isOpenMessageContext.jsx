import { createContext, useContext, useState } from 'react'

export const IsOpenMessageContext = createContext()

const IsOpenMessageContextProvider = ({ children }) => {
    const [isOpenMessage, setIsOpenMessage] = useState({
        isOn: false,
        onClickIsOn: false
    });
    return (
        <IsOpenMessageContext.Provider value={{ isOpenMessage, setIsOpenMessage }}>
            {children}
        </IsOpenMessageContext.Provider>
    )
}
export default IsOpenMessageContextProvider

export function useIsOpenMessage() {
    return useContext(IsOpenMessageContext)
}