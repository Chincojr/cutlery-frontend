import React, { useState } from 'react'
import Input from './Input/Input'
import { RegisterFormErrMessage, VerifyCodeMessage,allCookies,RegisterFormFormat, RegisterSubmitMessage } from '../UtilityObjs'
import Notify from './Notify'
import { checkPasswordStrength, generateRandomString , isValidEmail} from '../UtilityFunctions'
import { useCookies } from 'react-cookie'
import Loading from './Loading'
import Logo from './Logo'
import InputPhoneNumber from './Input/InputPhoneNumber'
import IconSelector from './IconSelector'
import { RequestCheckEmailUniqueness, RequestForVerificationCode, RequestRegisterUser } from '../RequestFunction'


const Register = () => {

  /**
   * Loading state to indicate if an operation is in progress.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Hook for managing cookies.
   * @type {Array}
   */
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  /**
   * State for verification code and its disabled status.
   * @type {Object}
   * @property {boolean} disabled - Indicates if verification is disabled.
   * @property {string} code - Verification code.
   */
  const [verify, setVerify] = useState({
    disabled: false,
    code: ""
  });

  /**
   * State to track if the sign-up form is complete.
   * @type {boolean}
   */
  const [signUpFormComplete, setSignUpFormComplete] = useState(false);

  /**
   * State to store user registration information.
   * @type {Object}
   * @property {string} name - User's name.
   * @property {string} email - User's email.
   * @property {string} password - User's password.
   * @property {string} phoneNumber - User's phone number.
   */
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  /**
   * State to store error messages for registration fields.
   * @type {Object}
   * @property {string} name - Error message for name.
   * @property {string} email - Error message for email.
   * @property {string} password - Error message for password.
   * @property {string} phoneNumber - Error message for phone number.
   * @property {string} code - Error message for verification code.
   */
  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    code: ""
  });

  /**
   * State for notification messages.
   * @type {Object}
   * @property {boolean|null} outcome - Outcome of the notification.
   * @property {string} message - Notification message.
   */
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  });

/**
 * Validates the input value for a given field name and updates the error state.
 * 
 * Checks the validity of the input value based on the field name. If the value
 * is invalid, it sets the appropriate error message in the error state and returns true.
 * Otherwise, it clears any existing error message and returns false.
 * 
 * @param {string} name - The name of the field to validate.
 * @param {string} value - The value of the field to validate.
 * @returns {boolean} - True if the input is invalid, false otherwise.
 */
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


    /**
     * Handles the change event of an input field. Updates the register information
     * state with the new value of the input field. Calls the `HandleInvalid` function
     * to check if the field is invalid and updates the error state accordingly.
     * @param {object} event - The event object triggered by the input field.
     */
    const HandleChange = (event) => {
        const { name, value } = event.target; 
        setRegisterInfo({
            ...registerInfo,
            [name]: value,
        });  
        HandleInvalid(name,value)
    };

    /**
     * Handles the user sign-up form submission.
     *
     * Validates the registration information to ensure all inputs are correct.
     * If any input is invalid, it logs the error and stops the process.
     * Checks the uniqueness of the email; if already used, sets an error message.
     * Sets the sign-up form as complete if all checks pass.
     * Logs the registration information for debugging.
     * Catches and logs any errors during the sign-up process.
     */
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

    /**
     * Handles the submission of the verification code form.
     *
     * Disables the "Send Code" button during the verification process.
     * Generates a random string and saves it as a cookie named "verify" with a max age of 20 minutes.
     * Calls the `RequestForVerificationCode` function to request a verification code to be sent to the user's email.
     * Enables the "Send Code" button after the verification process is complete.
     * Sets a notification of success or failure of the verification process.
     * Removes the notification after 3 seconds.
     */
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

    /**
     * Handles the OTP verification process.
     *
     * Updates the `verify` state based on the input field's name and value.
     * Logs the name and value of the input field.
     * Displays an error if the OTP length is not equal to 7.
     * Clears any existing error if the OTP length is valid and proceeds to check OTP validity.
     * Checks if there's a valid `verifyId` cookie before proceeding with OTP validation.
     * Invokes the `RequestRegisterUser` function to validate the OTP against the server.
     * Displays the appropriate notification and error messages based on the server's response.
     * Redirects the user to the home page on successful OTP verification.
     * Removes the `verify` cookie on a successful verification.
     * Sets a notification timeout to clear messages after 2 seconds.
     */
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
    
    /**
     * Handles the action of navigating back in the registration process.
     * 
     * Sets the sign-up form completion state to false, allowing the user
     * to return to the previous step in the registration form.
     */
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
