import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axios from 'axios';
const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState('');
    const [userName, setUsername] = useState('');
    const [secureQuestion, setSecureQuestion] = useState('');
    const [secureQuestionAnswer, setSecureQuestionAnswer] = useState('');
    const [latestId, setLatestId] = useState(10);

    // Default secure questions from config file
    const defaultSecureQuestions = [
        'What is your mother\'s maiden name?',
        'What is the name of your first pet?',
        'What is the city of your birth?',
    ];

    const generateNumericId = () => {
        return Math.floor(Math.random() * 100).toString();
    };

    const handleSubmit = async () => {

        // Check if username already exists
        const usernameResponse = await axios.get(`http://localhost:8000/users?userName=${userName}`);
        const existingUser = usernameResponse.data.length > 0;

        if (existingUser) {
            toast.error('Username already exists! Please choose a different username.');
            return;
        }
        // Is empty validations
        if (firstName === '') {
            setFirstNameError(true);
            toast.error('First name cannot be empty!');
            return;
        }
        setFirstNameError(false);

        if (lastName === '') {
            toast.error('Last name cannot be empty!');
            setLastNameError(true);
            return;
        }
        setLastNameError(false);

        if (password === '') {
            setPasswordError(true);
            toast.error('Password cannot be empty');
            return;
        }
        setPasswordError(false);

        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            toast.error('Password do not match');
            return;
        }
        setConfirmPasswordError(false);
        
        try {
            // const id = generateNumericId();
            const id = (latestId + 1).toString();
            const formData = {
                id,
                firstName,
                lastName,
                password,
                userName,
                secureQuestion,
                secureQuestionAnswer,
            }

            await axios.post('http://localhost:8000/users', formData);
            // Update the state for latest ID
            setLatestId(latestId + 1);

            // Clear form fields after successful submission
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
            setSecureQuestion('');
            setSecureQuestionAnswer('');

            toast.success('Form data saved successfully!');
        } catch (error) {
            console.error('Error saving form data:', error);
            toast.error('An error occurred while saving form data');
        }


    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Card style={{ width: '54rem' }}>
                <CardContent><h2>Signup</h2>
                    <Box sx={{ width: '100%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <TextField
                                    type='text'
                                    label='First name'
                                    varient='outlined'
                                    fullWidth
                                    placeholder='first name'
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                    error={firstNameError}
                                    helperText={firstNameError ? 'fill this field' : ''}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type='text'
                                    label='Last name'
                                    varient='outlined'
                                    fullWidth
                                    placeholder='lastname'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onBlur={(e) => setUsername(firstName.toLowerCase() + lastName.toLowerCase())}
                                    error={lastNameError}
                                    helperText={lastNameError ? 'fill this field' : ''}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    label='Password'
                                    varient='outlined'
                                    fullWidth
                                    placeholder='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={passwordError}
                                    helperText={passwordError ? 'Password cannot be empty' : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <Button onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </Button>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    label='Confirm Password'
                                    varient='outlined'
                                    fullWidth
                                    placeholder=' confirm password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={confirmPasswordError}
                                    helperText={confirmPasswordError ? 'Password do not match' : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </Button>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Secure Question"
                                    variant="outlined"
                                    fullWidth
                                    value={secureQuestion}
                                    onChange={(e) => setSecureQuestion(e.target.value)}
                                >
                                    {defaultSecureQuestions.map((question, index) => (
                                        <MenuItem key={index} value={question}>{question}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="text"
                                    label="Answer for the Secure Question"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Answer"
                                    value={secureQuestionAnswer}
                                    onChange={(e) => setSecureQuestionAnswer(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type='text'
                                    label='username'
                                    varient='outlined'
                                    fullWidth
                                    placeholder='username'
                                    value={userName}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Signup
                        </Button>
                        <Link to="/login"><Button variant="contained" color="success">Login</Button></Link>
                    </Stack>
                </CardContent>


            </Card>
        </div>
    )
}

export default Signup
