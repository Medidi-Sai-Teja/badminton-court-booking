import React, {useState} from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // useNavigate hook to perform navigation

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const SubmitHandle = (event) =>{
    event.preventDefault();
    
    const loginCredentials={
      name,
      rollNumber,
      email,
      password,
    };

    console.log(loginCredentials);
    axios
      .post("http://localhost:5000/login", loginCredentials)
      .then((response)=>{
        console.log(response.data);
        login(); // Update the authentication state◘
        alert(`User ${name} has been logged in successfully!`);
        navigate('/'); // Navigate to the home page
        setName('');
        setRollNumber('');
        setEmail('');
        setPassword('');
      })
      .catch((error)=>{
        console.log(error);
        alert(error.response.data.error);
      })
  }

  return (
    <div id="container">
      <main id="login-main">
        <h2>Log in</h2>
        {/* Login Form */}
        <form onSubmit={SubmitHandle}>
          {/* Form Inputs */}
          <label>Student Name:</label>
          <input type="text" onChange={(event)=>setName(event.target.value)}/>

          <label>Student Roll Number:</label>
          <input type="text" onChange={(event)=>setRollNumber(event.target.value)}/>

          <label>Email:</label>
          <input type="email" onChange={(event)=>setEmail(event.target.value)}/>

          <label >Password:</label>
          <input type="password" onChange={(event)=>setPassword(event.target.value)}/>


          {/* SignUpPage Link */}
          <p>
            <a href="/signup">Create New Account</a>
          </p>


          {/* Submit Button */}
          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
