import {type AppDispatch, type RootState } from "@/redux/store";
import { searchContact, updateSearchValue } from "@/redux/userSlice";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
const SearchBox = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchValue = useSelector((state:RootState)=>state.searchValue)

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    dispatch(updateSearchValue(e.target.value))
    }
  const handleSubmit = async (e : React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(searchValue)
    dispatch(searchContact(searchValue))
  }
  
  return (
    
      <form className="w-9.5/10 flex justify-between  m-2 border rounded-2xl h-10 hover:scale-105 hover:translate-x-2 " onSubmit={(e)=>handleSubmit(e)}>
        <input placeholder="Search..." className="w-full p-2.5 outline-none bg-transparent" value={searchValue} onChange={(e)=>handleChange(e)}/>
        <div className="relative z-20" ><button className="absolute -left-8 h-10 " type="submit" ><SearchIcon className="h-full w-full scale-125 mt-2 " /></button></div>
      </form>
   
  );
};  

export default SearchBox;
