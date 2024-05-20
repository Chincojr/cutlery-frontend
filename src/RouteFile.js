import React from 'react'
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


const RouteFile = () => {
  return (
    <div>
        <Router>
            <Routes>
                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login/>} />

                {/* Admin Notify Urls */}
                <Route path="/admin/new/notify" element={<AdminCreateNotifPage />} />
                <Route path="/admin/view/notify" element={<AdminViewNotifsPage />} />

                {/* Admin Event Urls */}
                <Route path="/admin/new/event" element={<AdminCreateEventsPage />} />
                <Route path="/admin/view/events" element={<AdminViewEventsPage />} />


                {/* User reminder Urls */}
                <Route path="/new/reminder" element={<CreateReminderPage />} />
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


            </Routes>
        </Router>
    </div>
  )
}

export default RouteFile