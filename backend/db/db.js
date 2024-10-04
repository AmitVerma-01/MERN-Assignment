import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path : "./.env"
});
const connectDB =async () => {
    try {
        console.log(process.env.MONGODB_URI);
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('\n MongoDB Connection Successful : ',connectionInstance.connection.name);
    }catch(err){    
        console.log("MONGODB connection error : ",err.message || err);
        process.exit(1);
    }
}

export default connectDB;