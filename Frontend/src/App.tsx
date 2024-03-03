import Home from './pages/HomePage/Home';
import { useEffect, useState } from 'react';
import { Login } from './pages/LoginPage/Login';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import { ProfileComponent } from './pages/Profile/Profile';
import { SettingsPage } from './pages/Settings/Settings';
import GamePage from './pages/game/GamePage';
import { MainChat } from './pages/ChatPage/Chat';
import TwoFA from './pages/2FAPage/TwoFA';
import QRCode from './pages/QRcodePage/QRcodePage';

import { userStore } from '../src/store/user';
import { ToastContainer } from 'react-toastify';

import Layout from './components/GameNavbar/Layout';
import { useAuthStore } from './store/authStore';


function App() {
    const [username, setUsername] = useState(null);
    const { isLoggedIn, user } = userStore();
    const { redirectedFor2FA } = useAuthStore();

    // const logged = !isLoggedIn && !user?.ifauthenficate;
    // const logged2fa = !isLoggedIn && user?.ifauthenficate;

    return (
        <BrowserRouter>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                ) : user?.ifauthenficate && !redirectedFor2FA ? (
                    <>
                        <Route path="/twoFA" element={<TwoFA />} />
                        <Route
                            path="*"
                            element={<Navigate to="/twoFA" replace />}
                        />
                    </>
                ) : (
                    <>
                        <Route element={<Layout />}>
                            <Route
                                path="/profile/:username"
                                element={<ProfileComponent />}
                            />
                            <Route
                                path="/profile"
                                element={
                                    username ? (
                                        <ProfileComponent />
                                    ) : (
                                        <Navigate
                                            to="/settings"
                                            replace={true}
                                        />
                                    )
                                }
                            />
                            <Route
                                path="/settings"
                                element={<SettingsPage />}
                            />
                            <Route path="/home" element={<Home />} />
                            <Route path="/chat" element={<MainChat />} />
                            <Route
                                path="/"
                                element={<Navigate to="/home" replace />}
                            />
                            <Route path="/game" element={<GamePage />} />
                            <Route path="/twoFA" element={<TwoFA />} />
                        </Route>
                        <Route path="/QRCode" element={<QRCode />} />

                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default App;

{
    /* {
          (logged || logged2fa) &&
          (
            <>
              <Route element={<Layout />}>
                <Route path="/profile/:username" element={<ProfileComponent />
                } />
                <Route
                  path="/profile"
                  element={
                    username ? (<ProfileComponent />
                    ) : (<Navigate to="/settings" replace={true} />)
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/chat" element={<MainChat />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/twoFA" element={<TwoFA />} />
              </Route>
              <Route path="/QRCode" element={<QRCode />} />
              
              <Route path="*" element={<NotFound />} />
            </>
          )}
          {
            !isLoggedIn && user?.ifauthenficate &&
            ( 
            <>
              <Route path="/twoFA" element={<TwoFA />} />
              <Route path="/" element={<Navigate to="/twoFA" replace />} />
            </>
            )
          }

        {
          isLoggedIn == true &&
          (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )} */
}
