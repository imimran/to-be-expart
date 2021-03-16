//configure all dependencies...
const express = require('express');
const { uploadFile, uploadAvatar, form, multipleFile} = require('../middlewares/FileHandle')
const UserAuthController = require('../controllers/UserAuthController');


//init Router 
const router = express.Router();

router.post('/register', uploadAvatar, UserAuthController.register);
router.post('/login', form,  UserAuthController.login);
router.get("/all-users", UserAuthController.getAllUser);
router.get("/:ID", UserAuthController.getUser);
router.put("/:ID", uploadAvatar,  UserAuthController.updateUser);
router.post('/verify-token', UserAuthController.verifyToken)


module.exports = router;