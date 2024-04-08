import React, { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Button, Stack, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = ({ blockedUsers, setBlockedUsers }) => {
    const [username, setUsername] = useState('');
    const [userNameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    //const [blockedUser, setBlockedUser] = useState(false);

    const cardStyle = {
        width: '24rem',
        background: 'white',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
        border: '2px solid #ddd',
        borderRadius: '8px',
    };

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            // Set the logged-in user state if it exists in local storage
            setUsername(loggedInUser);
        }
        // Fetch block users
        const fetchBlockedUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blockUser');
                setBlockedUsers(response.data);
                //console.log(response.data);
            } catch (error) {
                console.error('Error fetching blocked users:', error);
            }
        };
        fetchBlockedUsers();
    }, [])

    const handleLogin = async () => {

        if (username.trim() === '' && password.trim() === '') {
            toast.error('Username and password cannot be empty!');
            console.log(blockedUsers);
            setUsernameError(true);
            setPasswordError(true);
            return;
        }

        if (blockedUsers.some(user => user.userName === username)) {
            toast.warning('This account is already blocked! Please contact support.');
            console.log('BLOCK USER:',username);
            return;
        }

        // Username validation
        if (!validateUserName(username)) {
            setUsernameError(true);
            return;
        }
        setUsernameError(false);

        try {
            const response = await axios.get(`http://localhost:8000/users?userName=${username}`);
            const userData = response.data;

            if (userData.length > 0) {
                // Username exists
                const user = userData[0]; // Assume username is unique
                if (user.password === password) {
                    // Password matches
                    localStorage.setItem('loggedInUser', username);
                    setUsername('');
                    setPassword('');
                    toast.success('Login successful');
                    navigate('/home');
                } else {
                    // if (blockedUsers.includes(username)) {
                    //     toast.warning('This account is already blocked! Please contact support..');
                    //     return;
                    // }
                    // else {
                        //Password does not match
                        if(password===''){
                            setPasswordError(true);
                            toast.error('password can not be empty!');
                        }
                        else{
                        toast.error('Invalid password!, try again');
                        setLoginAttempts(loginAttempts + 1);
                        if (loginAttempts >= 2) {
                            // Block the username after 3 unsuccessful attempts
                            blockUsername(username);
                            handleBlockedUserNavigation(username);
                            return;
                         }
                    }
                }
            } else {
                // Username does not exist
                setUsernameExists(false);
                toast.error('Username not exists');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            toast.error('An error occurred while checking username');
        }
    };

    const validateUserName = (username) => {
        if (username === '') {
            toast.error('username cannot be empty!');
            return;
        }
        const regex = /^[a-zA-Z0-9]+$/; // Allows only letters and numbers
        return regex.test(username);
    };

    const handleUsernameBlur = async () => {
        if (!validateUserName(username)) {
            setUsernameError(true);
            // toast.error('Invalid username format');
            return;
        }
        setUsernameError(false);

        try {
            const response = await axios.get(`http://localhost:8000/users?userName=${username}`);
            const userData = response.data;

            if (userData.length > 0) {
                // Username exists
                setUsernameExists(true);

            } else {
                // Username does not exist
                setUsernameExists(false);
                toast.error('Username not exists');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            toast.error('An error occurred while checking username');
        }
    };

    const blockUsername = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/users?userName=${username}`);
            const userData = response.data;

            if(userData.length > 0) {
                const user = userData[0];
                await axios.post(`http://localhost:8000/blockUser/`, { id: user.id, userName: user.userName });
                setBlockedUsers(prevBlockedUsers => [...prevBlockedUsers, { id: user.id, userName: user.userName }]);
                toast.error('Your account has been blocked due to multiple unsuccessful login attempts.');
            } else {
                toast.error('User not found');
            }
            
        } catch (error) {
            console.error('Error blocking username:', error);
            toast.error('An error occurred while blocking the username');
        }
    };

    const handleBlockedUserNavigation = (blockedUsername) => {
        navigate('/home', { state: { blockedUser: username } });
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Card className="draggable-card" style={cardStyle}>
                <CardContent>
                    <h2>Login</h2>
                    <TextField
                        type="text"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleUsernameBlur}
                        error={userNameError}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    edge="end"
                                    aria-label="username-exists"
                                    onClick={handleUsernameBlur}
                                    style={{ visibility: usernameExists ? 'visible' : 'hidden' }} // Show/hide the icon based on username existence
                                >
                                    <CheckCircle style={{ color: 'green' }} /> {/* Green checkmark icon */}
                                </IconButton>
                            ),
                        }}
                        helperText={userNameError ? 'username cannot be empty' : ''}
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </Button>
                            ),
                        }}
                        error={passwordError}
                        helperText={passwordError ? 'password cannot be empty' : ''}
                    />
                    <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                        <Link to="/signup"><Button variant="contained" color="error">+ Signup</Button></Link>
                        <Link to="/forget-password">Forgot Password?</Link>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
