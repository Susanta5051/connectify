import React, {  useState } from "react";
import logo_big from "../assets/logo.png"

import Email from "@mui/icons-material/EmailOutlined";

import Lock from "@mui/icons-material/Lock";
import Eye from "@mui/icons-material/Visibility";

import EyeCross from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch,  RootState } from "@/redux/store.ts";
import { login } from "@/redux/userSlice.ts";
import { Spinner } from "@/components/ui/spinner";


export type LoginType = {
  email: string | number | readonly string[] | undefined;
  password: string | number | readonly string[] | undefined;
};

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const loading  = useSelector((state:RootState)=>state.loading)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>
  ): void => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      await dispatch(login(formData)).unwrap();  
      console.log("cought")
      navigate("/")  ;
    }catch(rejectedValueOrSerializedError){
      console.error("Login failed:", rejectedValueOrSerializedError);
    }
  };

  return (
    <div className="flex gap-10 h-screen justify-around backdrop-blur-md text-white">
      <div className="flex items-center justify-center">
        <img src={logo_big} alt="" className="max-h-70" />
      </div>
      <div className="p-10 flex justify-center items-center ">
        <form
          className="flex flex-col items-start p-5 border-amber-400 border-2 text-black  bg-white/50 rounded-2xl gap-2 "
          onSubmit={(e) => onSubmitHandler(e)}
        >
          <p className="w-full text-lg md:text-2xl text-center">Login</p>

          <div className=" ">
            <label htmlFor="email" className="relative flex items-center">
              <div className="absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center ">
                <Email fontSize="large" className=" text-black" />
              </div>
            </label>
            <input
              onChange={(e) => handleChange(e)}
              value={formData.email}
              name="email"
              id="email"
              placeholder="Enter your email"
              className="md:w-80 lg:w-110  p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="relative flex items-center">
              <div className="absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center">
                <Lock fontSize="large" className=" text-black" />
              </div>
            </label>
            {showPassword ? (
              <div
                onClick={() => setShowPassword(false)}
                className="relative flex items-center"
              >
                <div className="absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center">
                  <Eye fontSize="large" className=" text-black" />
                </div>
              </div>
            ) : (
              <div
                onClick={() => setShowPassword(true)}
                className="relative flex items-center"
              >
                <div className="absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center">
                  <EyeCross fontSize="large" className=" text-black" />
                </div>
              </div>
            )}

            <input
              onChange={(e) => handleChange(e)}
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              id="password"
              type={showPassword ? "test" : "password"}
              className="md:w-80 lg:w-110 p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none"
            />
          </div>

          <button type={loading?"button":'submit'} id='email' className='bg-linear-to-r from-[#7242f5] to-[#231252] p-1 md:w-80 lg:w-110 rounded-md text-white'  >{ loading ? <div className='flex justify-center text-center'><Spinner data-icon="" style={{"height":30 , marginRight:5}} className='size-6' /> <span>Loading . . .</span></div> : "Login"}</button>
          <p className="">
            Do not have an account?{" "}
            <a
              href="/register"
              className="underline cursor-pointer hover:text-blue-800"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
