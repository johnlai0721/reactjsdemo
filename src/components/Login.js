// Inside your Login component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../css/Login.css';
import userIcon from '../Assests/user_icon.png';
import passwordIcon from '../Assests/password_icon.png';




const Login = ({ onLogin, handleLogout }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleNavigateToSignUp = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        navigate('/resetpassword');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const usernameRegex = /^[a-zA-Z]{1,10}$/;
        const passwordRegex = /^\d{1,10}$/;

        let usernameValid = usernameRegex.test(userName);
        let passwordValid = passwordRegex.test(password);

        if (!usernameValid && !passwordValid) {
            setError('Username must contain alphabetic characters only (1-10 characters), and password must contain digits only (1-10 digits)');
        } else if (!usernameValid) {
            setError('Username must contain alphabetic characters only (1-10 characters)');
        } else if (!passwordValid) {
            setError('Password must contain digits only (1-10 digits)');
        } else {
            setError('');

            try {
                sessionStorage.setItem('username', userName);

                const requestData = {
                    UserName: userName,
                    Password: password,
                };

                const responses = await axios.post('http://192.168.111.170/johnsonweb/api/login', requestData);
                const data = responses.data;

                onLogin(data.token);

                let timezone, elevation;

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        sessionStorage.setItem('latitude', latitude);
                        sessionStorage.setItem('longitude', longitude);

                        try {
                            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                            const data = response.data;

                            const ipResponse = await axios.get('https://ipinfo.io/json');
                            const ipData = ipResponse.data;
                            const ipAddress = ipData.ip;

                            const { city, county, state, country, postcode, road, house_number } = data.address;

                            const deviceName = navigator.userAgent;

                            sessionStorage.setItem('deviceName', deviceName);
                            sessionStorage.setItem('ipAddress', ipAddress);

                            sessionStorage.setItem('city', city);
                            sessionStorage.setItem('state', state);
                            sessionStorage.setItem('county', county);
                            sessionStorage.setItem('country', country);
                            sessionStorage.setItem('postcode', postcode);
                            sessionStorage.setItem('road', road);
                            sessionStorage.setItem('house_number', house_number);

                            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                            const elevationResponse = await axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`);
                            sessionStorage.setItem('elevation', elevationResponse.data.results[0].elevation);

                            const message =
                                `Username: ${userName}\n
                                Device Name: ${deviceName}\n
                                Ip Address: ${ipAddress}\n
                                Latitude: ${latitude}\n
                                Longitude: ${longitude}\n
                                City: ${city}\n
                                State: ${state}\n
                                County: ${county || 'N/A'}\n
                                Country: ${country}\n
                                Postal Code: ${postcode}\n
                                Road: ${road || 'N/A'}\n
                                House Number: ${house_number || 'N/A'}\n
                                Time Zone: ${timezone}\n
                                Elevation: ${elevation || 'N/A'}`;

                            alert(message);

                            navigate('/addTask');
                        } catch (error) {
                            console.error('Failed to fetch IP address and location:', error);
                        }
                    }
                )
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    };



    // useEffect(() => {
    //     // Declare timezone and elevation variables
    //     let timezone, elevation;
    //     // Fetch user's location using HTML5 Geolocation API
    //     navigator.geolocation.getCurrentPosition(
    //         async (position) => {
    //             const { latitude, longitude } = position.coords;

    //             // Store latitude and longitude in session storage
    //             sessionStorage.setItem('latitude', latitude);
    //             sessionStorage.setItem('longitude', longitude);

    //             try {
    //                 // Fetch address details using OpenStreetMap Nominatim API
    //                 const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    //                 const data = response.data;

    //                 // Extract address components
    //                 const { city, county, state, country, postcode, road, house_number } = data.address;



    //                 // Store address details in session storage
    //                 sessionStorage.setItem('city', city);
    //                 sessionStorage.setItem('state', state);
    //                 sessionStorage.setItem('county', county);
    //                 sessionStorage.setItem('country', country);
    //                 sessionStorage.setItem('postcode', postcode);
    //                 sessionStorage.setItem('road', road);
    //                 sessionStorage.setItem('house_number', house_number);
    //                 // Get timezone based on the user's locale
    //                 timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //                 const elevationResponse = await axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`);
    //                 sessionStorage.setItem('elevation', elevationResponse.data.results[0].elevation);


    //                 // Display fetched information
    //                 const message =
    //                     `Latitude: ${latitude}\n
    //     Longitude: ${longitude}\n
    //     City: ${city}\n
    //     State: ${state}\n
    //     County: ${county || 'N/A'}\n
    //     Country: ${country}\n
    //     Postal Code: ${postcode}\n
    //     Road: ${road || 'N/A'}\n
    //     House Number: ${house_number || 'N/A'}\n
    //     Time Zone: ${timezone}\n
    //     Elevation: ${elevation || 'N/A'}`;

    //                 alert(message);
    //             } catch (error) {
    //                 console.error('Error fetching address details:', error);
    //             }
    //         },
    //         (error) => {
    //             console.error('Error getting user location:', error);
    //             // Handle error gracefully
    //         }
    //     );
    // }, [handleLogout]); // Include handleLogout if needed, and include region in the dependencies array




    return (
        <div className='containerLogin'>
            <div className="headerLogin">
                <div className="Underline">Login</div>

                <form onSubmit={handleLogin}>
                    {/* Username input field */}
                    <div className="inputsLogin">
                        <div className="input">
                            <img src={userIcon} alt="" />
                            <input
                                type="text"
                                placeholder={!userName ? 'Name' : ''}
                                value={userName}
                                onChange={handleUserNameChange} />
                        </div>

                        {/* Password input field */}
                        <div className="input">
                            <img src={passwordIcon} alt="" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={!password ? 'Password' : ''}
                                value={password}
                                onChange={handlePasswordChange}
                            />

                            {/* Toggle password visibility */}
                            <button type="button" className="eyeSlash" onClick={handleTogglePassword}>
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot password link */}
                    <div className="forgot-password" onClick={handleForgotPassword}>
                        Forgot Password? <span>Click Here!</span>
                    </div>

                    {/* Login and Register buttons */}
                    <div className="button-container">
                        <button type="submit" className="submit-btn-login">
                            Login
                        </button>
                        <button className="submit-btn-createAccount" onClick={handleNavigateToSignUp}>
                            Register
                        </button>
                    </div>
                </form>

                {/* Error message display */}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default Login;
