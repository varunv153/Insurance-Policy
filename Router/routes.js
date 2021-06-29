const express = require('express');
const controller = require('../Controllers/controller.js')
const middleware = require('../Middlewares/middleware.js');
const router = express.Router();

router.use(middleware);


router.post('/signup',controller.signup_user);
router.post('/login',controller.login_post);
router.get('/logout', controller.authorise, controller.logout);

router.post('/createpolicy',controller.authorise,controller.createpolicy);
router.post('/buy', controller.authorise, controller.buypolicy);
router.get('/policies', controller.authorise, controller.viewpolicies);

router.use('*', controller.page_404);


module.exports = router;