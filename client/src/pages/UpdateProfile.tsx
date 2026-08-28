

import type { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {   data, useNavigate } from 'react-router-dom';
import avatar from "../assets/avatar_icon.png"
import {update} from '../redux/userSlice'
import { Spinner } from '@/components/ui/spinner';

export interface IUpdateData{
    image:File|null,
    bio:string,
    fullName:string
}

const UpdateProfile = () => {

    const [formData , setFormData] = useState<IUpdateData>({
        image:null,
        bio:"",
        fullName:""
    });

    const [errorData , setErrorData] = useState<IUpdateData>({
        image:null,
        bio:"",
        fullName:""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    const {user , loading } = useSelector((state:RootState)=>state)

    const submitHandler = async(e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            if(formData.fullName.length < 3){
                setErrorData((data)=>({...data, fullName : "length is too short"}))
                return
            }
            if(formData.bio.length < 3){
                setErrorData((data)=>({...data, bio : "length is too short"}))
                return
            }
            const updateData = new FormData();
            if(formData.image){
                updateData.append("profilePic" ,formData.image )
            }
            updateData.append("fullName",formData.fullName);
            updateData.append("bio", formData.bio)

            await dispatch(update(updateData)).unwrap();
            navigate(-1)
        }catch(rejectedValueOrSerializedError){
            console.log("update failed" , rejectedValueOrSerializedError);
        }
    }


    
    useEffect(()=>{
        if(!user){
            navigate("/login")
        }else{
            setFormData((data)=>({...data , fullName : user?.fullName}))
            setFormData((data)=>({...data , bio : user?.bio}))
        }
        
    },[])

  return (
    <div className='flex justify-center items-center h-screen rounded-2xl'>
      <form onSubmit={(e)=>submitHandler(e)} className='border rounded-md p-5 md:p-10 flex flex-col gap-6 backdrop-blur-lg'>
        <div>
            <img src={user?.profilePic || avatar} alt="" className='h-25 w-25 rounded-full object-cover'></img>
            <input  id="image" type='file' accept='image/*' className='border-2 p-1 rounded-sm' onChange={(e)=>setFormData((data)=>({...data , image : (e.target.files ? e.target.files[0] : null)}))}></input>
            <label htmlFor='image'></label>
        </div>
        <div>
            <p>FullName: </p>
            <input id="fullName" type='text' value={formData.fullName} className='border-2 p-1 rounded-sm ' onChange={(e)=>setFormData((data)=>({...data , fullName : e.target.value}))} ></input>
            <label htmlFor='fullName' className='text-sm text-red-700'>{errorData.fullName}</label>
        </div>

        <div>
            <p>Bio: </p>
            <input id="bio" type='text' value={formData.bio} className='border-2 p-1 rounded-sm'  onChange={(e)=>setFormData((data)=>({...data , bio : e.target.value}))} ></input>
            <label htmlFor='bio' className='text-sm text-red-700'>{errorData.bio}</label>
        </div>

        <div className='flex'>
            <button type='button' className='bg-linear-to-r from-[#ab0d0d] to-[#f24107] p-1 w-30 rounded-md text-white' onClick={()=>navigate(-1)}>Cancel</button>
        <button type={loading?"button":'submit'}  className='bg-linear-to-r  from-[#7242f5] to-[#231252] p-1 min-w-30 rounded-md text-white'  >{ loading ? <div className='flex justify-center text-center '><Spinner data-icon="" style={{ marginRight:5}} className='size-6' /> <span>Updating . . .</span></div> : "Update"}</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfile
