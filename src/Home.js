import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {

    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [showPassword, setShowPassword] = useState('');
    const [deleteUserId, setDeleteUserId] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState('');

    useEffect(() => {
        const userName = localStorage.getItem('loggedInUser');
        if (userName) {
            setLoggedInUser(userName);
        } else {
            // If no user is logged in, navigate back to the login page
            navigate('/login');
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditedUsername(user.userName);
        setEditedPassword(user.password);
        setOpenEditModal(true);
        console.log('Edit user with ID:', user);
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/users/${deleteUserId}`);
            setOpenDeleteModal(false);
            fetchData();
            console.log('Delete user with id:', deleteUserId);
        }
        catch (error) {
            console.log('Error deleting user', error)
        }
    }

    const handleSave = async () => {
        try {
            const updatedUser = { ...editUser, userName: editedUsername, password: editedPassword };
            await axios.put(`http://localhost:8000/users/${editUser.id}`, updatedUser);
            console.log('Edit user with ID:', editUser.id);

            setOpenEditModal(false);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    const handleLogout = () => {
        // Clear logged-in user data from local storage
        localStorage.removeItem(loggedInUser);
        navigate('/login');
        toast.success('Logged out successfully');
    }
    return (
        <div>
            <div style={{ marginLeft: '1rem' }}><h2>Welcome, {loggedInUser}</h2>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        style={{ marginRight: '1rem' }} 
                                        onClick={() => handleEdit(user)}
                                        disabled={loggedInUser !== 'developer'}
                                    >Edit
                                    </Button>
                                    <Button 
                                    variant="outlined" 
                                    onClick={() => handleDelete(user.id)}
                                    disabled={ loggedInUser !== 'developer'}
                                    >Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={editedPassword}
                        onChange={(e) => setEditedPassword(e.target.value)}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </Button>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                    <Button onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
};

export default Home;
