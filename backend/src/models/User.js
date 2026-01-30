import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    // NEW FIELDS
  resetOtp: String,
  resetOtpExpire: Date,


    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // never return by default
    },

    // from Register page (optional fields)
    farmName: {
      type: String,
      trim: true,
      sparse: false,
    },

    location: {
      type: String,
      trim: true,
      sparse: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatarUrl: {
      type: String,
      default: null,
    },


    farms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save if modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Instance method for login password comparison
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Optional: clean JSON output
userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
