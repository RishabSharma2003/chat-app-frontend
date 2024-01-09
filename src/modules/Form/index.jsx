import React, { useState } from 'react'
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';

const From = ({isSignInPage=false}) => {
    const [data,setData]=useState({
        ...(!isSignInPage&&{
            fullName:''
        }),
        email:'',
        password:''
    })
    const navigate=useNavigate()
    //console.log(data);
    const handleSubmit=async(e)=>{
      console.log(data);
      e.preventDefault()
      const res = await fetch(`https://chat-app-backened.vercel.app/api/${isSignInPage ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if(res.status===400){
        alert('invalid credentials')
      }else{
        const resData=await res.json()
        if(resData.token){
          localStorage.setItem('user:token',resData.token)
          localStorage.setItem('user:detail',JSON.stringify(resData.user))
          navigate('/')
        }
      }
    }
  return (<div className="bg-light h-screen flex items-center justify-center">
    <div className="bg-white w-[450px] h-[600px] border shadow-lg rounded-lg flex flex-col justify-center items-center">
      <div className="text-5xl font-bold tracking-tight">Welcome {isSignInPage&&'Back'}</div>
      <div className="text-2xl font-light mb-14">{isSignInPage?'Sign in to get explored':'Sign up to get Started'}</div>

        <form className="flex flex-col w-full items-center content-center" onSubmit={(e)=>handleSubmit(e)}>
            {!isSignInPage && <Input label="Full name" name="name" placeholder="Enter your full Name" className="mb-6" value={data.fullName} onChange={(e)=>setData({...data,fullName:e.target.value})}/>}
            <Input label="Email address" name="email" placeholder="Enter your Email address" className="mb-6" value={data.email} onChange={(e)=>setData({...data,email:e.target.value})}/>  
            <Input label="Password" name="password" type="password" placeholder="Enter your Password" className="mb-12" value={data.password} onChange={(e)=>setData({...data,password:e.target.value})}/> 
            <Button label={ isSignInPage ? "Sign-in" : "Sign-up"} type="submit" className="mb-2"/>
        </form>

      <div>{isSignInPage?"Didn't have an account ":"Already have an account? "}<span className="text-primary cursor-pointer underline" onClick={()=>navigate(`/users/${isSignInPage?'sign_up':'sign_in'}`)}>{ isSignInPage?'Sign up':'Sign in'}</span> </div>
    </div>
  </div>)
}

export default From
