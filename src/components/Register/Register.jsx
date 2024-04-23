import React, { useState } from 'react'
import Input from '../Input/Input'
// import DatePick from '../DatePicker/DatePick'
import { RegisterFormErrMessage, RegisterSubmitMessage, VerifyCodeMessage,allCookies,RegisterFormFormat } from '../../UtilityObjs'
import Notify from '../Notify/Notify'
import { generateRandomString , isValidEmail} from '../../UtilityFunctions'
import { useCookies } from 'react-cookie'
// import { HandleSearchDoesNotExist,HandleSearchExist, HandleVerifyCode, HandleSendVerificationCode, HandleUserSignUp } from '../../RequestFunction'
import Loading from '../Loading/Loading'
import Logo from '../Logo/Logo'
import InputPhoneNumber from '../Input/InputPhoneNumber'


const Register = () => {

  const [loading, setLoading] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [verified, setVerified] = useState(false)
  const [next, setNext] = useState(true)
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    verifyCode: "",
    phoneNumber:"",
  })

  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    verifyCode: "",
    phoneNumber:"",
  })

  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  })

  const HandleInvalid =  (name,value) => {

    switch (name) {
        case "name":
            if ( value.length < 2) {
                setErr({...err, [name] : RegisterFormErrMessage[name]})
                return true
            }

            break;
        case "email":
            if (!isValidEmail(value)) {
                setErr({...err, [name] : RegisterFormErrMessage[name]})
                return true
            }

           break; 
        case "phoneNumber":
            if (!value ) {
                setErr({...err, [name] : RegisterFormErrMessage[name]})
                return true
            }
        
            break;   
        case "password":
            if (!value ) {
                setErr({...err, [name] : RegisterFormErrMessage[name]})
                return true
            }

            if ( value.length < 8 ) {
                setErr({...err, [name] : RegisterFormErrMessage["weakPassword"]})
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


  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setRegisterInfo({
        ...registerInfo,
        [name]: value,
    });  


    HandleInvalid(name,value)

  };


  const HandleCreated = async () => {

    let formErr = false

    for (let key in registerInfo) {
        let formValueTest = HandleInvalid(key,registerInfo[key])
        if (formValueTest) {
          formErr = true;
          console.log(key,formValueTest);
          return;
        }
    }
    setNext(true)
    console.log(registerInfo) 


}

const HandleSendCode = async () => {

    let sentCode = true
    
    if (sentCode) {
        setNotify({
            outcome:true,
            message: VerifyCodeMessage.success
        })
    } else {
        setNotify({
            outcome:false,
            message: VerifyCodeMessage.failure
        })
    }


    setTimeout(() => {
        setNotify({
            outcome: null,
            message: ""
          })
    }, 10000);


}

const HandleVerify = () => {
    
}


  return (
    <div className='absolute sm:bg-[#ecf0f1] inset-0 flex justify-center items-center px-[5%] sm:px-[10%] py-[10px] overflow-hidden'>
        <div className="bg-white rounded flex flex-col overflow-hidden h-fit py-4 w-full max-w-[500px] items-center gap-2 justify-center  ">
            <div className="max-w-[350px] w-full flex items-center flex-col gap-2 ">
                <div className="w-[100px] ">
                    <Logo />
                </div>
            </div>
            {
                !next ? (
                    <div className="flex flex-col gap-2 overflow-auto w-full max-w-[350px] justify- ">
                        <div className="font-bold w-full text-start ">Create your Account</div>
                        {
                            RegisterFormFormat.map((obj,index) => {
                                return (
                                    <div key={index} className='px-2' >
                                        {
                                            obj.type === "tel" ? (
                                                <>
                                                    <InputPhoneNumber inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={registerInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                                </>
                                                ) : (
                                                <>
                                                    <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={registerInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                                </>
                                                )
                                        }
                                    </div>
                                )
                            })
                        }
                        <div className=" text-[12px] py-2 text-center">
                            Already have an account
                            <a href='/login' className="pl-1 underline">
                                Log in
                            </a>
                        </div>
                        <div className="text-white w-full text-center">
                            <button onClick={HandleCreated} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Sign up</button>
                        </div>
                    </div>
                    
                ) : (
                    <div className="flex flex-col gap-2 overflow-auto w-full max-w-[350px] justify- ">
                        <div className="font-bold w-full text-start ">Enter OTP sent to this email address {registerInfo.email}</div>
                        <div className='px-2'>
                            <Input inputName={"verifyCode"} labelText={"Verification Code"} error={err["verifyCode"]} value={registerInfo["verifyCode"]} handleChange={HandleChange} placeholder={"Enter verfication code"} type={"text"}  /> 
                            <div className="flex justify-end ">
                                <button onClick={HandleSendCode} className="text-[12px] primaryText">Send Code</button>
                            </div>
                        </div>
                        <div className="text-white w-full text-center">
                                <button onClick={HandleCreated} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Verify</button>
                        </div>
                    </div>
  
                )
            }

                <Notify outcome={notify.outcome} message={notify.message} />
                <Loading loading={loading} />

        </div>
    </div>
  )
}

export default Register