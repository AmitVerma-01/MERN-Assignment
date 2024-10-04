import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../db/schema.js";

const registerUser =  asyncHandler( 
    async (req,res) => {
        const  { name, email, password } = req.body;

        if([name, email, password].some( field => field?.trim() === "" )) {
            throw new ApiError(400, "All fields are required");
        }

        const isUserExist = await User.findOne({email});
        if(isUserExist) {  
            return res.status(400).json( new ApiResponse(400, null, "User already exists") );
        }

        const user = await User.create({name, email, password});

        if(!user) {
            throw new ApiError(500, "Failed to create user ||Something went wrong");
        }
        
        const newUser = user.toObject();
        delete newUser.password

        return res.status(200).json( new ApiResponse(200, {user : newUser}, "User created successfully") );

    }
)



const loginUser = asyncHandler( 
    async (req,res) => {
        const { email, password } = req.body;
        if([email, password].some( field => field?.trim() === "" )) {   
            throw new ApiError(400, "All fields are required");
        }
        const user = await User.findOne({email});
        if(!user) {
            throw new ApiError(400, "User does not exist");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if(!isPasswordCorrect) {
            throw new ApiError(400, "Incorrect password");  
        }

        const token = user.generateAccessToken(user._id, user.email, user.name);
        
        const newUser = user.toObject();
        delete newUser.password

        
        return res.status(200).json( new ApiResponse(200, {user : newUser,token}, "User logged in successfully") );   

    }
)


export  { registerUser, loginUser}