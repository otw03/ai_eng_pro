const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Note 생성
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  console.log(title, content);
  try {
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note', error });
  }
});

// Note 목록 조회
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
});

// Note 단일 조회
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error });
  }
});

// Note 수정
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  console.log('수정', title, content);

  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
});

// Note 삭제
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndRemove(req.params.id);
    if (!deletedNote) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.status(200).json({ message: 'Note deleted', deletedNote });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
});

module.exports = router;
