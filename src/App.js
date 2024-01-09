import './App.css';
import Dashboard from './modules/Dashboard';
import From from './modules/Form';
import {Routes,Route,Navigate} from "react-router-dom"

const ProtectedRoutes=({children,auth=false})=>{
  const isLoggedIn=localStorage.getItem('user:token')!==null||false

  if(!isLoggedIn &&auth)return <Navigate to={'/users/sign_in'}/>;
  else if(isLoggedIn&&['/users/sign_in','/users/sign_up'].includes(window.location.pathname))return <Navigate to={'/'}/>;
  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoutes auth={true}>
          <Dashboard/>
        </ProtectedRoutes>
      }/>
      <Route path='/users/sign_in' element={
        <ProtectedRoutes>
          <From isSignInPage={true}/>
        </ProtectedRoutes>
      }/>
      <Route path='/users/sign_up' element={
        <ProtectedRoutes>
          <From isSignInPage={false}/>
        </ProtectedRoutes>
      }/>
    </Routes>


    // <div className="bg-[#edf3fc] h-screen flex justify-center items-center">
    //   {/* <From/> */}
    //   <Dashboard/>
    // </div>
  );
}

export default App;
