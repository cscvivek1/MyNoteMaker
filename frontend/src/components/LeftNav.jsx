import React from 'react'
import styles from './LeftNav.module.css'   
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
        // Get user data from localStorage
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
          // Unauthorized - redirect to login
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

  const handleMigrateNotes = async () => {
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

      const response = await axios.post(`${API_BASE_URL}/migrateNotes`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        alert(`Migration successful: ${response.data.message}`)
        // Refresh notes after migration
        window.location.reload()
      }
    } catch (error) {
      console.error('Error migrating notes:', error)
      alert('Migration failed: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}
      
      <div className={styles.header}>
        <h2>My Notes</h2>
        <Link to="/createnote" className={styles.createButton}>
          + New Note
        </Link>
      </div>
      
      {/* Migration button - remove this after migration is complete */}
      <div className={styles.migrationSection}>
        <button onClick={handleMigrateNotes} className={styles.migrateButton}>
          Migrate Notes
        </button>
        <p className={styles.migrationNote}>Click this if you have existing notes without user ID</p>
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
          >
            <h3 className={styles.noteTitle}>{note.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
