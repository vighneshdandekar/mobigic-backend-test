const multer = require('multer');
const uuid = require('uuid')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = uuid.v1() + file.originalname;
        cb(null, fileName);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

exports.upload = upload