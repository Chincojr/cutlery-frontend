import React, { useEffect, useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import AdminNotifPage from './Pages/Admin/AdminNotifPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminViewNotifsPage from './Pages/Admin/AdminViewNotifsPage'
import UserAccount from './Pages/Users/UserAccount'
import HomePage from './Pages/HomePage'
import AdminEventsPage from './Pages/Admin/AdminEventsPage'
import AdminViewEventsPage from './Pages/Admin/AdminViewEventsPage'
import UserViewEventsPage from './Pages/Users/UserViewEventsPage'
import UserViewSpecificEventPage from './Pages/Users/UserViewSpecificEventPage'
import UserViewNotifyPage from './Pages/Users/UserViewNotifyPage'
import { useCookies } from 'react-cookie'
import { allCookies } from './UtilityObjs'
import Loading from './components/Loading'
import ForgetPassword from './components/ForgetPassword'
import AdminViewMsgList from './Pages/Admin/AdminViewMsgList'
import { DexieGetUserObject, DexieUpdateUserObject } from './DexieDb'
import UserContactPage from './Pages/Users/UserContactPage'
import AdminViewSpecificNotifyPage from './Pages/Admin/AdminViewSpecificNotifyPage'
import { RequestLogged, RequestUserInfo } from './RequestFunction'


const RouteFile = () => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [userObject, setUserObject] = useState()
  const [userID, setUserID] = useState()



  // Verify the user Credentials and add the updated user object into the IndexedeDB
  useEffect(() => {
    const VerifyUserCredentials = async() => {
      setCookie('update',false,{path: "/", maxAge:1200})

      if (cookies.type && cookies.uid) {
        let verifyCredentials = await RequestLogged();        
       
        setLoading(false)         
        if (verifyCredentials) {
            setLogged(true)
            setUserID(cookies.uid)
            if (cookies.type === "Admin") {
              setIsAdmin(true)
            }              
            let userInfo = await RequestUserInfo()
            await DexieUpdateUserObject(userInfo.data)  
            setCookie('update',true,{path: "/", maxAge:1200})  
            setRefreshCount(refreshCount + 1);
        }       
      } else {
        setLoading(false)
      }

    }

    VerifyUserCredentials();

          
  }, [cookies.type, cookies.uid])

  // Retrieve userObject from IndexedDB and set it to userObject
  useEffect(() => {

    const GetUsersInfo = async () => {
        let userInfo = await DexieGetUserObject() 
        if (userInfo) {
            setUserObject(userInfo)     
            console.log("Retrieved userObject ", userInfo);
        }        
    }

    if (logged) {
      GetUsersInfo();      
    }


  }, [logged,refreshCount])




  
  

  return (
    <div>
        <Router>
            <Routes>
                {

                  logged ? 
                  <>
                      {
                          isAdmin ?
                          <>
                            {/* Admin Notify Urls */}
                            <Route path="/admin/new/notify" element={<AdminNotifPage userObject={userObject} logged={logged} userID={userID}/>} />
                            <Route path="/admin/edit/notify/:notifyID" element={<AdminNotifPage userObject={userObject} logged={logged} userID={userID}/>} />
                            <Route path="/admin/view/notify" element={<AdminViewNotifsPage userObject={userObject} logged={logged} userID={userID}/>} />
                            <Route path="/admin/view/notify/:notifyID" element={<AdminViewSpecificNotifyPage userObject={userObject} logged={logged} userID={userID}/>} />

                            {/* Admin Event Urls */}
                            <Route path="/admin/new/event" element={<AdminEventsPage userObject={userObject} logged={logged} userID={userID}/>} />
                            <Route path="/admin/edit/event/:eventID" element={<AdminEventsPage userObject={userObject} logged={logged} userID={userID}/>} />
                            <Route path="/admin/view/events" element={<AdminViewEventsPage userObject={userObject} logged={logged} userID={userID}/>} />

                            {/* Admin Msg Urls */}
                            <Route path="/admin/view/msg" element={<AdminViewMsgList userObject={userObject} logged={logged} userID={userID} setRefreshCount={setRefreshCount} />} />
                            <Route path="/admin/view/msg/:msgID" element={<AdminViewMsgList userObject={userObject} logged={logged} userID={userID} setRefreshCount={setRefreshCount} />} />
                          </>
                          : 
                          <>
                          </>
                      }

                        {/* Admin Msg Urls */}
                        <Route path="/contact" element={<UserContactPage userObject={userObject} logged={logged} userID={userID} setRefreshCount={setRefreshCount} />} />

                        {/* User profile settings */}
                        <Route path="/user-profile" element={<UserAccount userObject={userObject} logged={logged} userID={userID}/>} />

                        {/* User Event Urls */}
                        <Route path="/view/events" element={<UserViewEventsPage userObject={userObject} logged={logged} userID={userID}/>} />
                        <Route path="/event/:eventID" element={<UserViewSpecificEventPage userObject={userObject} logged={logged} userID={userID}/>} />

                        {/* User Notify Urls */}
                        <Route path="/notifications" element={<UserViewNotifyPage userObject={userObject} logged={logged} userID={userID}/>} />

                        {/* HomePage */}
                        <Route path="/" element={<HomePage userObject={userObject} logged={logged} userID={userID}/>} />

                        {/* default Url */}
                        <Route path="*" element={<HomePage userObject={userObject} logged={logged} userID={userID}/>} />
                  </>

                  :
                   <>

                      {/* <Route path="/" element={<HomePage />} /> */}
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login type={"Client"}/>} />

                      {/* Admin Login */}
                      <Route path="/admin/login" element={<Login type={"Admin"} />} />

                      {/* default Url */}
                      <Route path="*" element={<HomePage  />} />

                      {/* ForgetPassword */}
                      <Route path="/forget-password" element={<ForgetPassword />} />
                      <Route path="/admin/forget-password" element={<ForgetPassword admin={true} />} />


                   </>

                }




            </Routes>
        </Router>
        <Loading loading={loading} />
    </div>
  )
}

export default RouteFile


