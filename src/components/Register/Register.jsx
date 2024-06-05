import React, { useState } from 'react'
import Input from '../Input/Input'
import { RegisterFormErrMessage, VerifyCodeMessage,allCookies,RegisterFormFormat, RegisterSubmitMessage } from '../../UtilityObjs'
import Notify from '../Notify/Notify'
import { checkPasswordStrength, generateRandomString , isValidEmail} from '../../UtilityFunctions'
import { useCookies } from 'react-cookie'
import Loading from '../Loading/Loading'
import Logo from '../Logo/Logo'
import InputPhoneNumber from '../Input/InputPhoneNumber'
import IconSelector from '../IconSelector/IconSelector'
import { RequestCheckEmailUniqueness, RequestForVerificationCode, RequestRegisterUser } from '../../RequestFunction'


const Register = () => {

  const [loading, setLoading] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [verify, setVerify] = useState({
    disabled : false,
    code : ""
  })
  const [signUpFormComplete, setSignUpFormComplete] = useState(false)
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber:"",
  })

  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber:"",
    code : "",
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
            if ( !checkPasswordStrength(value)) {
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

  const HandleUserSignUpForm =  async() => {
    try {
        // check if the inputs ar valid
        for (let key in registerInfo) {
            let isInputInvalid = HandleInvalid(key,registerInfo[key])
            if (isInputInvalid) {
                console.log("Input is invalid : ",key,isInputInvalid);
                return;
            }
        }

        // check if the email as not been used
        setLoading(true)
        let checkIfEmailHasBeenUsed = await RequestCheckEmailUniqueness(registerInfo.email)
        setLoading(false)
        if (!checkIfEmailHasBeenUsed) {
            setErr({...err, email : RegisterFormErrMessage["emailAlreadyExist"]})
            return ;
        }
        setSignUpFormComplete(true)
        console.log(registerInfo)         
    } catch (error) {
        console.log("Error from sign-up");
    }

  }

    const HandleSendCode = async () => {

        setVerify({...verify,disabled:true})
        let verifyId = generateRandomString();
        setCookie("verify",verifyId,{path: "/", maxAge:1200})
        setLoading(true)
        let sentCode = await RequestForVerificationCode(verifyId,registerInfo.email)
        setLoading(false)
        

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
        }, 3000);

        setVerify({...verify,disabled:false})

    }

    const verifyOTP = async (event) => {

        const value =  event.target.value
        const name =  event.target.name

        setVerify({...verify, [name]: value})

        console.log(name,value);

        // if OTP is not equal to 7 then display error
        if ( value.length !== 7 ) {
            setErr({...err, [name] : RegisterFormErrMessage[name]})
            return 
        }

        // if OTP is equal to 7  check if it is valid
        if (value.length === 7 ) {

            // clear error message
            setErr({...err, [name] : ""})

            // if verifyID is false then any OTP is invalid
            if (!cookies.verify) {
                setErr({
                    ...err,
                    code: RegisterFormErrMessage.code
                }) 
                return;
            }
    
            // provided their is a valid verifyId
            setLoading(true)       
            let isCodeValid = await RequestRegisterUser(cookies.verify,value,registerInfo)
            setLoading(false)       

            // console.log(isCodeValid,'this is validate Code');
            
            switch (isCodeValid.status) {
                case 200:                    
                    setNotify({
                        outcome: true,
                        message: RegisterSubmitMessage[isCodeValid.status]
                    })
                    removeCookie("verify")
                    setCookie("log",isCodeValid.data.log,{path: "/", maxAge:604800})
                    setCookie("uid",isCodeValid.data.id,{path: "/", maxAge:604800})
                    window.location.href = "/"
                    break;
                case 500:
                    setNotify({
                        outcome: false,
                        message: RegisterSubmitMessage[isCodeValid.status]
                    })
                    break;
                case 401:
                    setNotify({
                        outcome: false,
                        message: RegisterSubmitMessage[isCodeValid.status]
                    })
                    setErr({...err,code:RegisterSubmitMessage[isCodeValid.status]})
                    break;
                default:
                    setNotify({
                        outcome: false,
                        message: RegisterSubmitMessage["failure"]
                    })
                    break;
            }

            setInterval(() => {
                setNotify({
                    outcome:false,
                    message: ""
                })
            }, 2000);

            
            return 
        }
    }
    const HandleArrowBack = () => {
        setSignUpFormComplete(false)
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
            {
                !signUpFormComplete ? (
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
                            <button onClick={HandleUserSignUpForm} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Sign up</button>
                        </div>
                    </div>
                    
                ) : (
                    <div className="flex flex-col gap-2 overflow-auto w-full max-w-[350px] justify- ">
                        <button onClick={HandleArrowBack} className="outline-none">
                            <IconSelector type={"Arrow"} />
                        </button>
                       
                        <div className="font-bold w-full text-start ">Enter OTP sent to this email address {registerInfo.email}</div>
                        <div className='px-2'>
                            <Input inputName={"code"} labelText={"Verification Code"} error={err["code"]} value={verify["code"]} handleChange={verifyOTP} placeholder={"Enter verfication code"} type={"text"}  /> 
                            <div className="flex justify-end ">
                                <button disabled={verify.disabled ? true : false} onClick={HandleSendCode} className={` ${verify.disabled ? "hidden" : ""} text-[12px] primaryText `}>Send Code</button>
                            </div>
                        </div>
                        {/* <div className="text-white w-full text-center">
                            <button onClick={HandleCreated} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Verify</button>
                        </div> */}
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
