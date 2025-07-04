import React, {useState} from 'react';
import './SignUpPage.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // useNavigate hook to perform navigation

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  

  const SubmitHandle = (event) =>{
    event.preventDefault();
    
    const signUpCredentials={
      name,
      rollNumber,
      email,
      branch,
      section,
      password,
    };
    if(password !== confirmPassword)
    {
      alert("Passwords do not match!");
      return;
    }

    console.log(signUpCredentials);
    axios
      .post("http://localhost:5000/signup", signUpCredentials)
      .then((response)=>{
        console.log(response.data);
        alert(`User ${name} has been registered successfully!`);
        login(); // Update the authentication state
        navigate('/'); // Navigate to the home page
        setName('');
        setRollNumber('');
        setEmail('');
        setBranch('');
        setSection('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((error)=>{
        console.log(error);
        alert(error.response.data.error);
      })
    
    

  }
  return (
  <div id='signup-container'>
    <main id="signup-main">
      <h2>Sign Up </h2>
      <p>
            <a href="/login">Already had an Account?</a>
      </p>
      {/* Sign Up Form */}
      <form onSubmit={SubmitHandle}>
        {/* Form Inputs */}
        <label htmlFor="name">Student Name:</label>
        <input id="name" type="text" value={name} onChange={(event)=>setName(event.target.value)} required/>

        <label htmlFor="rollno">Student Roll Number:</label> 
        <input id="rollno" type="text" value={rollNumber} onChange={(event)=>setRollNumber(event.target.value)} required/>

        <label htmlFor="email">Email:</label>
        <input id="email" type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required/>

        <label htmlFor="branch">Branch:</label>
        <select value={branch} onChange={(event)=>setBranch(event.target.value)} placeholder='Select Your Branch' required>
          <option value="" disabled selected hidden>Select Your Branch</option>
          <option name="branch">IT</option>
        </select>

        <label htmlFor="section">Section:</label>
        <select value={section} onChange={(event)=>setSection(event.target.value)} required>
        <option value="" disabled selected hidden>Select Your Class Section</option> 
          <option name="section">A</option>
          <option name="section">B</option>
          <option name="section">C</option>
        </select>

        <label htmlFor="password" >Password:</label>
        <input id="password" type="password" value={password} onChange={(event)=>setPassword(event.target.value)} required/>

        <label htmlFor="confirm-password" >Confirm Password:</label>
        <input id="confirm-password" type="password" value={confirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)} required/>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>
    </main>
    </div>
  );
};

export default SignUpPage;
