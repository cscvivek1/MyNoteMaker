import NotesModel from "../models/notesModel.mjs";

const getNotes = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        const notes = await NotesModel.find({ userId: userId });
        return res.status(200).send({
            success: true,
            message: "Notes fetched successfully",
            notes
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send({ message: error.message });
    }
}

const createNote = async (req, res) => {
    try {
        let data = req.body;
        data.userId = req.user.id; // Add user ID to the note data
        let notes = await NotesModel.create(data);
        return res.status(201).send({
            success: true,
            message: "Note created successfully",
            notes
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).send({ message: error.message });
    }
}

const updateNote = async (req, res) => {    
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        
        // Find note and ensure it belongs to the user
        const note = await NotesModel.findOneAndUpdate(
            { _id: noteId, userId: userId }, 
            req.body, 
            { new: true }
        );
        
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found or you don't have permission to update it"
            });
        }
        
        res.status(200).send({
            success: true,
            message: "Note updated successfully",
            note
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).send({ message: error.message });
    }
}

const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        
        // Find note and ensure it belongs to the user
        const note = await NotesModel.findOneAndDelete({ _id: noteId, userId: userId });
        
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found or you don't have permission to delete it"
            });
        }
        
        res.status(200).send({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send({ message: error.message });
    }
}

// Helper function to migrate existing notes (run this once if you have existing notes without userId)
const migrateNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await NotesModel.updateMany(
            { userId: { $exists: false } },
            { $set: { userId: userId } }
        );
        
        res.status(200).send({
            success: true,
            message: `Migrated ${result.modifiedCount} notes to user ${userId}`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error migrating notes:', error);
        res.status(500).send({ message: error.message });
    }
}

export { getNotes, createNote, updateNote, deleteNote, migrateNotes }
