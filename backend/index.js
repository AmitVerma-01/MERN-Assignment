import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cors from "cors";
import userRouter from "./router/user.router.js";
import employeeRouter from "./router/employee.router.js";

dotenv.config({
    path : "/.env"
});

const app = express();



app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json());

connectDB()
.then(() => {
    app.on('error',(error)=>{
        console.log("ERR: ", error);
        throw error
    })
    app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`Server is running on PORT ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGODB connection FAILED ", err)
})


app.use('/api/v1/user',userRouter)
app.use('/api/v1/employee',employeeRouter)

// app.listen(process.env.PORT, () => {
//     console.log(`Server started on port ${process.env.PORT}`);
// })