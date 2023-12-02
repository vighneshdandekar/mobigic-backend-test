var express = require('express');
var router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const assert = require('assert');
var debug = require('debug')('mobigic-backend:server');
const jwt = require('jsonwebtoken');
const privateKey = process?.env?.jwtprivatekey || "u378ewndwfb23r7y38ru";
const uuid = require('uuid');
router.post('/register', async function (req, res, next) {
    try {
        const password = req?.body?.password
        const username = req?.body?.username
        assert(password, 'Password is required')
        assert(username, 'username is required')
        const hashedPassword = await encryptPassword(password)
        const userId = uuid.v1()
        const newUser = new User({ username: username, password: hashedPassword, userId: userId });
        let register = await newUser.save();
        return res.status(201).json({ message: "Registered successfully" })
    } catch (err) {
        return res.status(500).json({ message: err?.message || err })
    }
});

router.post('/login', async function (req, res, next) {
    try {
        const password = req?.body?.password
        const username = req?.body?.username
        assert(password, 'Password is required')
        assert(username, 'username is required')
        const userHashed = await User.findOne({ username })
        const hashedPassword = await decrytPassword(password, userHashed.password);
        const validUser = await User.findOne({ username })
        let jwt_token = await generateToken({ userId: validUser.userId })
        assert(validUser, 'Invalid Password')
        return res.status(200).json({ seessionToken: jwt_token })
    } catch (err) {
        debug(err)
        return res.status(500).json({ message: err })
    }
});

async function generateToken(data) {
    try {

        var token = await jwt.sign(
            data,
            privateKey, {
            expiresIn: '15h'
        }
        );
        return token
    } catch (err) {
        throw Error(err)
    }
}

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, Salt) {
            if (err) {
                reject({ status: false, error: err })
            }
            bcrypt.hash(password, Salt, function (err, hash) {
                if (err) {
                    reject({ status: false, error: err })
                }
                else {
                    resolve(hash)
                }
            })
        })
    })

}
let decrytPassword = function (password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword,
            async function (err, isMatch) {
                if (err) {
                    reject({ status: false, message: err })
                }
                else if (isMatch) {
                    resolve({ status: true })
                }
                else {
                    reject({ status: false, message: "Password did not matched" })
                }
            })
    })
}

exports.decrytPassword = decrytPassword



module.exports = router;
