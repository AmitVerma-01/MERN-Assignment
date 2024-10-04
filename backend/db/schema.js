import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// User model
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        required : [true , "Email is required"]
    },
    password: {
        type : String,
        required : [true , "Password is required"]
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        name : this.name
    },
    process.env.ACCESS_TOKEN_SECRET
    );
}

const User = mongoose.model("User", userSchema);

// Employee Model
const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type : String,
        trim : true,
        unique : true,
        required : [true , "Email is required"]
    },
    mobileNumber: {
        type : Number,
        unique : true,
        trim : true,
        required : [true , "Mobile number is required"]
    },
    designation: {
        type : String,
        enum : ["HR", "Manager", "Sales"],
        required : [true , "Designation is required"]
    },
    gender: {
        type : String,
        enum : ["Male", "Female"],
        required : [true , "Gender is required"]
    },
    course: {
        type : String,
        enum : ["MCA", "BCA", "BSC"],
        required : [true , "Course is required"]
    },
    avatar: {
        type : String,
        required : [true , "Avatar is required"]
    }
}, {
    timestamps: true
});

const Employee = mongoose.model("Employee", employeeSchema);


export { User, Employee };
