import React, { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [userNameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    useEffect(()=>{
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            // Set the logged-in user state if it exists in local storage
            setUsername(loggedInUser);
        }
    },[])

    const handleLogin = async () => {
        // username validation
        if (!validateUserName(username)) {
            setUsernameError(true);
            toast.error('Invalid username format');
            return;
        }
        setUsernameError(false);

        // Password validation
        if (password === '') {
            setPasswordError(true);
            toast.error('Password cannot be empty');
            return;
        }
        setPasswordError(false);
        try {
            // Send login request to your backend API
            const response = await axios.get('http://localhost:8000/users');
            const userData = response.data;

            // Check if username and password match any entry in the user data
            const user = userData.find(user => user.userName === username && user.password === password);
            if (user) {

                // Store the logged-in user data in local storage
                localStorage.setItem('loggedInUser', username);

                setUsername('');
                setPassword('');

                toast.success('Login successful');
                navigate('/home');
            } else {
                toast.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('An error occurred while logging in');
        }
    };

    const validateUserName = (username) => {
        const regex = /^[a-zA-Z0-9]+$/; // Allows only letters and numbers
        return regex.test(username);
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
                        error={userNameError}
                        helperText={userNameError ? 'Invalid username format' : ''}
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
