const multer = require('multer');

//configuring multer storage for images
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-')
            + '-' + file.originalname);
    }
});

//filtering images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/x-icon' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
const formOnly = multer();

const multipleFile = upload.fields([
    { name: 'faviconFile', maxCount: 1 },
    { name: 'mainLogo', maxCount: 1 },
    { name: 'stickyLogo', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'notFoundFile', maxCount: 1 },
    { name: 'notFoundBgFile', maxCount: 1 },
    { name: 'footerBgFile', maxCount: 1 },
 
]);
const uploadFile = upload.single('image');
const uploadAvatar = upload.single('avatar');
const uploadCoverPhoto = upload.single('cover_photo');
const form = formOnly.none();


// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
module.exports = { multipleFile, uploadAvatar, uploadFile, uploadCoverPhoto, form }