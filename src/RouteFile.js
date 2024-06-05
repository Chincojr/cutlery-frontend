import React, { useEffect, useState } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import AdminCreateNotifPage from './Pages/AdminCreateNotifPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminViewNotifsPage from './Pages/AdminViewNotifsPage'
import UserAccount from './Pages/UserAccount'
import HomePage from './Pages/HomePage'
import CreateReminderPage from './Pages/UserCreateReminderPage'
import AdminCreateEventsPage from './Pages/AdminCreateEventsPage'
import AdminViewEventsPage from './Pages/AdminViewEventsPage'
import ViewReminderPage from './Pages/UserViewReminderPage'
import UserViewEventsPage from './Pages/UserViewEventsPage'
import UserViewSpecificEventPage from './Pages/UserViewSpecificEventPage'
import UserViewNotifyPage from './Pages/UserViewNotifyPage'
import { useCookies } from 'react-cookie'
import { allCookies } from './UtilityObjs'
import { DexieGetUserInfo } from './RetrieveUserData'
import Loading from './components/Loading/Loading'
import { RequestUserLogged } from './RequestFunction'
import ForgetPassword from './components/ForgetPassword/ForgetPassword'


const RouteFile = () => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    const HandleLoggedIn = async() => {

      if (!cookies.uid && !cookies.adminUid) {
        setLogged(false);
        setIsAdmin(false)
      }

      if (cookies.log && cookies.uid) {
        let isUserloggedIn = await RequestUserLogged(cookies.uid,cookies.log,undefined)
        if (isUserloggedIn) {
          await DexieGetUserInfo(cookies.uid)
          setLogged(true)
        }
      }

      if (cookies.log && cookies.adminUid) {
        let isAdminloggedIn = await RequestUserLogged(undefined,cookies.log,cookies.adminUid)
        if (isAdminloggedIn) {
          await DexieGetUserInfo(cookies.adminUid)
          setLogged(true)
          setIsAdmin(true)
        }
      }

      setLoading(false)

    }

    HandleLoggedIn()
  

  }, [])
  

  return (
    <div>
        <Router>
            <Routes>
                {

                  logged ? 
                   <>
                      {
                          isAdmin  ?
                          <>
                              {/* Admin Notify Urls */}
                              <Route path="/admin/new/notify" element={<AdminCreateNotifPage />} />
                              <Route path="/admin/edit/notify/:notifyID" element={<AdminCreateNotifPage />} />
                              <Route path="/admin/view/notify" element={<AdminViewNotifsPage />} />

                              {/* Admin Event Urls */}
                              <Route path="/admin/new/event" element={<AdminCreateEventsPage />} />
                              <Route path="/admin/edit/event/:eventID" element={<AdminCreateEventsPage />} />
                              <Route path="/admin/view/events" element={<AdminViewEventsPage />} />
                          </>
                          : 
                          <>
                            {/* Admin Login */}
                            <Route path="/admin/login" element={<Login type={"Admin"} />} />

                            {/* Admin ForgetPassword */}
                            <Route path="/admin/forget-password" element={<ForgetPassword admin={true} />} />
                            
                          </>
                      }





                      {/* User reminder Urls */}
                      <Route path="/new/reminder" element={<CreateReminderPage />} />
                      <Route path="/edit/reminder/:reminderID" element={<CreateReminderPage />} />
                      <Route path="/view/reminders" element={<ViewReminderPage />} />

                      {/* User profile settings */}
                      <Route path="/user-profile" element={<UserAccount />} />

                      {/* User Event Urls */}
                      <Route path="/view/events" element={<UserViewEventsPage />} />
                      <Route path="/event/:eventID" element={<UserViewSpecificEventPage />} />

                      {/* User Notify Urls */}
                      <Route path="/notifications" element={<UserViewNotifyPage />} />

                      {/* HomePage */}
                      <Route path="/" element={<HomePage />} />

                      {/* default Url */}
                      <Route path="*" element={<HomePage />} />

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