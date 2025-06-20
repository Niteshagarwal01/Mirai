import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false, // Made optional to match your existing database structure
    unique: true,
    sparse: true,    // Only enforces uniqueness for documents that have this field
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false  // Made optional to match your existing database structure
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  age: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
