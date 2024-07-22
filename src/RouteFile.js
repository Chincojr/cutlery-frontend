import React, { useEffect, useState } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import AdminCreateNotifPage from './Pages/Admin/AdminCreateNotifPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminViewNotifsPage from './Pages/Admin/AdminViewNotifsPage'
import UserAccount from './Pages/Users/UserAccount'
import HomePage from './Pages/HomePage'
import CreateReminderPage from './Pages/Users/UserCreateReminderPage'
import AdminCreateEventsPage from './Pages/Admin/AdminCreateEventsPage'
import AdminViewEventsPage from './Pages/Admin/AdminViewEventsPage'
import ViewReminderPage from './Pages/Users/UserViewReminderPage'
import UserViewEventsPage from './Pages/Users/UserViewEventsPage'
import UserViewSpecificEventPage from './Pages/Users/UserViewSpecificEventPage'
import UserViewNotifyPage from './Pages/Users/UserViewNotifyPage'
import { useCookies } from 'react-cookie'
import { allCookies } from './UtilityObjs'
import Loading from './components/Loading/Loading'
import ForgetPassword from './components/ForgetPassword/ForgetPassword'
import {  WSClose, WSConnect, WSSend } from './Webocket'
import AdminViewMsgList from './Pages/Admin/AdminViewMsgList'
import { DexieGetUserObject } from './DexieDb'
import UserCreateReminder from './components/UserCreateReminder/UserCreateReminder'
import UserContactPage from './Pages/Users/UserContactPage'


const RouteFile = () => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [userObject, setUserObject] = useState()
  const [userID, setUserID] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])

  /* 
    IF log cookies , uid cookies and admin cookies all exist
      delete all cookies 
    ELSE IF log cookies and uid cookies exist
        create websocket for the user
    ELSE IF log cookies and adminUid cookies exist
        create websocket for the admin user
  */

  useEffect(() => {

    if (cookies.log && cookies.uid) {
      WSConnect(cookies.log, false, cookies.uid, setLogged, null, setLoading, setUpdateCount, setUserID, setOnlineUsers)
    } else if ( cookies.log && cookies.adminUid) {
      WSConnect(cookies.log, true, cookies.adminUid, setLogged, setIsAdmin, setLoading, setUpdateCount, setUserID,setOnlineUsers)
    } else {
      setLoading(false)
    }  
      
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', WSClose);
    };

  }, [cookies.log, cookies.uid, cookies.adminUid])

  // Retrieve user Object
  useEffect(() => {

    console.log({updateCount});
    const GetUsersInfo = async () => {
      console.log("Getting user Object");
      if (logged) {
        let userInfo = await DexieGetUserObject() 
        if (userInfo) {
            setUserObject(userInfo)     
            console.log("Retrieved userObject ", userInfo);
        }        
      }
    }

    GetUsersInfo()


  }, [logged,updateCount])


  // retrieve all online users
  useEffect(() => {

    const GetOnlineUsers = setInterval(() => {
      WSSend({type:"Ping", message: {}})
      console.log('Ping retrieve all online users: ');
    }, 60000); // 10000 milliseconds = 10 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(GetOnlineUsers);
  }, []); // Empty dependency array means this effect runs only once




  
  

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
                            <Route path="/admin/new/notify" element={<AdminCreateNotifPage userObject={ userObject }  userID={ userID }/>} />
                            <Route path="/admin/edit/notify/:notifyID" element={<AdminCreateNotifPage userObject={ userObject }  userID={ userID }/>} />
                            <Route path="/admin/view/notify" element={<AdminViewNotifsPage userObject={ userObject }  userID={ userID }/>} />

                            {/* Admin Event Urls */}
                            <Route path="/admin/new/event" element={<AdminCreateEventsPage userObject={ userObject }  userID={ userID }/>} />
                            <Route path="/admin/edit/event/:eventID" element={<AdminCreateEventsPage userObject={ userObject }  userID={ userID }/>} />
                            <Route path="/admin/view/events" element={<AdminViewEventsPage userObject={ userObject }  userID={ userID }/>} />

                            {/* Admin Msg Urls */}
                            <Route path="/admin/view/msg" element={<AdminViewMsgList userObject={ userObject }  userID={ userID } onlineUsers={onlineUsers} />} />
                            <Route path="/admin/view/msg/:msgID" element={<AdminViewMsgList userObject={ userObject }  userID={ userID } onlineUsers={onlineUsers} />} />
                          </>
                          : 
                          <>
                          </>
                      }

                        {/* Admin Msg Urls */}
                        <Route path="/contact" element={<UserContactPage userObject={ userObject }  userID={ userID } onlineUsers={onlineUsers} />} />

                        {/* User reminder Urls */}
                        <Route path="/new/reminder" element={<CreateReminderPage userObject={ userObject }  userID={ userID }/>} />
                        <Route path="/edit/reminder/:reminderID" element={<CreateReminderPage userObject={ userObject }  userID={ userID }/>} />
                        <Route path="/view/reminders" element={<ViewReminderPage userObject={ userObject }  userID={ userID }/>} />

                        {/* User profile settings */}
                        <Route path="/user-profile" element={<UserAccount userObject={ userObject }  userID={ userID }/>} />

                        {/* User Event Urls */}
                        <Route path="/view/events" element={<UserViewEventsPage userObject={ userObject }  userID={ userID }/>} />
                        <Route path="/event/:eventID" element={<UserViewSpecificEventPage userObject={ userObject }  userID={ userID }/>} />

                        {/* User Notify Urls */}
                        <Route path="/notifications" element={<UserViewNotifyPage userObject={ userObject }  userID={ userID }/>} />

                        {/* HomePage */}
                        <Route path="/" element={<HomePage userObject={ userObject }  userID={ userID }/>} />

                        {/* default Url */}
                        <Route path="*" element={<HomePage userObject={ userObject }  userID={ userID }/>} />
                      </>

                   :
                   <>

                      {/* <Route path="/" element={<HomePage />} /> */}
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login/>} />

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


