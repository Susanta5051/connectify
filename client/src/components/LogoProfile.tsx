import React, {  useEffect } from "react";
import logo from "../assets/logo.png"
import menu_icon from '../assets/menu_icon.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";
const LogoProfile = () => {
    const [selectedUser, setSelectedUser] = React.useState<boolean>(false);
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state:RootState)=>state.user)
   
    const handleLogout = async()=>{
      try{
        dispatch(logout())
        navigate("/login")
      }catch(error){
        console.log(error)
      }
    
  }

  useEffect(()=>{},[user])
  return (
    <div className="flex items-center justify-between border-b px-4">
      <div className="h-15  ">
        <img src={logo} alt="Logo" className=" h-full w-full " />
      </div>
      <div className="relative">
        
            <div className={` flex justify-end ${selectedUser ? "hidden":"block"} `} onClick={() => setSelectedUser(!selectedUser)} >
                <img src={menu_icon} alt="Menu Icon" className="h-8" />
            </div>
        
        <div className={`${selectedUser ? 'w-20 block' : 'hidden'}`} onMouseLeave={() => setSelectedUser(false)}>
            <div className="flex flex-col ">
                <p className="text-sm cursor-pointer " onClick={()=>navigate('/profile')}>Profile</p>
                <p className="text-sm cursor-pointer " onClick={()=>handleLogout()}>Logout</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LogoProfile;
