export const RegisterFormErrMessage = {
    name: "Invalid Name",
    email: "Invalid Email",
    emailAlreadyExist: "Email has been used",
    password: "Password Required",
    weakPassword: "Password is weak",
    code: "Invalid verification code",
}

export const allCookies = [
  'verify',
  'log',
  "uid",
  "type",
  "reminder",
  "update"
]

export const VerifyCodeMessage = {
  success : "Verfication code sent",
  failure : "Server Error"
}

export const RegisterSubmitMessage = {
  200 : "Sign up successful",
  500 : "Server Error",
  401 : "Invalid verification code",
  failure: "Error"
}

export const notificationTimeout = 5000

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
  {
    name : "link",
    label : "Link",
    type: "text",
    placeholder: "Enter link or url of choice"
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
  content: "The page content is required",
}


export const adminNotifyErrMessage = {
  title : "Title is required",
  selectDay: "Invalid day",
  selectTime: "Invalid time ",
  link : "This url is invalid"
}

export const CreateNotificationMessage = {
  success : "Notification created",
  failure : "Server Error"
}

export const EditNotificationMessage = {
  success : "Notification edited succesfully",
  failure : "Server Error"
}

export const CreateEventMessage = {
  success : "Event created",
  failure : "Server Error"
}

export const EditEventMessage = {
  success : "Event edited succesfully",
  failure : "Server Error"
}

export const CreateRemindersMessage = {
  success : "Reminder created",
  failure : "Server Error"
}

export const EditRemindersMessage = {
  success : "Reminder edited succesfully",
  failure : "Server Error"
}

export const UnavailableMessage = {
  Reminders: {
    iconType: "NoReminders",
    text: "No reminders"
  },
  Events: {
    iconType: "Event",
    text: "No events"
  },
  Notify: {
    iconType: "NoNotify",
    text: "No Notification"
  },
  Msg: {
    iconType: "NoMsg",
    text: "No message"
  },
  SelectMsg: {
    iconType: "Msgs",
    text: "Select Chat"
  }
}

export const DeleteInfoMessage = {
  success : "Deleted",
  failure: "Error"
}

export const ForgetPasswordErrMessage = {
  email: "Invalid email",
  emailNotFound: "Email not found",
  code: "Invalid code",
  password: "Password required",
  weakPassword: "Password is weak",
  confirmPassword: "Password does not match"
}

export const ForgetEmailMessage = {
  200: "OTP has been sent",
  failure : "Server Error",
  404 : "User account does not exist",
  invalid: "A valid email is required"
}

export const ForgetPasswordSubmitMessage = {
  200: "Password change Successful",
  401: "Invalid OTP",
  404: "Invalid Email address",
  failure: "Server Error"
}
