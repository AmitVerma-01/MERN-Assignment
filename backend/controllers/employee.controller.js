import { Employee } from "../db/schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllEmployees = asyncHandler(
    async (req, res) => {

        const employees = await Employee.find();
        if(!employees) {
            throw new ApiError(400, "No employees found");
        } 

        return res.status(200).json( new ApiResponse(200, employees, "Employees fetched successfully") );
    }
)

const getEmployeeCount = asyncHandler(
    async (req, res) => {
        let data = {}
        const count = await Employee.aggregate([
            {
                $facet: {
                  designationCount: [
                    {
                      $group: {
                        _id: "$designation",           // Group by the designation field
                        count: { $sum: 1 }            // Count the number of employees in each designation
                      }
                    },
                    {
                      $project: {
                        _id: 0,                       // Exclude the default _id from the output
                        designation: "$_id",          // Rename _id to designation for better readability
                        count: 1                      // Include the count in the output
                      }
                    }
                  ],
                  totalCount: [
                    {
                      $count: "count"               // Count total documents in the collection
                    }
                  ]
                }
              },
              {
                $project: {
                  designationCount: 1,             // Include the designation count result
                  totalCount: { $arrayElemAt: ["$totalCount.count", 0] } // Get total count from the totalCount facet
                }
              }
          ])
          console.log(count);

          if(count) {
            data["totalCount"] = count[0].totalCount;
            count[0].designationCount.forEach((item) => {
              data[item.designation] = item.count;
            })
          }
          
        return res.status(200).json( new ApiResponse(200, {...data}, "Employee count fetched successfully") );
    }
)

const addEmployee = asyncHandler(
    async (req, res) => {
        const  { name, email, mobileNumber, designation, gender,course } = req.body;
        console.log(req.file)
        const avatar = req.file?.path;
        
        if([name, email, mobileNumber, designation, gender].some( field => field?.trim() === "" )) {    
            throw new ApiError(400, "All fields are required");
        }
        if(!course){
            throw new ApiError(400, "Course is required");
        }
        const isEmployeeExist = await Employee.findOne({email});
        if(isEmployeeExist) {
            throw new ApiError(400, "Employee already exist");
        }
        if(!avatar) {
            throw new ApiError(400, "Image is required");
        }

        const uploadedImage = await uploadOnCloudinary(avatar);
        console.log(uploadedImage);
        
        if(!uploadedImage) {
            throw new ApiError(500, "Failed to upload image");
        }

        const employee = await Employee.create({name, email, mobileNumber, designation, gender, course, avatar : uploadedImage.url});

        if(!employee) {
            throw new ApiError(500, "Failed to create employee ||Something went wrong");
        }

        return res.status(200).json( new ApiResponse(200, employee, "Employee created successfully") );
    }
)



const getEmployee = asyncHandler(   
    async (req, res) => {
        const employee = await Employee.findById(req.params.id);
        if(!employee) {
            throw new ApiError(400, "Employee not found");
        }
        return res.status(200).json( new ApiResponse(200, employee, "Employee fetched successfully"));
    }
)


const updateEmployee = asyncHandler(
    async (req, res) => {
        const  { name, email, mobileNumber, designation, gender,course } = req.body;
        const avatar = req.file?.path;
        
        if([name, email, mobileNumber, designation, gender, course].some( field => field?.trim() === "" )) {    
            throw new ApiError(400, "All fields are required");
        }
        let details = {name, email, mobileNumber, designation, gender, course};
        if(avatar) {
            const uploadedImage = await uploadOnCloudinary(avatar);
            if(!uploadedImage) {
                throw new ApiError(500, "Failed to upload image");
            }
            details.avatar = updateAvatar.url;
        }



        const employee = await Employee.findByIdAndUpdate(req.params.employeeId, details, {new : true});
        if(!employee) {
            throw new ApiError(500, "Failed to update employee ||Something went wrong");
        }

        return res.status(200).json( new ApiResponse(200, employee, "Employee updated successfully") );
    }   
)


const searchEmployee = asyncHandler(
    async (req, res) => {
        const {type, value} = req.query;
        console.log({type, value});
        const searchQuery = {}

        const types = ["name","email","mobileNumber","designation","gender","course"];
        
        if(types.includes(type) && value) {
            searchQuery[type] = {$regex : value, $options : "i"} 
        }

        const employees = await Employee.find(searchQuery);
        if(!employees) {
            throw new ApiError(400, "No employees found");
        }
        return res.status(200).json( new ApiResponse(200, employees, "Employees fetched successfully") );
    }
)

const updateAvatar = asyncHandler(
    async (req, res) => {
        const employee = await Employee.findByIdAndUpdate(req.params.id, {avatar : req.file?.path}, {new : true});
        if(!employee) {
            throw new ApiError(500, "Failed to update employee ||Something went wrong");
        }
        return res.status(200).json( new ApiResponse(200, employee, "Employee updated successfully") );
    }
)

const checkNumberExistance = asyncHandler(
    async (req, res) => {
        const employee = await Employee.findOne({mobileNumber : req.params.mobileNumber});
        if(!employee) {
            return res.status(200).json( new ApiResponse(200, true, "Mobile number does not exist") );
        }

        return res.status(200).json( new ApiResponse(405, false, "Mobile number exists"));
    }
)
const checkEmailExistance = asyncHandler(
    async (req, res) => {
        console.log(req.params.email);
        
        const employee = await Employee.findOne({email : req.params.email});
        if(!employee) {
            return res.status(200).json( new ApiResponse(200, true, "Email does not exist") );
        }
        return res.status(200).json( new ApiResponse(405, false, "Email id already exists"));
    }
)


const deleteEmployee = asyncHandler(
    async (req, res) => {
        console.log(req.params.id);
        
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if(!employee) {
            throw new ApiError(400, "Employee not found");
        }
        return res.status(200).json( new ApiResponse(200, employee, "Employee deleted successfully") );
    }
)

export {getAllEmployees, addEmployee, getEmployee, updateEmployee, searchEmployee, updateAvatar, checkEmailExistance, checkNumberExistance, deleteEmployee, getEmployeeCount}  