import axios from 'axios';
import { getCookie } from './UtilityFunctions';

axios.interceptors.request.use((config) => {
  // Retrieve values from local storage or cookies
  const token = localStorage.getItem('token');  // Or retrieve it from another source
  const type = getCookie('type');
  const uid = getCookie('uid');

  // Add auth parameters as query parameters
  if (token || type || uid) {
      config.params = {
          ...config.params, // Preserve existing params
          auth_token: token || "",  // Add token if available
          type: type || "",         // Add type if available
          uid: uid || ""            // Add uid if available
      };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const RequestSubscribeNotify = async(subscription) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/subscribe-notify`,JSON.stringify({subscription}))      
    return true
  } catch (error) {    
    console.log("Error Request Subscribe Notify: ",error);    
    return false
  }
}

export const RequestSeen = async(seenType,id) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/seen`,JSON.stringify({seenType,id}))      
    return true
  } catch (error) {    
    return false
  }
}

export const RequestProfileChange = async({name,image}) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/profile-change`,JSON.stringify({name,image}))      
    return true
  } catch (error) {    
    return false
  }
}

export const RequestAddReminderInformation = async(repeatValue,repeatType) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/reminder`,JSON.stringify({repeatType,repeatValue}))
    return true
  } catch (error) {
    return false
  }
}

export const RequestUserInfo = async () => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/user-info`)
    return response.data
  } catch (error) {
    return false;
  }
}

export const RequestForVerificationCode = async (verifyId,email) => {
    try {
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, JSON.stringify({verifyId,email}))
        if (response.status === 200) {
          return true
        }      
        return false;
    } catch (error) {
      return false;
    }
}

export const RequestRegisterUser = async (verifyId,code,obj) => {
  try {
      
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, JSON.stringify({verifyId,code,...obj}))
      return {status:response.status, data:response.data} ;
  } catch (error) {
    return {status: error.response ? error.response.status : 500 };
  }

}

export const RequestCheckEmailUniqueness = async (email) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-email`, JSON.stringify({email}))      
    return true;
  } catch (error) {
    return false;
  }
}

export const RequestUserLogin = async (email,password,type) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, JSON.stringify({email,password,type}))
    return {status:response.status,data:response.data}
  } catch (error) {
    // console.log("Error: Request User Login ",error);    
    return {status: error.response ? error.response.status : 500 };
  }
}


export const RequestCreateNotification = async (obj) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/create-notify`, JSON.stringify(obj))
      return true;
  } catch (error) {
    return false;
  }
}


export const RequestCreateEvent = async (obj) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/create-event`, JSON.stringify(obj))    
      return true;
  } catch (error) {
    return false;
  }
}

export const RequestCreateReminder = async (obj) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/reminder`, JSON.stringify(obj))

      if (response.status === 200) {
        return true
      }
    
      return false;
  } catch (error) {
    return false;
  }
}

export const RequestDeleteInfo = async(deleteType,ids,) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/delete`, JSON.stringify({deleteType,ids}))
    return true;
  } catch (error) {
    return false;
  }
}

export const RequestEditEvent = async (event) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/edit-event`, JSON.stringify(event))
      if (response.status === 200) {
        return true
      }    
      return false;
  } catch (error) {
    console.log("Edit Event: ",error);    
    return false;
  }
}

export const RequestEditNotification = async (notification) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/edit-notify`, JSON.stringify(notification))      
      return true;
  } catch (error) {
    return false;
  }
}

export const RequestEditReminder = async (obj,admin)=> {
  try {
    let response = await axios.put(`${process.env.REACT_APP_API_URL}/reminder`, JSON.stringify({obj,admin}))

      if (response.status === 200) {
        return true
      }
    
      return false;
  } catch (error) {
    return false;
  }
}

export const RequestUserSeen = async (uid,systemID)=> {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/seen`, JSON.stringify({uid,systemID}))
      if (response.status === 200) {
        return true
      }
      return false;
  } catch (error) {
    return false;
  }
}

export const RequestEmailExist = async (email,verifyId) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/forget-password`, JSON.stringify({email,verifyId}))
    
    return response.status
  } catch (error) {
      console.log(error.response);
      return error.response ? error.response.status : 500;
  }
}

export const RequestChangeUserPassword = async (email,verifyId,password,code) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/change-password`, JSON.stringify({email,verifyId,password,code}))
    
    return {status:response.status, data:response.data} ;
  } catch (error) {
      console.log(error);
      return {status: error.response ? error.response.status : 500 };
  }
}

export const RequestAdminEmailExist = async (email,verifyId) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/admin-forget-password`, JSON.stringify({email,verifyId}))
    
    return response.status
  } catch (error) {
      return error.response ? error.response.status : 500;
  }
}

export const RequestChangeAdminPassword = async (email,verifyId,password,code) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/admin-change-password`, JSON.stringify({email,verifyId,password,code}))
    
    return {status:response.status, data:response.data} ;
  } catch (error) {
      console.log(error);
      return {status: error.response ? error.response.status : 500 };
  }
}

