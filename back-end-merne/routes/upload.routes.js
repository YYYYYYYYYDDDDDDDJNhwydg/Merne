const express = require('express');
const { uploadImage, handleUpload } = require('../controller/upload.controller');

const router = express.Router();

router.post('/upload', uploadImage, handleUpload);

module.exports = router;
