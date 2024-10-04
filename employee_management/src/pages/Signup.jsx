import { Link, useNavigate } from "react-router-dom";
import Input from "../components/InputBox.jsx"
import { useForm }from "react-hook-form"
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import Logo from '../components/Logo.jsx'
import axios from "axios"

const Signup = () => {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");


  useEffect(()=>{
    if(localStorage.getItem("token")){
      navigate("/dashboard")
    }
  },[])
  const onSubmit =async (data) => {
    try {
        setLoading(true);
        const response  = await axios.post('http://localhost:8000/api/v1/user/register',data)
        console.log(response.data);
        navigate("/login");
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error?.response?.data?.message);
    }
  }

  return (
   <div
    className='flex items-center justify-center w-full h-screen'
    >
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <h2 className="text-2xl font-bold text-center mb-3">Employee Managemet System</h2>

        <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Create an account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Log In
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
            <div className='space-y-5'>
                <Input
                label="Name: "
                placeholder="Enter your email"
                type="text"
                {...register("name", {
                    required: true,
                })}
                />
                {errors?.name?.type === "required" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">This field is required</p>}
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        Pattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                {errors?.email?.type === "required" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">This field is required</p>}
                {errors?.email?.type === "Pattern" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">{errors?.email?.message}</p>}
                {errors?.email?.type === "validate" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">{errors?.email?.message}</p>}
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true, minLength: 8, maxLength: 20
                })}
                />
                {errors?.password?.type === "required" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">This field is required</p>}
                {errors?.password?.type === "minLength" && <p className="text-red-400 text-sm ml-2 before:content-['⚠']">Password must be at least 8 characters</p>}
                <Button
                type="submit"
                className="w-full"
                >{!loading ? "Sign in" : "Loading..."}</Button>
            </div>
        </form>
        </div>
    </div>
  
  )
}

export default Signup
