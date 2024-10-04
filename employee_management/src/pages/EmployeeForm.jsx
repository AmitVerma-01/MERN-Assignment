import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/InputBox.jsx";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import Select from "../components/Select.jsx";
import axios from "axios";

const EmployeeForm = () => {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { employeeId } = useParams(); // Get employeeId from route parameters
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // To handle email check errors
  const [mobileError, setMobileError] = useState(""); // To handle mobile check errors
  const [isUpdate, setIsUpdate] = useState(false); // Track if it's an update form

  // Effect to check if the user is logged in and fetch employee data if updating
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setError("Login to continue || add employee");
      navigate('/login');
    }

    if (employeeId) {
      setIsUpdate(true);
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  // Fetch employee details for updating
  const fetchEmployeeDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/employee/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      
      const { name, email, mobileNumber, designation, gender, course } = response.data.data;

      // Pre-fill the form with existing employee data
      setValue("name", name);
      setValue("email", email);
      setValue("mobileNumber", mobileNumber);
      setValue("designation", designation);
      setValue("gender", gender);
      setValue("course.BCA", course?.includes("BCA")); // Pre-check if the employee has this course
      setValue("course.MCA", course?.includes("MCA"));
      setValue("course.BSC", course?.includes("BSC"));
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch employee details");
      setLoading(false);
    }
  };

  // Handle form submission for both add and update
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('designation', data.designation);
    formData.append('gender', data.gender);
    formData.append('avatar', data.avatar?.[0]); // Assuming only one file is uploaded
    // Collect selected courses
    const selectedCourses = [];
    if (data.course?.BCA) selectedCourses.push("BCA");
    if (data.course?.MCA) selectedCourses.push("MCA");
    if (data.course?.BSC) selectedCourses.push("BSC");
    formData.append('course', selectedCourses);

    try {
      let response;
      if (isUpdate) {
        // PUT request for updating employee
        setLoading(true)
        response = await axios.put(`http://localhost:8000/api/v1/employee/update-employee/${employeeId}`, formData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setLoading(false)
      } else {
        // POST request for adding new employee
        console.log(formData);
        setLoading(true)
        response = await axios.post('http://localhost:8000/api/v1/employee/add-employee', formData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200) {
        setSuccess(true);
      }
      setLoading(false);
    } catch (error) {
        setLoading(false);
        console.log("error",error);
        
      setError(error?.response?.data?.message ||'Failed to save employee details');
    }

    setTimeout(() => setSuccess(false), 2000);
  };

  // Function to check email availability
  const checkEmail = async () => {
    const email = getValues("email");
    if (email) {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/employee/email/${email}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        
        if (!response.data?.success) {
          setEmailError("This email is already registered");
        } else {
          setEmailError("");
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailError("Error checking email");
      }
    } else {
      setEmailError(""); // Clear error if email is empty
    }
  };

  // Function to check mobile number availability
  const checkMobileNumber = async () => {
    
    const mobileNumber = getValues("mobileNumber");
    if (mobileNumber) {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/employee/mobile/${mobileNumber}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (!response.data?.success) {
          setMobileError("This mobile number is already registered");
        } else {
          setMobileError("");
        }
      } catch (error) {
        console.error("Error checking mobile number:", error);
        setMobileError("Error checking mobile number");
      }
    } else {
      setMobileError(""); // Clear error if mobile number is empty
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
        <Link to="/" className="hover:underline">Back</Link>
        <h2 className="text-center text-2xl font-bold leading-tight">{isUpdate ? "Update Employee" : "Add Employee"}</h2>
        {success && <p className="text-green-600 mt-8 text-center">Employee {isUpdate ? "updated" : "added"} successfully</p>}
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        {loading && <p className="text-center">Loading employee details...</p>}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
          <div className='space-y-5'>
            <Input label="Name: " placeholder="Enter name" type="text" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-600">Name is required</p>}
            <Input
              label="Email: "
              type="email"
              placeholder="Enter email"
              {...register("email", { required: true })}
              onBlur={checkEmail} // Check email on blur
            />
            {errors.email && <p className="text-red-600">Email is required</p>}
            {emailError && <p className="text-red-600">{emailError}</p>}
            <Input
              label="Mobile: "
              type="number"
              placeholder="Enter number"
              {...register("mobileNumber", { required: true, minLength: 10, maxLength: 10 })}
              onBlur={checkMobileNumber} // Check mobile number on blur
            />
            {errors.mobileNumber && <p className="text-red-600">Mobile number is required</p>}
            {errors.mobileNumber?.type === "minLength" && <p className="text-red-600">Mobile number should be 10 digits</p>}
            {errors.mobileNumber?.type === "maxLength" && <p className="text-red-600">Mobile number should be 10 digits</p>}
            {mobileError && <p className="text-red-600">{mobileError}</p>}
            <Select options={["Select Designation", "Manager", "HR", "Sales"]} defaultValue="Select Designation" label="Designation: " {...register("designation", { required: "Designation is required", validate: (value) => ["Manager", "HR", "Sales"].includes(value) || "Invalid designation" })} />
            {errors.designation && <p className="text-red-600">{errors.designation.message}</p>}
            <div id="gender" className="flex justify-between">
              <label className={`inline-block mb-1 pl-1`} htmlFor='gender'>Gender: </label>
              <div className="mr-5">
                <label htmlFor="male" className="mr-1">Male: </label>
                <input type="radio" id="male" value={"Male"} {...register("gender", { required: true })} name="gender" className="mt-1" />
                <label htmlFor="female" className="mr-1">Female: </label>
                <input type="radio" id="female" value={"Female"} {...register("gender", { required: true })} name="gender" className="mt-1" />
              </div>
              {errors.gender && <p className="text-red-600">Gender is required</p>}
            </div>
            <div>
              <h3 className="mb-1">Courses: (select only 1)</h3>
              <label htmlFor="BCA" className="mr-2">BCA</label>
              <input type="checkbox" id="BCA" {...register("course.BCA")} />
              <label htmlFor="MCA" className="mr-2">MCA</label>
              <input type="checkbox" id="MCA" {...register("course.MCA")} />
              <label htmlFor="BSC" className="mr-2">BSC</label>
              <input type="checkbox" id="BSC" {...register("course.BSC")} />
            </div>
            <div className="mb-5">
              <label htmlFor="avatar" className="mb-1">Upload Avatar: </label>
              <input type="file" id="avatar" accept="image/*" {...register("avatar")} />
            </div>
            <Button type="submit">{loading ? "Loading..." : (isUpdate ? "Update Employee" : "Add Employee")}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
