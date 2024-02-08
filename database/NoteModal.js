const mongoose = require("mongoose");
const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    key: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
