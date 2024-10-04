import Dashboard from './pages/Dashboard'
import EmployeeForm from './pages/EmployeeForm'
import Login from './pages/Login'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Signup from './pages/Signup'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/add-employee' element={<EmployeeForm/>}/>
          <Route path='/update-employee/:employeeId' element={<EmployeeForm/>}/>

      </Routes>

    </BrowserRouter>
  )
}

export default App
