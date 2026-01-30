import jwt from 'jsonwebtoken';
import User from '../models/User.js';



// Generate random 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// NEW: update profile fields
export async function updateProfile(req, res, next) {
  try {
    const { name, farmName, location } = req.body;

    const updates = {};
    if (name != null) updates.name = name;
    if (farmName != null) updates.farmName = farmName;
    if (location != null) updates.location = location;

    const userId = req.user.id || req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('name email role farmName location avatarUrl');

    res.json({ user });
  } catch (err) {
    next(err);
  }
}


// NEW: handle avatar upload
export async function uploadAvatar(req, res, next) {
  try {
    console.log('uploadAvatar hit, file =', req.file); // debug

    if (!req.file) {
      const err = new Error('No file uploaded');
      err.status = 400;
      throw err;
    }

    const mime = req.file.mimetype || 'image/jpeg';
    const base64 = req.file.buffer.toString('base64');
    const avatarUrl = `data:${mime};base64,${base64}`;

    const userId = (req.user && (req.user.id || req.user._id)) || null;
    if (!userId) {
      const err = new Error('Authenticated user not found');
      err.status = 401;
      throw err;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true }
    ).select('name email role farmName location avatarUrl');

    if (!user) {
      const err = new Error('User not found while updating avatar');
      err.status = 404;
      throw err;
    }

    res.json({ user, avatarUrl });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    next(err);
  }
}


export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const farmName = req.body.farmName;
    const location = req.body.location;

    console.log('=== REGISTRATION DEBUG ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('farmName:', farmName, 'type:', typeof farmName, 'exists in body:', 'farmName' in req.body);
    console.log('location:', location, 'type:', typeof location, 'exists in body:', 'location' in req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Build user data - ALWAYS include farmName and location if they exist in request
    const userData = {
      name,
      email,
      password,
      farmName: farmName || '', // Include even if empty
      location: location || ''  // Include even if empty
    };

    // Add farmName if key exists in request body (check if key exists, not just value)
    if ('farmName' in req.body) {
      const trimmed = String(farmName || '').trim();
      if (trimmed !== '') {
        userData.farmName = trimmed;
        console.log('✓ Adding farmName:', trimmed);
      } else {
        console.log('✗ farmName is empty, skipping');
      }
    } else {
      console.log('✗ farmName key not found in request body');
    }

    // Add location if key exists in request body (check if key exists, not just value)
    if ('location' in req.body) {
      const trimmed = String(location || '').trim();
      if (trimmed !== '') {
        userData.location = trimmed;
        console.log('✓ Adding location:', trimmed);
      } else {
        console.log('✗ location is empty, skipping');
      }
    } else {
      console.log('✗ location key not found in request body');
    }

    console.log('User data to create:', JSON.stringify(userData, null, 2));
    console.log('========================');

    const user = await User.create(userData);
    
    console.log('User created - ID:', user._id);
    console.log('user.farmName:', user.farmName);
    console.log('user.location:', user.location);
    
    // Force reload from database to verify
    const savedUser = await User.findById(user._id);
    console.log('After reload - farmName:', savedUser?.farmName, 'location:', savedUser?.location);

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmName: user.farmName || null,
        location: user.location || null,
        avatarUrl: user.avatarUrl || null,   // 👈 add this
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmName: user.farmName || null,
        location: user.location || null,
        avatarUrl: user.avatarUrl || null,   // 👈 add this
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  // assuming auth middleware put a safe user object on req.user
  res.json({ user: req.user });
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}


// 1️⃣ FORGOT PASSWORD — SEND OTP
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // ⛔ Real email not required — just return OTP
    res.json({
      message: "OTP generated successfully",
      otp, // <— Show OTP in frontend for now
    });
  } catch (err) {
    next(err);
  }
}

// 2️⃣ RESET PASSWORD — VERIFY OTP + UPDATE PASSWORD
export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: "Password Changed successfully" });
  } catch (err) {
    next(err);
  }
}

export async function removeAvatar(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: null },
      { new: true }
    ).select('name email role farmName location avatarUrl');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Avatar removed successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
}


