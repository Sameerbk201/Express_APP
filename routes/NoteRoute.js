const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { authenticate, resFunc } = require("../utility/Utility");
const Note = require("../database/NoteModal");

router.route("/test").get(authenticate, (req, res) => {
  return res.json(req.user);
});

//note creation route
router.route("/createnote").post(authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) throw new Error("ALL FIELDS REQUIRED");
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    const noteData = new Note({
      user: req.user._id,
      title: title,
      content: content,
    });
    const note = await noteData.save();
    return res.json(resFunc(true, note));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});

//note creation route
router.route("/createprivatenote").post(authenticate, async (req, res) => {
  try {
    const { title, content, key } = req.body;
    console.log(req.body, req.user);
    if (!title || !content || !key) throw new Error("ALL FIELDS REQUIRED");
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    const noteData = new Note({
      user: req.user._id,
      title: title,
      content: content,
      isPrivate: true,
      key: key,
    });
    const note = await noteData.save();
    console.log({ note });
    return res.json(resFunc(true, note));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});
//note fetch all notes
router.route("/fetchallnotes").get(authenticate, async (req, res) => {
  try {
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    return res.json(resFunc(true, notes));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});

//note make private
router.route("/makeprivate/:noteId").put(authenticate, async (req, res) => {
  try {
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    if (!req.params.noteId) throw new Error("No note selected to update");
    const { key } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      {
        isPrivate: true,
        key: key,
      },
      { new: true }
    );
    return res.json(resFunc(true, note));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});
//note make update note
router.route("/updatenote/:noteId").put(authenticate, async (req, res) => {
  try {
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    if (!req.params.noteId) throw new Error("No note selected to update");
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      {
        title: title,
        content: content,
      },
      { new: true }
    );
    return res.json(resFunc(true, note));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});

//delete note
router.route("/deletenote/:noteId").delete(authenticate, async (req, res) => {
  try {
    if (!req.user) throw new Error("NOT AUTHENTICATED");
    if (!req.params.noteId) throw new Error("No note selected to update");
    const note = await Note.findByIdAndDelete(req.params.noteId);
    return res.json(resFunc(true, "NOTE SUCESSFULLY DELTED"));
  } catch (error) {
    return res.json(resFunc(false, error.message));
  }
});

module.exports = router;
