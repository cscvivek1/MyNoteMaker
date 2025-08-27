import React, { useState } from 'react'
import styles from './Login.module.css'
import CustomButton from '../components/CustomButton'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../config/api.js'

export default function Login() {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErr("Please enter email");
            return;
        }
        if (!password) {
            setErr("Please enter password");
            return;
        }
        setErr("");
        try {
            let res = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                alert("Login successful");
                localStorage.setItem("userData", JSON.stringify(res.data.data));
                navigate("/");
            } else {
                setErr("Something went wrong, please try again later");
            }
        } catch (error) {
            console.error('Login error:', error);
            setErr(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    }
    
    return (
        <div className={styles.login}>
            <h1 className={styles.title}>Login to Continue</h1>
            {err && <p className={styles.err}>{err}</p>}
            <form className={styles.form}>
                <input type="email" placeholder='Username' className={styles.inputField} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Password' className={styles.inputField} onChange={(e) => setPassword(e.target.value)} />
                <CustomButton btnText='Login' handler={handleSubmit} />
            </form>
            <p>don't have account? <Link to={"/register"}>Click to create here</Link></p>
        </div>
    )
}
