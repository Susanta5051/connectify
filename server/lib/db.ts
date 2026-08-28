import mongoose from 'mongoose'

const connectDB = async()=>{
await mongoose.connect(`${process.env.MONGODB_URI!}/PersonalChat`).then(()=>{
    console.log("Mongoose Connected");
}).catch((error)=>{
    console.log(error)
})}

export default connectDB