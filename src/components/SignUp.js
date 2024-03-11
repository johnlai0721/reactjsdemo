import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../css/Login.css';
import userIcon from '../Assests/user_icon.png';
import passwordIcon from '../Assests/password_icon.png';
import emailIcon from '../Assests/email_icon.png';
import '../css/SignUp.css';
import '../css/Model.css';

import axios from 'axios'; // Importing axios for making HTTP requests
import bcrypt from 'bcryptjs';

const SignUp = () => {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);


    const handleSignUp = async () => {
        try {
            console.log(userName);
            console.log(password);
            console.log(email);

            const hashedPassword = await bcrypt.hash(password,10); //10 is the  salt dorund
            console.log(hashedPassword);

            const responses = await axios.post('http://192.168.111.170/johnsonweb/api/register', {
                UserName: userName,
                Email: email,
                Password: hashedPassword
            });
            
            console.log(responses.data); // Assuming the server returns a success message
            setSignUpSuccess(true);

            navigate('/login');
        } catch (error) {
            if (error.responses) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error:', error.responses.data); // Log the error message from the server
                // Handle error display to the user, e.g., show a message or toast
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error:', error.request); // Log the request
                // Handle error display to the user, e.g., show a message or toast
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message); // Log the error message
                // Handle error display to the user, e.g., show a message or toast
            }
        }
    };
    
    const handleNavigateToLogin = () => {
        navigate('/login'); //Navigate to the signup route    
    };

    const handleOkButtonClick = () => {
        setSignUpSuccess(false); // Reset sign-up success state
        // Additional actions after successful sign-up confirmation, if needed
    };

    return (
        <div className='containerSignUp'>
            <div className="headerSignUp">
                <div className="UnderlineSignUp">Sign Up</div>
            </div>

            <div className="inputsSignUp">
                <div className="input">
                    <img src={userIcon} alt="" />
                    <input placeholder="Name" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className="input">
                    <img src={emailIcon} alt="" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input">
                    <img src={passwordIcon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>

            <div className="submit-container-signup">
                <button type="submit" className="submit-btn-signup" onClick={handleSignUp}>
                    Sign Up
                </button>
                <button className="submit-btn-backLogin" onClick={handleNavigateToLogin}>
                    Back to Login
                </button>
            </div>

            {signUpSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Sign up successful!</p>
                        <button onClick={handleOkButtonClick}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;


