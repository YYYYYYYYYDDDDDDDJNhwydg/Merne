const express = require('express');
const { createPost, getAll, getOne, getLastTags, update, remove } = require('../controller/postController');
const checkAuth = require('../utils/cheackAuth');
const handleValidationErrors = require('../utils/handleValidationErrors');
const { postCreateValidations } = require('../validations/postValidations');

const router = express.Router();

router.get('/tags', getLastTags);

router.post('/posts', checkAuth, postCreateValidations, createPost);
router.get('/posts', getAll);
router.get('/posts/:id', getOne);
router.get('/posts/tags', getLastTags);
router.patch('/posts/:id', checkAuth, postCreateValidations, handleValidationErrors, update);
router.delete('/posts/:id', checkAuth, remove);


module.exports = router;
