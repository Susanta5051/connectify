import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage.tsx";
import {ToastContainer} from "react-toastify"
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import { Navigate } from "react-router-dom";
import { PublicRoute } from "./contexts/PublicRoute.tsx";
import {  useEffect } from "react";
import { socket } from "./contexts/socket.ts";
import UpdateProfile from "./pages/UpdateProfile.tsx";
import { useDispatch, useSelector } from "react-redux";
import {type AppDispatch, type RootState } from "./redux/store.ts";
import { checkAuth } from "./redux/userSlice.ts";

export const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")+"/api"

console.log(import.meta.env.VITE_BACKEND_URL)

function App() {
      
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state:RootState)=>state.user)
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    socket.io.opts.query = {
      userId,
    };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(()=>{
    dispatch(checkAuth())    
  },[])
  
  return (
    <div className="bg-[url('/src/assets/bg.avif')] bg-cover bg-center backdrop-blur-2xl h-screen *:text-white *:text-[0.5rem] *:md:text-lg  overflow-y-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/update-profile" element={<UpdateProfile />} ></Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        </Route>
        
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
