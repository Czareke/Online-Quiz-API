const User = require('../Models/userModel.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('util');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};


//@desc user registration
exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        department: req.body.department,
        picture:req.body.picture
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: newUser,
    });
});


// @desc user login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    const token = signToken(user._id);
    res.json({
        status: 'success',
        token,
        data: user,
    });
});

// @desc restrict to admin
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Unauthorized to access this route', 403));
        }
        next();
    };
};

// @desc protect
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token from header and check if it exists
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access', 401)
    );
}
    // 2) Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(
            new AppError('The user belonging to this token no longer exists.', 401)
    );
    }
    // 4) Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please login again.', 401)
    );
    }
    // 5) Grant access to the protected route
    req.user = freshUser;
    next();
});