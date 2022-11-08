
const {
    compare,
    hash,
    genSalt
} = require('bcryptjs');
var { sign } = require('jsonwebtoken');
const { User } = require('../database/models/user.model');
const { CustomError } = require('../utils');
const { passwordSchema } = require('../utils/validation.schemas/password.validation');
const { loginSchema, registerSchema } = require('../utils/validation.schemas/user.validation');


const login = async (req, res, next) => {
    try {
        const { email, password } = await loginSchema.validateAsync(req.body);
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError(400, "User doesnt exist");
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
            throw new CustomError(400, "Password doesnt match");
        }
        const payload = {
            id: user._id,
            name: user.name,
            role: user.role,
        }
        const token = sign(payload, process.env.SECRET_KEY);

        res.cookie('_token', token).json({
            message: "Welcome user",
            data: {
                user: payload, //remove this line
                token
            }
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const { name, email, password } = await registerSchema.validateAsync(req.body);
        let isValid = await User.findOne({ email });
        if (isValid) {
            throw new CustomError(400, "User already exists");
        }
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        const token = sign({ id: user._id, name: user.name, role: user.role }, process.env.SECRET_KEY);
        res.cookie('_token', token).json({ message: "Welcome user", token });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error);
    }
}

const logout = async (req, res, next) => {
    res.clearCookie('_token').json({ message: "logged out successfully" })
}

const checkAuth = async (req, res) => {
    const { user } = req;
    const { locale } = await User.findOne({ _id: user.id });
    res.json({ data: { ...user, locale } });
}

const updateUserToken = async (req, res) => {
    try {
        const { notifyToken, userId } = req.body;
        await User.updateOne({
            _id: userId
        }, {
            $set: {
                notifyToken: notifyToken
            }
        })
        res.send({ message: 'User notification token registered' });
    }
    catch (error) {
        next(error)
    }
}

const changePassowrd = async (req, res, next) => {
    try {
        const { password, confirmPassword } = await passwordSchema.validateAsync(req.body);
        if (password !== confirmPassword) {
            throw new CustomError(400, "Password doesnt match");
        }
        if (password.length < 5) {
            throw new CustomError(400, "Password length should be atleast 5 characters");
        }
        const user = await User.findOne({
            _id: req.user.id
        });

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        await user.updateOne({
            $set: {
                password: hashedPassword
            }
        });

        res.send({ message: 'Password successfully changed' });
    }
    catch (error) {
        next(error)
    }
}

const setLocale = async (req, res, next) => {
    try {
        const { userId, locale } = req.body;
        await User.updateOne({ _id: userId }, {
            $set: {
                locale
            }
        })
        res.send({ message: "Locale set" })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    login,
    logout,
    checkAuth,
    updateUserToken,
    changePassowrd,
    setLocale
}