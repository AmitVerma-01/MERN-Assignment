import { Link, useNavigate } from "react-router-dom"
import EmployeeCard from "../components/EmployeeCard"
import { useEffect, useState } from "react"
import Button from "../components/Button"
import logo from "../assets/employee-svgrepo-com.svg"
import axios from "axios"

const Dashboard = () => {
  const [employeeDetails, setEmployeeDetails] = useState([{
    name: "Demo",
    email: "Demo@gmail.com",
    mobileNumber: "7081051126",
    designation: "HR", 
    avatar: "",
    gender: "male",
    course: "MCA",
    createdAt: new Date().toLocaleDateString() 
  }])
  const [user, setUser] = useState({})
  const [type, setType] = useState("name") // Default to "name" for search type
  const [searchValue, setSearchValue] = useState("") 
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState([])

  const fetchEmployeeDetails = async () => {
    const response = await fetch('http://localhost:8000/api/v1/employee', {
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    })
    const counts = await axios.get('http://localhost:8000/api/v1/employee/count', {
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    })
    console.log("counts",counts.data.data);
    setEmployeeCount(counts.data?.data)
    const data = await response.json()

    setEmployeeDetails(data.data)
  }

  useEffect(() => {
    // Check for token validity and user
    if (localStorage.getItem("token")?.length < 20) {
      navigate("/login")
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/login")
    }

   
    fetchEmployeeDetails()
  }, [navigate])

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchValue(value); 

    // Fetch data based on type and search value
    const response = await fetch(`http://localhost:8000/api/v1/employee/search?type=${type}&value=${value}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    })
    const data = await response.json()
    // console.log(data);

    setEmployeeDetails(data.data)
  }

  const handleType = (e) => {
    setType(e.target.value);
  }

  const handleDelete = async (id) => {
    
    await axios.delete(`http://localhost:8000/api/v1/employee/${id}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    })

    fetchEmployeeDetails()
  }

  const handleEdit =  (id) => {
    navigate(`/update-employee/${id}`)
  }
  return (
    <div>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="#">
          <img src={logo} alt="LOGO" className="w-12" />
          <span className="sr-only">Empoloyee Management</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 px-4 py-2" to="/">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 px-4 py-2" to="#employees">
            Employees List
          </Link>
          <Link className="text-sm font-medium px-4 py-2" to="#">
            {user?.name || "Profile"}
          </Link>
          <Button className="text-sm font-medium hover:bg-blue-700" onClick={() => {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            navigate("/login")
          }}>
            Logout
          </Button>
        </nav>
      </header>

      <main className="p-4 lg:p-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Employee Management Dashboard</h1>
          <Button onClick={()=> navigate('/add-employee')}><span className="font-bold text-xl">+</span> Add Employee</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-5">
          <EmployeeCard Label="Total Employees" value={employeeCount.totalCount} />
          <EmployeeCard Label="Manager" value={employeeCount["Manager"] ? employeeCount["Manager"] : 0} />
          <EmployeeCard Label="HR" value={employeeCount["HR"] ? employeeCount["HR"] : 0} />
          <EmployeeCard Label="Sales" value={employeeCount['Sales'] ? employeeCount["Sales"] : 0} />
        </div>

        <section>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Employees List</h2>
            <div className="w-1/2">
              <div className="flex gap-2 items-center mb-1">
                <label htmlFor="name">Search type: </label>
                <label htmlFor="name">Name: </label>
                <input type="radio" name="searchType" value="name" onChange={handleType} defaultChecked />
                <label htmlFor="email">Email: </label>
                <input type="radio" name="searchType" value="email" onChange={handleType} />
                <label htmlFor="number">Number: </label>
                <input type="radio" name="searchType" value="mobileNumber" onChange={handleType} />
                <label htmlFor="designation">Designation: </label>
                <input type="radio" name="searchType" value="designation" onChange={handleType} />
                <label htmlFor="course">Course: </label>
                <input type="radio" name="searchType" value="course" onChange={handleType} />
              </div>

              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Search"
                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full"
              />
            </div>
          </div>

          <div>
            <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden mt-5">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">ID</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Image</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Email</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Mobile</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Designation</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Course</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Created At</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  employeeDetails?.length > 0 &&
                  employeeDetails?.map((employee, i) => (
                    <tr key={employee._id}>
                      <td className="px-4 py-2 border-b border-gray-300">{i + 1}</td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        <img src={employee.avatar || "https://via.placeholder.com/150"} alt="employee" className="w-10 h-10 object-cover rounded-full" />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">{employee.name}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{employee.email}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{employee.mobileNumber}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{employee.designation}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{employee.course}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{new Date(employee.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        <div className="flex gap-2">
                          <button className="text-blue-500 hover:text-blue-700 inline-block" onClick={()=>handleEdit(employee._id)}>Edit</button>
                          <button className="text-red-500 hover:text-red-700 inline-block" onClick={() => handleDelete(employee._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
