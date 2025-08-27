import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import axios from 'axios'
import CustomButton from '../components/CustomButton';
import NavBar from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api.js';

export default function Profile() {
  let [err, setErr] = useState("");
  let [data, setData] = useState({});
  let token = JSON.parse(localStorage.getItem("userData")).token;
  let id = JSON.parse(localStorage.getItem("userData")).id;
  let navigate = useNavigate();
  
  useEffect(() => {
    fetchData();
  }, [])
  
  async function fetchData() {
    try {
      let res = await axios.get(`${API_BASE_URL}/profile/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        // alert("Profile data fetched");
        setData(res.data.data);
        // console.log(res.data.data);
      } else {
        alert("Something went wrong, please try again later");
      }
    } catch (error) {
      setErr(error.message);
      console.log(error);
    }
  }
  
  function logoutHandler() {
    localStorage.removeItem("userData");
    navigate("/login");
  }
  
  return (
    <>
      <NavBar login='true' title='MyNotes for Revision' username={data.name} id={id} />
      <div className={styles.profileCard}>
        {err && <p className={styles.err}>{err}</p>}
        <h1 className={styles.title}>Profile</h1>
        <div className={styles.profileInfo}>
          <p><span className={styles.label}>Name:</span> {data.name}</p>
          <p><span className={styles.label}>Email:</span> {data.email}</p>
          <p><span className={styles.label}>Role:</span> {data.role}</p>
          <p><span className={styles.label}>Phone:</span> {data.phone}</p>
        </div>
        <CustomButton btnText='Refresh' handler={fetchData} customStyle={styles.btn} />
        <CustomButton btnText='Edit Profile' handler={() => alert("Feature coming soon")} customStyle={styles.btn} />
        <CustomButton btnText='logout' handler={logoutHandler} customStyle={styles.btn} />
      </div>
    </>
  )
}
