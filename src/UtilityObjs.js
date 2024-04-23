export const RegisterFormErrMessage = {
    name: "Invalid Name",
    email: "Invalid Email",
    emailDoesNotExist: "Email has been used",
    password: "Password Required",
    weakPassword: "Password is weak",
    verifyCode: "Invalid verification code",
}

export const allCookies = [
  'verify',
  'log',
  "uid"
]

export const VerifyCodeMessage = {
  success : "Verfication code sent",
  failure : "Server Error"
}

export const RegisterSubmitMessage = {
  success : "Sign up successful",
  failure : "Server Error"
}

export const RegisterFormFormat = [
  {
      name: "name",
      label: "Name",
      type: "text", 
      placeholder: "Enter Name ..."
  },
  {
      name: "email",
      label: "Email",
      type: "text", 
      placeholder: "Enter email adress"
  },
  {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel", 
      placeholder: "Enter Phone ..."
  },
  {
      name: "password",
      label: "Password",
      type: "password", 
      placeholder: "Enter password"

  },
]

export const LoginFormFormat =  [
  {
      name: "email",
      label: "Email",
      type: "text", 
      placeholder: "Enter email Address"

  },
  {
      name: "password",
      label: "Password",
      type: "password", 
      placeholder: "Enter password"

  },
]

export const LoginFormErrMessage = {
  email: "Invalid Email",
  password: "Password Required",
  weakPassword: "Password is weak",
}
  
export const LoginSubmitMessage = {
  success : "Login successful",
  failure : "Server Error",
  unauthorized : "Invalid username or password"
}

export const notifsFormFormat = [
  {
      name : "title",
      label : "Title ",
      type: "text",
      placeholder: "Enter title name"
  },
  {
      name : "caption",
      label : "Caption",
      type: "textarea",
      placeholder: "Enter Caption...",
      maxLength: 50,
  },

]


export const eventFormFomart = [
  {
      name : "image",
      label : "Select Image",
      type: "image",
  },
  {
      name : "title",
      label : "Title",
      type: "text",
      placeholder: "Enter Title..."
  },
  {
      name : "caption",
      label : "Caption",
      type: "textarea",
      placeholder: "Enter Caption...",
      maxLength: 1500,
  }
]

export const reminderFormFormat = [
  {
      name : "title",
      label : "Title",
      type: "text",
      placeholder: "Enter Title..."
  },
  {
      name : "caption",
      label : "Caption",
      type: "textarea",
      placeholder: "Enter Caption...",
      maxLength: 50,
  },
  {
      type:"date",
      date:"selectDay",
      time:"selectTime",
      label:"Select Time",
      minDate: "today"
  },
]

export const reminderErrMessage = {
  title : "Title is required",
  selectDay: "Select date",
  selectTime: "Invalid time "
}

export const adminEventErrMessage = {
  title : "Title is required",
  image: "Image is required",
}


export const adminNotifyErrMessage = {
  title : "Title is required",
  selectDay: "Select date",
  selectTime: "Invalid time "
}





