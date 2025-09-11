import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  mood: {
    type: String
  },
  reflection: {
    type: String
  },
  suggestions: {
    type: [String]
  },
  severity: {
    type: String,
    enum: ["none", "urgent"],
    default: "none"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent re-compilation during development
export default mongoose.models.Journal || mongoose.model('Journal', JournalSchema);