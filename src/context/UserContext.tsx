import { createContext, useContext } from 'react'

const UserContext = createContext(null)

const useUser = () => {
    return useContext(UserContext)
}

export { UserContext, useUser }