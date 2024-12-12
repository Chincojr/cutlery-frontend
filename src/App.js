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
import AdminContactPage from './Pages/Admin/AdminContactPage'
import { DexieGetUserObject, DexieUpdateUserObject } from './DexieDb'
import UserContactPage from './Pages/Users/UserContactPage'
import AdminViewSpecificNotifyPage from './Pages/Admin/AdminViewSpecificNotifyPage'
import { RequestUserInfo } from './RequestFunction'
import OfflinePage from './Pages/OfflinePage'


/**
 * This component renders the main Route for the application.
 * It handles the client and admin login, and the routes for the user and admin
 * to view and edit events, notifications and messages.
 * It also handles the default route if the user is not logged in.
 * The component uses the useCookies hook to get the user's cookies and 
 * the useState and useEffect hooks to handle the user's login and logout.
 * The component renders the HomePage component if the user is not logged in.
 * The component renders the UserAccount component if the user is logged in.
 * The component renders the AdminViewNotifsPage component if the user is an admin.
 * The component renders the AdminViewEventsPage component if the user is an admin.
 * The component renders the AdminViewMsgList component if the user is an admin.
 * The component renders the UserViewNotifyPage component if the user is logged in.
 * The component renders the UserViewSpecificEventPage component if the user is logged in.
 * The component renders the Loading component if the user is not logged in and the loading state is true.
 * The component renders the ForgetPassword component if the user is not logged in and the forgetPassword state is true.
 * @returns {JSX.Element} The Route component that renders the main routes for the application.
 */
const App = () => {

  const [isOffline, setIsOffline] = useState(true)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'OFFLINE_STATUS') {            
          setIsOffline(event.data.offline);  // Function to update the app's state
        }
    });    
  }

  /**f
   * @type {import('react-cookie').CookieChangeHandler} cookies
   * @type {import('react-cookie').SetCookie} setCookie   
   */
  const [cookies, setCookie] = useCookies(allCookies);

  /**
   * Logged in status of the user
   * @type {boolean}
   */
  const [logged, setLogged] = useState(false);

  /**
   * Loading state of the component
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Admin status of the user
   * @type {boolean}
   */
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * User object of the logged in user
   * @type {Object}
   */
  const [userObject, setUserObject] = useState();

  /**
   * Unique identifier of the logged in user
   * @type {string}
   */
  const [userID, setUserID] = useState();


  
  useEffect(() => {

    const VerifyUserCredentials = async() => { 
      
      if (!isOffline) {
        setLoading(true)
        setCookie('update',true,{path: "/", maxAge:1200})  
        

        if (cookies.type && cookies.uid) {        
          setCookie('update',false,{path: "/", maxAge:1200})
          let userInfo = await RequestUserInfo();              
            
          setLoading(false)         
          if (userInfo) {
              setLogged(true)
              setUserID(cookies.uid)
              if (cookies.type === "Admin") {
                setIsAdmin(true)
              }              
              setUserObject(userInfo)            
              setCookie('update',true,{path: "/", maxAge:1200})              
          } else {
              setLogged(false)
          }    
        } else {
          setLoading(false)
          setLogged(false)
        }        
      }
      
            
    }

    VerifyUserCredentials();

          
  }, [cookies.type, cookies.uid,isOffline])


  useEffect(() => {
    if (userObject) {
      DexieUpdateUserObject(userObject) 
    }
     
  }, [userObject])

  useEffect(() => {
  
  setCookie('offline',isOffline,{path: "/", maxAge:1200}) 

   async function GetUserObject() {
      setCookie('update',true,{path: "/", maxAge:1200})  
      setLogged(true)
      setUserID(cookies.uid)
      if (cookies.type === "Admin") {
        setIsAdmin(true)
      }              
      let userInfo = await DexieGetUserObject() 
      setUserObject(userInfo)
      console.log("User Object: ", userInfo);
      setLoading(false)           
    }
    if (isOffline) {
      GetUserObject()
    }    
  }, [isOffline])

  console.log("Offline: ", isOffline);
  
  
    
  

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
                            <Route path="/admin/view/msg" element={<AdminContactPage userObject={userObject} logged={logged} userID={userID} setUserObject={setUserObject} />} />
                            <Route path="/admin/view/msg/:msgID" element={<AdminContactPage userObject={userObject} logged={logged} userID={userID} setUserObject={setUserObject} />} />
                          </>
                          : 
                          <></>
                      }

                        {/* Admin Msg Urls */}
                        <Route path="/contact" element={<UserContactPage setUserObject={setUserObject} userObject={userObject} logged={logged} userID={userID} />} />

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

                        {/* Offline */}
                        <Route path="/offline" element={<OfflinePage userObject={userObject} logged={logged} userID={userID}/>} />
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

export default App


