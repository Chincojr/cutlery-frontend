import React, { useState } from 'react'
import Notify from './Notify'
import Loading from './Loading'
import Logo from './Logo';
import Input from './Input/Input';
import { checkPasswordStrength, generateRandomString, isValidEmail } from '../UtilityFunctions';
import { ForgetEmailMessage, ForgetPasswordErrMessage, ForgetPasswordSubmitMessage, allCookies } from '../UtilityObjs';
import { RequestAdminEmailExist, RequestChangeAdminPassword, RequestEmailExist, RequestChangeUserPassword } from '../RequestFunction';
import IconSelector from './IconSelector';
import { useCookies } from 'react-cookie';

/**
 * The ForgetPassword component renders a form for a user to reset their password. It consists of a page with a form to input an email address, a verification code, a new password, and a confirmation of the new password. The form is processed on the client side and if the input is valid, the server is called to modify the user's password. A notification is displayed depending on the success or failure of the password modification. A loading animation is displayed while the server is processing the request.
 * @function
 * @param {object} props - The component props.
 * @param {boolean} props.admin - Whether the user is an admin or not.
 * @returns {JSX.Element} The rendered component.
 */
const ForgetPassword = ({admin}) => {

  /**
   * Manages cookies for authentication.
   * @type {Array}
   */
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  /**
   * State to track loading status.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State to track notification status and message.
   * @type {Object}
   * @property {boolean|null} outcome - Outcome of the notification.
   * @property {string} message - Message of the notification.
   */
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  });

  /**
   * State to track if email exists.
   * @type {boolean}
   */
  const [emailExist, setEmailExist] = useState(false);

  /**
   * State to store verification code and its authentication state.
   * @type {Object}
   * @property {string} code - Verification code.
   * @property {boolean} state - Authentication state of the code.
   */
  const [verifyEmailAuth, setVerifyEmailAuth] = useState({
    code: "",
    state: false,
  });

  /**
   * State to store forget password form data.
   * @type {Object}
   * @property {string} email - User's email.
   * @property {string} password - User's new password.
   * @property {string} confirmPassword - User's confirm password.
   */
  const [forget, setForget] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * State to store error messages for forget password fields.
   * @type {Object}
   * @property {string} email - Error message for the email field.
   * @property {string} password - Error message for the password field.
   * @property {string} code - Error message for the verification code field.
   * @property {string} confirmPassword - Error message for the confirm password field.
   */
  const [err, setErr] = useState({
    email: "",
    password: "",
    code: "",
    confirmPassword: "",
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

  /**
   * Handles the change event of a forget password input field. Updates the forget password
   * information state with the new value of the input field. Calls the `HandleInvalid` function
   * to check if the field is invalid and updates the error state accordingly.
   * @param {object} event - The event object triggered by the input field.
   */
  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setForget({
        ...forget,
        [name]: value,
    });  
    HandleInvalid(name,value)
  };

  /**
   * Handles the check email existence process for a user.
   *
   * If the email is invalid, it shows an error notification and exits the function.
   * Generates a random string and saves it as a cookie named "verify" with a max age of 20 minutes.
   * Calls the `RequestEmailExist` function or `RequestAdminEmailExist` function to check if the email exists in the database.
   * Updates the `emailExist` state with the result of the check.
   * Sets a notification of success or failure of the email existence check.
   * Removes the notification after 3 seconds.
   */
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

  /**
   * Resets the state of the "Forget Password" form back to its initial state, ready to accept a new email address to send a verification code to.
   * 
   * Resets the state of the "Verify Email Auth" form fields to their initial state.
   * Resets the state of the "Forget" form fields to their initial state.
   * Resets the state of the error messages to their initial state.
   * Resets the state of the "Email Exist" flag to false.
   */
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

  /**
   * Handles the OTP input change event.
   *
   * Updates the `verifyEmailAuth` state with the new OTP value from the input field.
   * Calls the `HandleInvalid` function to check for input validity and logs the OTP value.
   *
   * @param {object} event - The event object triggered by the input field containing `name` and `value`.
   */
  const HandleOTP = (event) => {
    const { name, value } = event.target; 
    setVerifyEmailAuth({
        ...verifyEmailAuth,
        code: value
    })

    HandleInvalid(name,value)

    console.log(value);
  }

  /**
   * Handles the form submission of the "Forget Password" form.
   *
   * Checks if the OTP length is equal to 7 numbers, and if not, displays an error message.
   * Checks if the "verify" cookie exists, and if not, resets the state of the "Forget Password" form and returns.
   * Checks if the password and confirm password fields are valid, and if not, displays an error message.
   * Calls the `RequestModifyUserRecord` or `RequestAdminModifyUserRecord` function to modify the user's password with the server.
   * Handles the response from the server, displaying a success or failure message and removing the "verify" cookie on success.
   * Sets a notification timeout to clear messages after 3 seconds.
   */
  const HandleSubmit = async() => {
    
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
        if (HandleInvalid("password",forget.password) || HandleInvalid("confirmPassword",forget.confirmPassword)) {
            return;
        }

        setLoading(true);
        if (admin) {
            var modifyUserRecord = await RequestChangeAdminPassword(forget.email,cookies.verify,forget.password,verifyEmailAuth.code)
        } else {
            var modifyUserRecord = await RequestChangeUserPassword(forget.email,cookies.verify,forget.password,verifyEmailAuth.code)
        }

        setLoading(false);


        switch (modifyUserRecord.status) {
            case 200:
                setNotify({
                    outcome:true,
                    message:ForgetPasswordSubmitMessage[modifyUserRecord.status]
                })   
                removeCookie("verify")
                setInterval(() => {
                    window.location.href = "login"
                }, 2000);
                
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