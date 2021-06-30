const express = require('express');
const controller = require('../Controllers/controller.js')
const middleware = require('../Middlewares/middleware.js');
const router = express.Router();

router.use(middleware);


router.post('/signup_user',controller.signup_user);
router.post('/login_user',controller.login_user);
router.get('/logout_user', controller.authorise_user, controller.logout);

router.post('/signup_company',controller.signup_company);
router.post('/login_company',controller.login_company);
router.get('/logout_company', controller.authorise_company, controller.logout);

router.post('/createpolicy',controller.authorise_company,controller.createpolicy);
router.post('/buy', controller.authorise_user, controller.buypolicy);

router.get('/viewmypolicies',controller.authorise_user,controller.view_my_policies);
router.get('/policies', controller.viewpolicies);

router.use('*', controller.page_404);


module.exports = router;