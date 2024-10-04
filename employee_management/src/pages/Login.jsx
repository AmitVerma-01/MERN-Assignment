import { Link, useNavigate } from "react-router-dom";
import Input from "../components/InputBox.jsx"
import { useForm }from "react-hook-form"
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import Logo from '../components/Logo.jsx'
import axios from "axios";
const Login = () => {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem("token")){
      navigate("/dashboard")
    }
  },[])
  const onSubmit = async(data) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/v1/user/login", data);
      if(response.status === 200) {
        console.log(response.data);
        
        localStorage.setItem("user", JSON.stringify(response.data?.data?.user));
        localStorage.setItem("token", `Bearer ${response.data?.data?.token}`);
        
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message);
    }
    setLoading(false);
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
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
            <div className='space-y-5'>
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
                {errors.email && <p className="text-red-600 before:content-['⚠']">{errors.email.message}</p>}
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true, minLength: 8, maxLength: 20
                })}
                />
                {errors.password && <p className="text-red-600 before:content-['⚠']">This field is required</p>}
                {errors.password && <p className="text-red-600 before:content-['⚠']">Password must be at least 8 characters</p>}
                <Button
                type="submit"
                className="w-full"
                >{loading ? "Loading..." : "Login"}</Button>
            </div>
        </form>
        </div>
    </div>
  
  )
}

export default Login
