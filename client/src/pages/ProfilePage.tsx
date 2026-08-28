import ClearIcon from '@mui/icons-material/Clear';
import avatar from "../assets/avatar_icon.png"
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {type AppDispatch, type RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";

const ProfilePage = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state:RootState)=>state.user)
  console.log(user)
  
  const handleLogout = async()=>{
    try{
      dispatch(logout());
      await cookieStore.delete("token");
      navigate("/login")
    }catch(error){
      console.log(error)
    }
  }

  if(!user)return null;
  return (
    <div className="flex justify-center items-center h-screen backdrop-blur-3xl ">
      
        <div className="flex flex-col relative justify-center gap-5 items-center h-[80vh] w-[80vw] md:m-10 bg-slate-900 rounded-4xl">
          <div className="absolute left-5 top-5 hover:bg-red-600 rounded-md" onClick={()=>navigate(-1)}><ClearIcon /> </div>
          <div className="absolute right-5 top-5 hover:bg-red-600 rounded-md" onClick={()=>navigate("/update-profile")}><EditIcon /> </div>
          <div className="flex justify-center items-center">
            <img className="h-40 w-40 object-cover rounded-full" src={user.profilePic || avatar } alt=""></img>
          </div>
          <div className="flex  flex-col justify-around gap-3 text-xl">
              
              <div>
                Name:
                <div className=""><p>{user.fullName}</p></div>
              </div>

              <div>
                Email: 
                <p>{user.email}</p>
              </div>
              
              <div>
                Bio:
                <div className=""><p>{user.bio}</p></div>
              </div>

              <button type="button" className="flex gap-5 text-red-600" onClick={()=>handleLogout()}>
                <p>Logout </p>  
                <LogoutIcon/>
              </button>
          </div>
      </div>
      
    </div>
  )
}

export default ProfilePage
