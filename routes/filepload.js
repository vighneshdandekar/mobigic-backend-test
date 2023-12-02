var express = require('express');
var router = express.Router();
const uuid = require('uuid');

// Set up storage for uploaded files

const { authenticate } = require('../middlewares/authentication');
const fileUpload = require('../model/fileUpload');
const assert = require('assert');
const { upload } = require('../middlewares/upload');

const fs = require('fs').promises;


router.get('/', authenticate, async function (req, res, next) {
    try {
        let fileExists = await fileUpload.find({ userId: req.user.id }).populate('originalName');
        return res.status(200).json(fileExists)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err?.message || err })
    }

})


router.post('/upload', authenticate, upload.single('file'), async function (req, res, next) {
    try {
        const fileData = {
            path: req.file.path,
            originalName: req.file.originalname,
        };
        let fileId = uuid.v1();
        let userId = req?.user?.id
        let fileRef = new fileUpload({ path: fileData?.path, originalName: fileData?.originalName, fileId: fileId, userId: userId, password: "123456" })
        await fileRef.save();
        return res.status(200).json({ message: "File uploaded successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err?.message || err })
    }
});

router.get('/:id/:password', authenticate, async function (req, res, next) {
    try {
        const query = { fileId: req.params.id, userId: req.user.id, password: req.params.password }
        let fileExists = await fileUpload.findOne(query);
        assert(fileExists, 'File does not exists ?')
        const fileName = decodeURIComponent(fileExists.path);
        var apiUrl = 'http://localhost:3000'; // Replace with your API endpoint

        return res.status(200).json({ url: `${apiUrl}/${fileName}`, fileName: fileExists.originalName })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err?.message || err })
    }

})


router.delete('/:id', authenticate, async function (req, res, next) {
    try {
        const query = { fileId: req.params.id, userId: req.user.id }
        let fileExists = await fileUpload.findOne(query);
        console.log(fileExists.path)
        assert(fileExists, 'File does not exists ?')
        await fs.unlink(fileExists.path)
        await fileUpload.deleteOne(query);

        return res.status(200).json({ message: "File permanently deleted" })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err?.message || err })
    }

})


module.exports = router;
