import { createContext, useContext, useState } from 'react'

export const ThemeContext = createContext()

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
export default ThemeContextProvider

export function useTheme() {
    return useContext(ThemeContext)
}