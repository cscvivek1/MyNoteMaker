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
  let [editMode, setEditMode] = useState(false);
  let [form, setForm] = useState({ name: "", role: "", phone: "" });

  let token = JSON.parse(localStorage.getItem("userData")).token;
  let id = JSON.parse(localStorage.getItem("userData")).id;
  let email = JSON.parse(localStorage.getItem("userData")).email;
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
        setData(res.data.data);
        setForm({
          name: res.data.data.name,
          role: res.data.data.role,
          phone: res.data.data.phone
        });
      }
    } catch (error) {
      setErr(error.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      let res = await axios.put(`${API_BASE_URL}/update`, 
        { email, name: form.name, role: form.role, phone: form.phone },
        {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        }
      );
      if (res.status === 200 || res.status === 201) {
        alert("Profile updated successfully");
        setEditMode(false);
        fetchData();
      } else {
        setErr("Update failed, try again");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Update failed");
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

        {editMode ? (
          <form className={styles.form} onSubmit={handleUpdate}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={styles.inputField}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={styles.inputField}
            />
            <CustomButton btnText='Save' handler={handleUpdate} customStyle={styles.btn} />
            <CustomButton btnText='Cancel' handler={() => setEditMode(false)} customStyle={styles.btn} />
          </form>
        ) : (
          <div className={styles.profileInfo}>
            <p><span className={styles.label}>Name:</span> {data.name}</p>
            <p><span className={styles.label}>Email:</span> {data.email}</p>
            <p><span className={styles.label}>Role:</span> {data.role}</p>
            <p><span className={styles.label}>Phone:</span> {data.phone}</p>
            <CustomButton btnText='Edit Profile' handler={() => setEditMode(true)} customStyle={styles.btn} />
          </div>
        )}

        <CustomButton btnText='Refresh' handler={fetchData} customStyle={styles.btn} />
        <CustomButton btnText='Logout' handler={logoutHandler} customStyle={styles.btn} />
      </div>
    </>
  )
}
