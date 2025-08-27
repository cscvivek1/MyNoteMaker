import React, { useState } from "react";
import styles from "./Login.module.css";
import CustomButton from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../config/api.js';

export default function SignUp() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPass, setCPass] = useState("");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setErr("Please enter name");
      return;
    }
    if (!email) {
      setErr("Please enter email");
      return;
    }
    if (!password) {
      setErr("Please enter password");
      return;
    }
    if (password !== cPass) {
      setErr("Password and Confirm Password must be same");
      return;
    }
    if (!role) {
      setErr("Please select role");
      return;
    }
    if (!phone) {
      setErr("Please enter phone number");
      return;
    }
    if (phone.length !== 10) {
      setErr("Please enter valid phone number");
      return;
    }
    setErr("");
    console.log(email, password, name, role, phone);
    let payload = { name, email, password, role, phone };
    try {
      let res = await axios.post(`${API_BASE_URL}/register`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //   console.log(res);
      if (res.status === 201) {
        alert("User registered successfully");
        navigate("/login");
      } else {
        setErr("Something went wrong, please try again later");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErr(error.response?.data?.message || "Something went wrong, please try again later");
    }
  };
  
  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Sign Up</h1>
      {err && <p className={styles.err}>{err}</p>}
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Enter Your Name"
          className={styles.inputField}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          className={styles.inputField}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create Password"
          className={styles.inputField}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.inputField}
          onChange={(e) => setCPass(e.target.value)}
        />
        <select
          className={styles.select}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </select>
        <input
          type="text"
          placeholder="Enter Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          className={styles.inputField}
        />
        <CustomButton btnText="Register" handler={handleSubmit} />
      </form>
      <p>
        Already have an account? <Link to={"/login"}>Click to login here</Link>
      </p>
    </div>
  );
}
