import React, { useState } from 'react'
import Notify from './Notify'
import { LoginFormErrMessage, LoginFormFormat, allCookies, notificationTimeout } from '../UtilityObjs'
import Input from './Input/Input'
import { useCookies } from 'react-cookie'
import Loading from './Loading'
import Logo from './Logo'
import { isValidEmail} from '../UtilityFunctions'
import { RequestUserLogin } from '../RequestFunction'

const LoginSubmitMessage = {
  200 : "Login successful",
  failure : "Server Error",
  401 : "Invalid username or password"
}



const Login = ({type}) => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [loading, setLoading] = useState(false)


  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  })

  const [err, setErr] = useState({
    email: "",
    password: ""
  })

  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  })

  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setLoginInfo({
        ...loginInfo,
        [name]: value,
    });  
    HandleInvalid(name,value)
  };

  const HandleInvalid =  (name,value) => {
    switch (name) {
        case "email":
            if (!isValidEmail(value)) {
                setErr({...err, [name] : LoginFormErrMessage[name]})
                return true
            }    
            break;
        case "password":
            if (!value ) {
                setErr({...err, [name] : LoginFormErrMessage[name]})
                return true
            }
            break;    
        default:
            return false
            break;
    }
    setErr({...err, [name] : ""})
    return false
}

const HandleLogin = async () => {

  // check if the input is valid
  for (let key in loginInfo) {
      let formValueTest = HandleInvalid(key,loginInfo[key])
      if (formValueTest) {
        console.log(key,formValueTest);
        return;
      }
  }

  // verify the input
  setLoading(true)
  let verifyLoginInfo = await RequestUserLogin(loginInfo.email,loginInfo.password,type)
  console.log("Verify Login Info: ", verifyLoginInfo);  
  setLoading(false)

  switch (verifyLoginInfo.status) {
      case 200:      
        setNotify({
            outcome: true,
            message: LoginSubmitMessage[verifyLoginInfo.status]
        })
        localStorage.setItem('token',verifyLoginInfo.data.token)
        setCookie('uid',verifyLoginInfo.data.uid,{path: "/", maxAge:864000})  
        setCookie('type',verifyLoginInfo.data.type,{path: "/", maxAge:864000})  
        window.location.href = "/"
        break;
    case 401:
        setNotify({
            outcome: false,
            message: LoginSubmitMessage[verifyLoginInfo.status]
        })
        setErr({...err,code:LoginSubmitMessage[verifyLoginInfo.status]})
        break;
    default:
        setNotify({
            outcome: false,
            message: LoginSubmitMessage["failure"]
        })
        break;
  }

  setTimeout(() => {
    setNotify({
        outcome: null,
        message: ""
      })
  }, notificationTimeout);

}

  return (
    <div className='absolute sm:bg-[#ecf0f1] inset-0 flex justify-center items-center px-[5%] sm:px-[10%] py-[10px] overflow-hidden'>
        <div className="bg-white rounded flex flex-col overflow-hidden h-fit py-4 w-full max-w-[500px] items-center gap-2 justify-center  ">
            <div className="max-w-[350px] w-full flex items-center flex-col gap-2 ">
                <div className="w-[100px] ">
                  <a href="/" className="">
                      <Logo />
                  </a>
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-auto w-full max-w-[350px] justify- ">
              <div className="font-bold w-full text-start ">Login to your Account</div>
                {
                  LoginFormFormat.map((obj,index) => {
                    return (
                        <div key={index} className='px-2' >
                          <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={loginInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                        </div>
                    )
                  })
                }
                <div className="flex justify-end">
                  <a href={`${type ? "/admin/forget-password" : "/forget-password"}`} className="underline lowercase text-[12px] px-2 text-end w-fit">
                      Forget Password
                  </a>  
                </div>
              
                <div className="text-white w-full text-center">
                    <button onClick={HandleLogin} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Sign in</button>
                </div>
                <div className=" text-[12px] py-2 text-center">
                    Do not have an account
                    <a href='/register' className="pl-1 underline">
                        Register
                    </a>
                </div>                
            </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading} />

        </div>
    </div>
  )
}

export default Login