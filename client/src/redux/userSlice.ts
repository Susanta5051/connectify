import { createSlice , createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "@/contexts/UserContext";
import type { IContacts, IOtherUser, IUser } from "@/types/UserType";
import {toast} from 'react-toastify'
import  type {IUpdateData} from '../pages/UpdateProfile'
import type { RegisterType } from "@/pages/RegisterPage";
import type { LoginType } from "@/pages/LoginPage";
axios.defaults.withCredentials= true;

interface UserState {
  user: IUser | null;
  loading: boolean;
  selectedContact:IOtherUser | null;
  searchValue: string;
  searchedContact: any | null;
  contacts: IContacts[]|null;
  onlineUsers:string[]|null
}
// Async thunk
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {

      const response = await axios.get(
        `${backendUrl}/user/checkAuth`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.user;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);


export const login = createAsyncThunk(
  "user/login",
  async ( formData:LoginType , {rejectWithValue})=>{
    try {
      console.log(backendUrl) 
      const response = await axios.post(`${backendUrl}/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message)
      console.log(response)
      return response.data.user;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data.message)
      rejectWithValue(error.response?.data.message);
    } 
  }
)

export const update = createAsyncThunk(
  "user/update",
  async(formData:FormData , {rejectWithValue})=>{
    try{
      const response = await axios.patch(`${backendUrl}/user/update-profile` , formData , {headers :{ "Content-Type" : "multipart/form-data"}})
      toast.success(response.data.message)
      return response.data.user;
    }catch(error:any){
      console.log(error);
      toast.error(error.response?.data?.message)
      rejectWithValue(error.response?.data?.message) 
    }
  }
)

export const register = createAsyncThunk(
  "user/register",
  async (formData:RegisterType , {rejectWithValue})=>{
    try{
      const response = await axios.post(
            `${backendUrl}/user/register`,
            formData,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        return response.data.user;
    }catch(error:any){
      console.log(error)
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
      rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  }
)
export const logout = createAsyncThunk( 
  "user/logout",
  async(_, { rejectWithValue })=>{
    try{
      const response = await axios.post(
        `${backendUrl}/user/logout`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Logged out Successfully🎉")
    }
    catch(error:any){
      console.log(error)
      return rejectWithValue("logout failed")
    }
  }
)


export const searchContact = createAsyncThunk(
  "state.searchContact",
  async(searchValue:string , {rejectWithValue})=>{
    try{
      const res = await axios.get(`${backendUrl}/user/search-contact` , { params :{ "search" : searchValue}})
      console.log(res)
      return res.data?.user? res.data.user:null;
    }catch(error:any){
      console.log(error)
      rejectWithValue(error.response?.data?.message)
    }
  }
)
 const initialState:UserState = {
        user:null,
        loading:false,
        selectedContact:null,
        searchValue:"",
        searchedContact:null,
        contacts:null,
        onlineUsers:null
    }

const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
      updateSearchValue : (state, action)=>{
        state.searchValue = action.payload;
      },
      updateSelectedContact : (state , action)=>{
        state.selectedContact = action.payload;
      } ,
      updateContacts: (state , action)=>{
        state.contacts = action.payload;
      },
      updateOnlineUsers:(state , action)=>{
        state.onlineUsers = action.payload;
      }
    },
    extraReducers: (builder) => {

        builder.addCase(checkAuth.pending, (state) => {
        state.loading = true;
        });

        builder.addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        });

        builder.addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;

        console.log(action.payload);
        });

        builder.addCase(login.pending , (state)=>{
          state.loading = true;
        });

        builder.addCase(login.fulfilled , (state ,action)=>{
          state.loading= false;
          state.user = action.payload;
        });

        builder.addCase(login.rejected , (state , action)=>{
          state.loading = false;
        });

        builder.addCase(update.pending , (state)=>{
          state.loading = true
        })

        builder.addCase(logout.pending , (state)=>{
          state.loading= true;
        })

        builder.addCase(logout.fulfilled, (state)=>{
          state.loading= false;
          state.user = null;
        })

        builder.addCase(logout.rejected, (state)=>{
          state.loading= false;
        })
        builder.addCase(update.fulfilled , (state , action)=>{
          state.user = action.payload;
          state.loading = false;
        })

        builder.addCase(update.rejected , (state)=>{
          state.loading = false
        });

        builder.addCase(register.pending , (state)=>{
          state.loading = true;
        })

        builder.addCase( register.fulfilled , (state , action)=>{
          state.loading = false;
          state.user = action.payload;
        })

        builder.addCase(register.rejected , (state, action)=>{
          state.loading = false;
        });

        builder.addCase(searchContact.pending, (state)=>{
          state.loading = true;
        })

        builder.addCase(searchContact.fulfilled , (state,action)=>{
          state.loading = false;
          state.searchedContact = action.payload;
        })

        builder.addCase(searchContact.rejected , (state,action)=>{
          state.loading = false;
          state.searchedContact = null;
        })  

    }

})

export const { updateSearchValue ,updateSelectedContact ,updateContacts,updateOnlineUsers} = userSlice.actions;

export default userSlice.reducer;