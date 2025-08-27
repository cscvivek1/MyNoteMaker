import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styles from './CreateNote.module.css'
import API_BASE_URL from '../config/api.js'

export default function CreateNote() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
 console.log(API_BASE_URL);
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

      const response = await axios.post(`${API_BASE_URL}/createNote`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        // Clear form after successful creation
        setFormData({ title: '', content: '' })
        // Optionally navigate back to notes list or show success message
        alert('Note created successfully!')
        navigate('/') // Navigate back to home/notes list
      }
    } catch (error) {
      console.error('Error creating note:', error)
      if (error.response?.status === 401) {
        navigate('/login')
      } else {
        setError(error.response?.data?.message || 'Failed to create note')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create New Note</h2>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter note title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter note content"
              rows="8"
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
