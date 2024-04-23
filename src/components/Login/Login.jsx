import React, { useState } from 'react'
import Notify from '../Notify/Notify'
import { LoginFormErrMessage, LoginFormFormat, LoginSubmitMessage, allCookies } from '../../UtilityObjs'
import Input from '../Input/Input'
// import { HandleUserLogin } from '../../RequestFunction'
import { useCookies } from 'react-cookie'
import Loading from '../Loading/Loading'
import Logo from '../Logo/Logo'
import { isValidEmail} from '../../UtilityFunctions'



const Login = () => {

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

            if ( value.length < 8 ) {
              setErr({...err, [name] : LoginFormErrMessage["weakPassword"]})
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


  let formErr = false

  for (let key in loginInfo) {
      let formValueTest = HandleInvalid(key,loginInfo[key])
      if (formValueTest) {
        formErr = true;
        console.log(key,formValueTest);
        break;
      }
  }

}

  return (
    <div className='absolute sm:bg-[#ecf0f1] inset-0 flex justify-center items-center px-[5%] sm:px-[10%] py-[10px] overflow-hidden'>
        <div className="bg-white rounded flex flex-col overflow-hidden h-fit py-4 w-full max-w-[500px] items-center gap-2 justify-center  ">
            <div className="max-w-[350px] w-full flex items-center flex-col gap-2 ">
                <div className="w-[100px] ">
                    <Logo />
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
                <div className=" text-[12px] py-2 text-center">
                    Already have an account
                    <a href='/register' className="pl-1 underline">
                        Register
                    </a>
                </div>
                <div className="text-white w-full text-center">
                    <button onClick={HandleLogin} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Sign in</button>
                </div>
            </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading} />

        </div>
    </div>
  )
}

export default Login