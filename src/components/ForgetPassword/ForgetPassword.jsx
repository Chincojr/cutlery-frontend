import React, { useState } from 'react'
import Notify from '../Notify/Notify'
import Loading from '../Loading/Loading'
import Logo from '../Logo/Logo';
import Input from '../Input/Input';
import { checkPasswordStrength, generateRandomString, isValidEmail } from '../../UtilityFunctions';
import { ForgetEmailMessage, ForgetPasswordErrMessage, ForgetPasswordSubmitMessage, allCookies } from '../../UtilityObjs';
import { RequestAdminEmailExist, RequestAdminModifyUserRecord, RequestEmailExist, RequestModifyUserRecord } from '../../RequestFunction';
import IconSelector from '../IconSelector/IconSelector';
import { useCookies } from 'react-cookie';

const ForgetPassword = ({admin}) => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  });
  const [emailExist, setEmailExist] = useState(false)
  const [verifyEmailAuth, setVerifyEmailAuth] = useState({
    code: "",
    state: false,
  })
  const [forget, setForget] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [err, setErr] = useState({
    email: "",
    password: "",
    code: "",
    confirmPassword: "",
  })

  const HandleInvalid =  (name,value) => {
    switch (name) {
        case "email":
            if (!isValidEmail(value)) {
                setErr({...err, [name] : ForgetPasswordErrMessage[name]})
                return true
            }    
            break;
        case "password":
            if (!value ) {
                setErr({...err, [name] : ForgetPasswordErrMessage[name]})
                return true
            }
            
            if ( !checkPasswordStrength(value)) {
                setErr({...err, [name] : ForgetPasswordErrMessage["weakPassword"]}) 
                return true
            }
            break;    
        case "confirmPassword":
            if (value !== forget.password ) {
                setErr({...err, [name] : ForgetPasswordErrMessage[name]})
                return true
            }
            break;    
        default:
            break;
    }
    setErr({...err, [name] : ""})
    return false
  }

  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setForget({
        ...forget,
        [name]: value,
    });  
    HandleInvalid(name,value)
  };

  const HandleEmailExist = async() => {

    if (!forget.email || !isValidEmail(forget.email)) {
        setNotify({
            outcome:false,
            message: ForgetEmailMessage.invalid
        })  

        setInterval(() => {
            setNotify({
                outcome:false,
                message: ""
            })   
        }, 2000);

        return;
    }

    setLoading(true);
    let verifyId = generateRandomString();
    setCookie("verify",verifyId,{path: "/", maxAge:1200})
    if (admin) {
        var doesEmailExist = await RequestAdminEmailExist(forget.email,verifyId);
    } else {
        var doesEmailExist = await RequestEmailExist(forget.email,verifyId);
    }
    setLoading(false);

    switch (doesEmailExist) {
        case 200:
            setEmailExist(true)
            setNotify({
                outcome:true,
                message: ForgetEmailMessage[doesEmailExist]
            }) 
            
            break;
        case 404:
            setNotify({
                outcome:false,
                message: ForgetEmailMessage[doesEmailExist]
            }) 
            break;
        default:
            setNotify({
                outcome:false,
                message: ForgetEmailMessage.failure
            }) 
            break;
    }

    setInterval(() => {
        setNotify({
            outcome:false,
            message: ""
        })   
    }, 3000);
  }

  const HandleArrowBack = () => {
    setVerifyEmailAuth({
        code: "",
        state: false,
    })
    setForget({
        email: "",
        password: "",
        confirmPassword: "",
    })
    setErr({
        email: "",
        password: "",
        code: "",
        confirmPassword: "",

    })
    setEmailExist(false)
  }

  const HandleOTP = (event) => {
    const { name, value } = event.target; 
    setVerifyEmailAuth({
        ...verifyEmailAuth,
        code: value
    })

    HandleInvalid(name,value)

    console.log(value);
  }

  const HandleSubmit = async() => {

    console.log("Entered sumbit");
    // check if the verifiedOTP is equal to 7 numbers
    if (verifyEmailAuth.code.length !== 7) {
        setErr({...err, code : ForgetPasswordErrMessage["code"]})
        return ;
    }

    // check if verify cookie exist
    if (!cookies.verify) {
        HandleArrowBack()
        return;
    } else {
        console.log("second entere");
        if (HandleInvalid("password",forget.password) || HandleInvalid("confirmPassword",forget.confirmPassword)) {
            return;
        }

        setLoading(true);
        if (admin) {
            var modifyUserRecord = await RequestAdminModifyUserRecord(forget.email,cookies.verify,forget.password,verifyEmailAuth.code)
        } else {
            var modifyUserRecord = await RequestModifyUserRecord(forget.email,cookies.verify,forget.password,verifyEmailAuth.code)
        }

        setLoading(false);


        switch (modifyUserRecord.status) {
            case 200:
                setNotify({
                    outcome:true,
                    message:ForgetPasswordSubmitMessage[modifyUserRecord.status]
                })   
                removeCookie("verify")
                window.location.href = "login"
                break;
            case 401:
                setNotify({
                    outcome:false,
                    message:ForgetPasswordSubmitMessage[modifyUserRecord.status]
                })   
                setErr({...err, code : ForgetPasswordErrMessage.code});
                break;
            case 404:
                HandleArrowBack()
                break;
            default:
                setNotify({
                    outcome:false,
                    message:ForgetPasswordSubmitMessage.failure
                })   
                break;
        }

        setInterval(() => {
            setNotify({
                outcome:false,
                message: ""
            })   
        }, 3000);
    }


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
            <div className="flex flex-col gap-3 overflow-auto w-full max-w-[350px] justify- ">

                {
                    !emailExist ?
                    <>
                        <div className="font-bold w-full text-start ">Forgotten your password</div>
                        
                        <Input inputName={"email"} labelText={"Enter your email"} error={err.email} value={forget.email} handleChange={HandleChange} placeholder={"Email address"} type={"text"}  /> 

                        <div className="text-white w-full text-center">
                            <button onClick={HandleEmailExist} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Next</button>
                        </div>
                        <div className=" text-[12px] py-2 text-center">
                            Already have an account
                            <a href='/login' className="pl-1 underline">
                                Login
                            </a>
                        </div>                    
                    </>
                    : !verifyEmailAuth.state ?
                    <div className="flex flex-col gap-2 overflow-auto w-full max-w-[350px] justify- ">
                        <button onClick={HandleArrowBack} className="outline-none">
                            <IconSelector type={"Arrow"} />
                        </button>
                       
                        <div className="font-bold w-full text-start ">Enter OTP sent to this email address <span className="primaryText"> {forget.email} </span></div>
                        <div className='px-2 flex flex-col gap-2'>

                            <Input inputName={"code"} labelText={"Verification Code"} error={err["code"]} value={verifyEmailAuth["code"]} handleChange={HandleOTP} placeholder={"Enter verfication code"} type={"number"}  /> 

                            <Input inputName={"password"} labelText={"Enter new pasword"} error={err.password} value={forget.password} handleChange={HandleChange} placeholder={"New password"} type={"password"}  /> 

                            <Input inputName={"confirmPassword"} labelText={"Confirm new pasword"} error={err.confirmPassword} value={forget.confirmPassword} handleChange={HandleChange} placeholder={"confirm password"} type={"password"}  /> 

                            <div className="text-white w-full text-center">
                                <button onClick={HandleSubmit} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Reset</button>
                            </div>
                        </div>
                    </div>
                    : <></>
                }   

            </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading} />

        </div>
    </div>
  )
}

export default ForgetPassword