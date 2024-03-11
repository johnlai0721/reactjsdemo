import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import emailIcon from '../Assests/email_icon.png';
import resetIcon from '../Assests/reset-password.png';
import '../css/SignUp.css';
import '../css/ResetPass.css';
import passwordIcon from '../Assests/password_icon.png'; // Import password icon image

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetCodeInput, setShowResetCodeInput] = useState(false);
    const [requestCooldown, setRequestCooldown] = useState(0);

    const handleNavigateToLogin = () => {
        navigate('/login'); //Navigate to the login route    
    };

    const handleRequestReset = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.111.170/johnsonweb/api/passwordreset/request',
                {
                    email: email
                });
            // Check the response to display appropriate message
            if (response.status === 200) {
                setMessage(response.data); // Display the response message
                setShowResetCodeInput(true); // Show the reset code input field
                setRequestCooldown(60); // Set cooldown timer to 5 minutes (300 seconds)

            } else {
                setMessage("Email not found"); // Display "Email not found" if there's an error
            }

        } catch (error) {
            message("Error:", error);
        } finally {
            // Set loading to false regardless of success or failure
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            setLoading(true);

            // Make a POST request to reset the password
            const response = await axios.post('http://192.168.111.170/johnsonweb/api/passwordreset/reset', {
                Email: email,
                ResetCode: resetCode,
                NewPassword: newPassword,

                //pass the email
                //check the reset code expires or not from the re
            });

            // Handle response as needed
            if (response.status === 200) {
                setMessage(response.data); // Display the response message
                    navigate('/login')
            } else {
                setMessage("Failed to reset password"); // Display error message if reset fails

            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setMessage(`Error: ${error.response.data}`);
            } else if (error.request) {
                // The request was made but no response was received
                setMessage("Error: No response received from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                setMessage(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer;
        if (requestCooldown > 0) {
            timer = setTimeout(() => {
                setRequestCooldown(prev => prev - 1);
            }, 1000); // Update countdown every second
        } else {
            clearTimeout(timer); // Clear the timer when cooldown reaches 0
        }
        return () => clearTimeout(timer); // Cleanup function
    }, [requestCooldown]);

    return (
        <div className='containerResetPass'>
            <div className="headerResetPass">
                <div className="textResetPass">Reset Password</div>
            </div>


<div className='inputEmail'>
            <div className="input">
                <img src={emailIcon} alt="" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                
                <div className='btnRequestCode'>
            <button type="button" className="submit-btn-signup" onClick={handleRequestReset} disabled={loading || requestCooldown > 0}>
                {requestCooldown > 0 ? `Retry in ${Math.floor(requestCooldown / 60)}:${(requestCooldown % 60).toString().padStart(2, '0')}` : 'Request Reset Code'}
            </button>
            </div>
</div>

<div className='SecondInput'>
            {showResetCodeInput && (
                <div>
                    <div className="input">
                    <img src={resetIcon} alt="" />
                        <input type="text" placeholder="Reset Code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
                    </div>
                    <div className="input">
                    <img src={passwordIcon} alt="" />
                        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                   
                </div>
            )}
            </div>

            <div className="submit-container-signup">

            <button type="button" className="submit-btn-signup" onClick={handleResetPassword} disabled={loading}>
                        Reset Password
                    </button>
                <button className="submit-btn-backLogin" onClick={handleNavigateToLogin}>
                    Back to Login
                </button>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ResetPassword;
