import express from 'express'
import { loginUser, registerUser, updateUser, getProfile } from '../controllers/userController.mjs';
import { authentication, authorization } from '../auth/authentication.mjs';
import { createBook, getBook } from '../controllers/bookController.mjs';
import { getNotes, createNote, updateNote, deleteNote, migrateNotes } from '../controllers/notesController.mjs';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile/:id', authentication, authorization, getProfile);
router.put('/update', authentication, authorization, updateUser)
router.get('/book', getBook)
router.post('/createbook', createBook)

// Notes routes with authentication
router.get('/notes', authentication, getNotes)
router.post('/createNote', authentication, createNote)
router.put('/updateNote/:id', authentication, updateNote)
router.delete('/deleteNote/:id', authentication, deleteNote)
router.post('/migrateNotes', authentication, migrateNotes) // Migration route for existing notes

export default router;