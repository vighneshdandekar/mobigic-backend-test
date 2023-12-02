var mongoose = require('mongoose');
main().catch(err => console.log(err));
const User = require('../model/User');
const { decrytPassword } = require('../routes/authentication');
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
var debug = require('debug')('mobigic-backend:server');

async function testQueries(req, res, next) {
    try {
        const sharp = require('sharp');
        const fs = require('fs');

        const imageFilePath = 'home/vighnesh/vighnesh_workspace/mobigic-backend/uploads/4ba2afc0-903a-11ee-90ca-e3fa1dbee7fcsample-file.txt';
        const outputFilePath = 'home/vighnesh/vighnesh_workspace/mobigic-backend/uploads/protected/ff084e40-904d-11ee-9eec-09b9e66358fbssc-2009.jpeg';
        const password = 'Vd@1234*';

        // await main()
        // const password = 'Vd@1234*';
        // const username = 'Vighnesh';
        // const userHashed = await User.findOne({ username })
        // const hashedPassword = await decrytPassword(password, userHashed.password);
        // debug(hashedPassword)
        // const validUser = await User.findOne({ username: username, password: hashedPassword })
        // debug('validUser' + validUser)
        // // assert(validUser, 'Invalid Password')
        // return res.status(200).json(validUser)

        const data = await sharp(imageFilePath).toBuffer();
        const protectedData = Buffer.concat([Buffer.from(password), data]);
        // Save the password-protected image
        fs.writeFileSync(outputFilePath, protectedData);

        return true

    } catch (err) {
        debug(err)
        return res.status(500).json({ message: err })
    }
}

const req = {

}
const res = {
    status: function (errCode) {
        return res
    },
    json: function (obj) {
        console.log(obj)
    }
}
const next = function () { };

testQueries(req, res, next)
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
    .finally(d => {
        process.exit(0)
    })