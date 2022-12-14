var fs = require('fs');
const {
    compare,
    hash,
    genSalt
} = require('bcryptjs');
var { sign, verify } = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const { User } = require('../database/models/user.model');
const { PasswordReset } = require('../database/models/passwordReset.modal');

const { CustomError, tokenSchema } = require('../utils');
const { passwordSchema } = require('../utils/validation.schemas/password.validation');
const { loginSchema, registerSchema, emailSchema } = require('../utils/validation.schemas/user.validation');
const path = require('path');


const login = async (req, res, next) => {
    try {
        const { email, password, loginType } = await loginSchema.validateAsync(req.body);
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError(400, "User doesnt exist");
        }
        if (loginType === user.loginType) {
            if (loginType === 'user') {
                const isValid = await compare(password, user.password);
                if (!isValid) {
                    throw new CustomError(400, "Password doesnt match");
                }
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
        } else {
            throw new CustomError(400, `Login as ${user.loginType} instead`);
        }
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
        const { name, email, password, loginType } = await registerSchema.validateAsync(req.body);
        let isValid = await User.findOne({ email });
        if (isValid) {
            throw new CustomError(400, "User already exists");
        }
        if (loginType === 'google') {
            const user = new User({
                name,
                email,
                password: '0000',
                loginType: 'google'
            });
            await user.save();
            const token = sign({ id: user._id, name: user.name, role: user.role }, process.env.SECRET_KEY);
            res.cookie('_token', token).json({ message: "Welcome user", token });
        } if (loginType === 'facebook') {
            const user = new User({
                name,
                email,
                password: '0000',
                loginType: 'facebook'
            });
            await user.save();
            const token = sign({ id: user._id, name: user.name, role: user.role }, process.env.SECRET_KEY);
            res.cookie('_token', token).json({ message: "Welcome user", token });
        }
        else {
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);
            const user = new User({
                name,
                email,
                password: hashedPassword,
                loginType: 'user'
            });
            await user.save();
            const token = sign({ id: user._id, name: user.name, role: user.role }, process.env.SECRET_KEY);
            res.cookie('_token', token).json({ message: "Welcome user", token });
        }
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



const sendResetEmail = async (req, res, next) => {
    try {
        const { email } = await emailSchema.validateAsync(req.body);
        let user = await User.findOne({ email, loginType: 'user' });
        if (!user) {
            throw new CustomError(400, "Email doesn't exist");
        }
        const filePath = path.join(__dirname, '..', 'public', 'email-template.html');
        const html = fs.readFileSync(filePath, { encoding: 'utf-8' })
        const template = handlebars.compile(html);

        const payload = {
            id: user._id,
            email: email,
        }
        const token = sign(payload, process.env.SECRET_KEY);
        const replacements = {
            name: user.name,
            action_url: `http://localhost:3000/reset/?token=${token}`,
        };
        const htmlToSend = template(replacements);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'heenoow@gmail.com',
                pass: process.env.TWOFA,
            },
        });
        const response = await transporter.verify()
        if (response) {
            transporter.sendMail(
                {
                    from: "Todo App",
                    to: email,
                    subject: "Reset Todo App Email",
                    html: htmlToSend,
                }
            )
            const resetDoc = new PasswordReset({
                user_id: user._id,
                user_token: token,
            })
            resetDoc.save();
            res.send({ message: 'Message sent successfully, check your mail!' });
        } else {
            throw new CustomError(400, 'Email could not be sent')
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error);
    }
}

const resetEmail = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.query);
        const requestedUser = await PasswordReset.findOne({ user_token: token });
        if (!requestedUser) {
            throw new CustomError(400, "User doesn't exist");
        }
        const passed24 = (new Date() - requestedUser.createdAt) / 1000 / 60 / 60 > 24;
        if (passed24) {
            throw new CustomError(400, "Verification email expired");
        }
        const { password, confirmPassword } = await passwordSchema.validateAsync(req.body);
        if (password !== confirmPassword) {
            throw new CustomError(400, "Password doesnt match");
        }
        if (password.length < 5) {
            throw new CustomError(400, "Password length must be atleast 5 characters");
        }
        if (requestedUser.isResetted) {
            throw new CustomError(400, "Wait 24h to reset your password");
        }
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        await User.updateOne({
            _id: requestedUser.user_id,
        }, {
            password: hashedPassword
        })
        await PasswordReset.updateOne({
            user_token: token
        }, {
            $set: {
                isResetted: true
            }
        })
        res.send({ message: 'Password successfully changed' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error);
    }
}

module.exports = {
    create,
    login,
    logout,
    checkAuth,
    updateUserToken,
    changePassowrd,
    setLocale,
    sendResetEmail,
    resetEmail
}