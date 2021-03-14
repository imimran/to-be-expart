// //configure all dependencies...
// const express = require('express');
// const { uploadFile, form, multipleFile} = require('../middlewares/FileHandle')
// // const validation = require('../../config/validation');
// //init Router 
// const router = express.Router();
// const authMiddlwere = require('../../middlewares/auth'); 



// // Controllers
// const AdminAuthController = require('../../controllers/v2/AdminAuthController');
// const PostController = require('../../controllers/v2/PostController')
// const CategoryController = require('../../controllers/v2/CategoryController')
// const TagController = require('../../controllers/v2/TagController')
// const SiteOptionsController = require('../../controllers/v2/SiteOptionsController')



// // Routes

// router.post('/login', form, AdminAuthController.login);
// router.post('/logout', form, AdminAuthController .logout);


// router.post('/post',  authMiddlwere.checkIfLoggedIn, uploadFile, PostController.addPost);
// router.get('/get-post/:ID', PostController.getPostById);
// router.put('/post/:ID', uploadFile, authMiddlwere.checkIfLoggedIn, PostController.updatePost);
// router.post('/delete-post/:ID', authMiddlwere.checkIfLoggedIn, PostController.deletePost);


// router.post('/category', form, authMiddlwere.checkIfLoggedIn, CategoryController.addCategory);
// router.put('/category/:term_id', form, authMiddlwere.checkIfLoggedIn, CategoryController.updateCategory);
// router.get('/all-category', authMiddlwere.checkIfLoggedIn, CategoryController.allCategory);


// router.get('/get-post-search', PostController.getPostSearch);
// router.get('/all-tags', TagController.allTags);
// router.get('/all-posts', PostController.getAllPosts);
// router.get('/date-wise-posts', PostController.getDatePosts);

// router.get('/get-site-options', authCheckMiddlwere.checkIfLoggedIn, SiteOptionsController.getSiteOptions);
// router.post('/add-site-option', multipleFile, SiteOptionsController.addSiteOptions);
// router.get('/edit-site-option/:id', authCheckMiddlwere.checkIfLoggedIn, SiteOptionsController.editSiteOptions);
// router.post('/update-site-option/:id', multipleFile, SiteOptionsController.updateSiteOptions);

// module.exports = router;