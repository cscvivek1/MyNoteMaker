import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import LeftNav from '../components/LeftNav';

export default function Home() {
  let navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [id, setId] = useState("");
  let [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let token = userData?.token;
    if (!token) {
      navigate("/login");
    } else {
      setUsername(userData.name);
      setId(userData.id);
    }
  }, [])

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  return (
    <div>
      <Navigation login='true' title='MyNotes for Revision' username={username} id={id} />
      <div className={styles.container}>
        <div className={styles.left}>
          <LeftNav onNoteSelect={handleNoteSelect} />
        </div>
        <div className={styles.right}>
          <div className={styles.right_top}>
            <h1>My Notes</h1>
            {selectedNote && (
              <div className={styles.noteContent}>
                <h2>{selectedNote.title}</h2>
                <p>{selectedNote.content}</p>
              </div>
            )}
            {!selectedNote && (
              <div className={styles.welcomeMessage}>
                <h2>Welcome to MyNotes!</h2>
                <p>Select a note from the left sidebar to view its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
