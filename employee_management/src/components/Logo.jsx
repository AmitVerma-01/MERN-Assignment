
import logo from '../assets/employee-svgrepo-com.svg'

function Logo({width = '100px'}) {
  return (
    <div>
      <img src={logo} alt="logo" width={width}/>
    </div>
  )
}

export default Logo