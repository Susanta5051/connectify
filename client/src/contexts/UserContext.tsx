import { createContext, useState ,useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import  type {IUser , IOtherUser} from '../types/UserType.ts'
import axios from "axios";

interface UserContextType{
    user:IUser|null,
    setUser : Dispatch<React.SetStateAction<IUser|null>>,
    loading:boolean,
    setLoading: Dispatch<React.SetStateAction<boolean>>,
    selectedContact:IOtherUser|null,
    setselectedContact : Dispatch<React.SetStateAction<IOtherUser|null>>,
    searchValue : string , 
    setSearchValue:Dispatch<React.SetStateAction<string>>,
    searchedContact:any,
    setSearchedContact:Dispatch<SetStateAction<any>>
}

export const backendUrl = (import.meta.env.BACKEND_URL || "http://localhost:3000")+"/api"
export const UserContext = createContext<UserContextType | undefined>(undefined)




const UserContextProvider = ({children } : {children : React.ReactNode})=>{

    const [user,setUser ] = useState<IUser | null>(null);
    const [loading , setLoading] = useState<boolean>(true)
    const [selectedContact , setselectedContact] = useState<IOtherUser | null>(null)
    const [searchValue , setSearchValue] = useState<string>("");
    const [searchedContact,setSearchedContact] = useState<any>("null");

    
    const contextValue = {user ,setUser , loading , setLoading ,selectedContact , setselectedContact,searchValue,setSearchValue,searchedContact,setSearchedContact}
    useEffect(() => {

         setLoading(true);
        const verifySession = async () => {
            try {
                const res = await cookieStore.get("token");
                
                if (!res || !res.value) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // console.log("Token found:", res.value);
                
                const result = await axios.get(`${backendUrl}/user/checkAuth`, { 
                    headers: {
                        "Content-Type": "application/json", 
                        "token": res.value
                    }
                });

                if (result.data && result.data.user) {
                    setUser(result.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, [])

    
    return (

        
        <UserContext.Provider value={contextValue} >
        {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider