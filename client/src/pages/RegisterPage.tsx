import React, {  useState} from 'react';
import { Link } from "react-router-dom";
import logo_big from '../assets/logo.png'
import { Spinner } from "@/components/ui/spinner"

import Email from '@mui/icons-material/EmailOutlined'
import DescriptionIcon from '@mui/icons-material/Description';
import Lock from '@mui/icons-material/Lock'
import Eye from '@mui/icons-material/Visibility'
import Person from '@mui/icons-material/Person'

import EyeCross from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom';
import registerValidator from "../validators/RegisterValidator.ts"
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch,  RootState } from '@/redux/store.ts';
import { register } from '@/redux/userSlice.ts';



 
export type RegisterType = {
  email: string;
  password: string;
  fullName: string;
  rePassword: string;
  bio: string;
};


const RegisterPage = () => {


  const [formData,setFormData ] = useState<RegisterType>({fullName : "" ,email : "" , password :"" , rePassword:"" ,bio:""});
  const [errorData , setErrorData] = useState({fullName : "" ,email : "" , password :"" , rePassword:"" ,bio:""})
    const [showPassword, setShowPassword] = React.useState(false);
    const [showRePassword, setShowRePassword] = React.useState(false);

  const navigate= useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const loading = useSelector((state:RootState)=>state.loading)

  
  
const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  const errors = {
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
    bio: ""
  };
  const parsedata = registerValidator.safeParse(formData)
  if(parsedata.error){
    setErrorData(prevData => ({
      ...prevData,
      ...parsedata
    }));
    return;
  }
  
  if (
    formData.password &&
    formData.rePassword &&
    formData.password !== formData.rePassword
  ) {
    errors.password = "Password Must be same";
    errors.rePassword = "Password Must be same";
  }
  setErrorData(errors);

  // Stop if there is any validation error
  if (Object.values(errors).some(error => error !== "")) {
    return;
  }


  try {
        
    dispatch(register(formData)).unwrap()
    navigate("/home");

  } catch (error: any) {
    console.log(error.response.data.error);


  } 
};


const  handleChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void =>{
  const name = e.target.name as keyof typeof errorData;
  if (errorData[name]) {
    setErrorData((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  }
    setFormData((data)=>({ ...data , [e.target.name] : e.target.value}))
}

const  handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>{
    if (errorData.bio) {
      setErrorData((prevErrors) => ({
        ...prevErrors,
        bio: ""
      }));
    }
    setFormData((data)=>({ ...data , [e.target.name] : e.target.value}))
}


  return (
    <div className="flex gap-10 h-screen justify-around backdrop-blur-md text-white">
      <div className='flex items-center justify-center'>
        <img src={logo_big} alt='' className='max-h-70' />
      </div>
      <div className='p-10 flex justify-center items-center '>
        <form className='flex flex-col items-start p-5 border-amber-400 border-2 text-black  bg-white/50 rounded-2xl gap-2 ' onSubmit={(e)=>submitHandler(e)}>
            <p className='w-full text-lg md:text-2xl text-center'>Register</p>

            <div className='flex flex-col '>
               <label htmlFor='fullName' className='relative flex items-center'><div className='absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center '><Person fontSize='large' className=' text-black' /></div></label>
              <input onChange={(e)=>handleChange(e)} value={formData.fullName} name='fullName' id='fullName' placeholder='Enter your FullName' className='md:w-80 lg:w-110  p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none' />
              {errorData.fullName && <label htmlFor='fullName' className='text-red-700 text-sm'>{errorData.fullName}</label>}
            </div>
            <div className=' flex flex-col'>
               <label htmlFor='email' className='relative flex items-center'><div className='absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center '><Email fontSize='large' className=' text-black' /></div></label>
              <div className='flex flex-col'>
                <input onChange={(e)=>handleChange(e)} value={formData.email} name='email' id='email' placeholder='Enter your email' className='md:w-80 lg:w-110  p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none' />
              </div>
              {errorData.email && <label htmlFor='fullName' className='text-red-700 text-sm'>{errorData.email}</label>}
            </div>
            
           
            <div className='flex flex-col'>

               <label htmlFor='password' className='relative flex items-center'><div className='absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center'><Lock fontSize='large' className=' text-black' /></div></label>
               {showPassword ? <div onClick={()=>(setShowPassword(false))}  className='relative flex items-center'><div className='absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center'><Eye fontSize='large' className=' text-black' /></div></div> : 
                <div onClick={()=>(setShowPassword(true))} className='relative flex items-center'><div className='absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center'><EyeCross fontSize='large' className=' text-black' /></div></div>}

              <input onChange={(e)=>handleChange(e)} name='password' value={formData.password} placeholder='Enter Password' id='password' type={showPassword ? "test": "password"} className='md:w-80 lg:w-110 p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none' />
              {errorData.password && <label htmlFor='fullName' className='text-red-700 text-sm '>{errorData.password}</label>}

            </div>

            <div className='flex flex-col'>

               <label htmlFor='rePassword' className='relative flex items-center'><div className='absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center'><Lock fontSize='large' className=' text-black' /></div></label>
               {showRePassword ? <div onClick={()=>(setShowRePassword(false))}  className='relative flex items-center'><div className='absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center'><Eye fontSize='large' className=' text-black' /></div></div> : 
                <div onClick={()=>(setShowRePassword(true))} className='relative flex items-center'><div className='absolute  right-0 top-1 rounded p-0.5 z-10 flex items-center'><EyeCross fontSize='large' className=' text-black' /></div></div>}

              <input onChange={(e)=>handleChange(e)} name='rePassword' value={formData.rePassword} placeholder='ReEnter Password' id='rePassword' type={showRePassword ? "test": "password"} className='md:w-80 lg:w-110 p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none' />
              {errorData.rePassword && <label htmlFor='fullName' className='text-red-700 text-sm '>{errorData.rePassword}</label>}
            </div>
            <div className=' flex flex-col'>
               <label htmlFor='bio' className='relative flex items-center'><div className='absolute  left-0 top-1 rounded p-0.5 z-10 flex items-center '><DescriptionIcon fontSize='large' className=' text-black' /></div></label>
              <textarea onChange={(e)=>handleTextareaChange(e)} value={formData.bio} name='bio' id='bio' placeholder='Enter bio' className='md:w-80 lg:w-110  p-2 pl-10 rounded-md border-black border-2 focus:scale-105 focus:border-4 outline-none' />
              {errorData.bio  && <label htmlFor='bio' className='text-red-700 text-sm '>{errorData.bio}</label>}
            </div>
            

            <button type={loading?"button":'submit'} id='email' className='bg-linear-to-r from-[#7242f5] to-[#231252] p-1 md:w-80 lg:w-110 rounded-md text-white'  >{ loading ? <div className='flex justify-center text-center'><Spinner data-icon="" style={{"height":30 , marginRight:5}} className='size-6' /> <span>Loading . . .</span></div> : "Register"}</button>
             
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline cursor-pointer hover:text-blue-800"
              >
                Login
              </Link>
            </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
