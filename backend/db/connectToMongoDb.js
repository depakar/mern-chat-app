import mongoose from 'mongoose';

const connectToMongoDB =async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI,)
        console.log("connect to mongo db")
    }catch (error){
        console.log("error to connect the mongodb")
    }


}
export default connectToMongoDB