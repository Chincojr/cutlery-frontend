import axios from 'axios';

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

    if (response.status === 200) {
      return true
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

export const RequestUserLogin = async (email,password,type) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, JSON.stringify({email,password,type}))

    return {status:response.status,data:response.data}
  } catch (error) {
    return {status: error.response ? error.response.status : 500 };
  }
}

export const RequestAdminUserLogin = async (email,password) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/admin-login`, JSON.stringify({email,password}))

    return {status:response.status,data:response.data}
  } catch (
    error) {
    return {status: error.response ? error.response.status : 500 };
  }
}

export const RequestCreateNotification = async (obj) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/notify`, JSON.stringify(obj))

      if (response.status === 200) {
        return true
      }
    
      return false;
  } catch (error) {
    return false;
  }
}


export const RequestCreateEvent = async (obj) => {
  try {
      let response = await axios.post(`${process.env.REACT_APP_API_URL}/event`, JSON.stringify(obj))

      if (response.status === 200) {
        return true
      }
    
      return false;
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

export const RequestUserLogged = async(uid,log,adminUid) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/logged`, JSON.stringify({uid,log,adminUid}))

    if (response.status === 200) {
      return true
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const RequestDeleteInfo = async(type,uid,ids,adminUid) => {
  try {
    let response = await axios.post(`${process.env.REACT_APP_API_URL}/delete`, JSON.stringify({type,uid,ids,adminUid}))

    console.log(response.data,'lorem');
    if (response.status === 200) {
      return true
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const RequestEditEvent = async (obj,admin) => {
  try {
      let response = await axios.put(`${process.env.REACT_APP_API_URL}/event`, JSON.stringify({obj,admin}))

      if (response.status === 200) {
        return true
      }
    
      return false;
  } catch (error) {
    return false;
  }
}

export const RequestEditNotification = async (obj,admin) => {
  try {
      let response = await axios.put(`${process.env.REACT_APP_API_URL}/notify`, JSON.stringify({obj,admin}))

      if (response.status === 200) {
        return true
      }
    
      return false;
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

export const RequestModifyUserRecord = async (email,verifyId,password,code) => {
  try {
    let response = await axios.put(`${process.env.REACT_APP_API_URL}/forget-password`, JSON.stringify({email,verifyId,password,code}))
    
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

export const RequestAdminModifyUserRecord = async (email,verifyId,password,code) => {
  try {
    let response = await axios.put(`${process.env.REACT_APP_API_URL}/admin-forget-password`, JSON.stringify({email,verifyId,password,code}))
    
    return {status:response.status, data:response.data} ;
  } catch (error) {
      console.log(error);
      return {status: error.response ? error.response.status : 500 };
  }
}

