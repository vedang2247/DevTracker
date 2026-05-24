import { createContext, useState } from "react";


export const AuthContext=createContext();

export const AuthProvider= ({children}) => {
    const [isAuthenticated,setIsAuthenticated]=useState(false);
    const [isLoading,setIsLoading]=useState(true);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    )
}