import React, { useEffect, useState } from 'react'
import styles from './LeftNav.module.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../config/api.js'

export default function LeftNav({ onNoteSelect }) {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userData = localStorage.getItem('userData')
        if (!userData) {
          navigate('/login')
          return
        }

        const { token } = JSON.parse(userData)
        if (!token) {
          navigate('/login')
          return
        }

        const response = await axios.get(`${API_BASE_URL}/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        setNotes(response.data.notes)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching notes:', error)
        if (error.response?.status === 401) {
          navigate('/login')
        } else {
          setError(error.response?.data?.message || 'Failed to fetch notes')
        }
        setLoading(false)
      }
    }

    fetchNotes()
  }, [navigate])

  const handleNoteClick = (note) => {
    setSelectedNoteId(note._id)
    onNoteSelect(note)
  }

  const handleUpdateNote = (note) => {
    navigate(`/updatenote/${note._id}`)
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return
    try {
      const userData = localStorage.getItem('userData')
      if (!userData) {
        navigate('/login')
        return
      }
      const { token } = JSON.parse(userData)
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setNotes(notes.filter(n => n._id !== noteId))
      if (selectedNoteId === noteId) setSelectedNoteId(null)
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  return (
    <div className={styles.sidebar}>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      <div className={styles.header}>
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '22px', margin: 0 }}>My Notes</h2>
        <Link to="/createnote" className={styles.createButton}>
          + New Note
        </Link>
      </div>

      <div className={styles.notesList}>
        {notes.length === 0 && !loading && !error && (
          <p className={styles.noNotes}>No notes found. Create your first note!</p>
        )}
        {notes.map((note) => (
          <div
            key={note._id}
            className={`${styles.noteItem} ${selectedNoteId === note._id ? styles.selected : ''}`}
            onClick={() => handleNoteClick(note)}
            style={{ position: 'relative', paddingRight: '60px' }}
          >
            <h3 className={styles.noteTitle}>{note.title}</h3>
            <div className={styles.noteActions} onClick={e => e.stopPropagation()}>
              <button
                className={styles.actionButton}
                title="Update"
                onClick={() => handleUpdateNote(note)}
              >✏️</button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                title="Delete"
                onClick={() => handleDeleteNote(note._id)}
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}