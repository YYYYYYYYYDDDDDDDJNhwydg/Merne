const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage });

const uploadImage = upload.single('image');

const handleUpload = (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
};

module.exports = {
    uploadImage,
    handleUpload,
};