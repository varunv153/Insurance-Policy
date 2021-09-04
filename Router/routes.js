const express = require('express');
const router = express.Router();
const controller = require('../Controllers/controller.js')
const middleware = require('../Middlewares/middleware.js');

router.use(middleware);
router.post('/signup_company',controller.signup_company);
router.post('/login_company',controller.login_company);

router.post('/createpolicy',controller.authorise_company,controller.createpolicy);
router.get('/view_policies_of_my_company',controller.authorise_company,controller.view_policies_of_my_company);
router.get('/view_claims_of_my_company',controller.authorise_company,controller.view_claims_of_my_company);
router.get('/view_bonds_of_my_company',controller.authorise_company,controller.view_bonds_of_my_company);

router.get('/logout_company', controller.authorise_company, controller.logout);

router.post('/signup_user',controller.signup_user);
router.post('/login_user',controller.login_user);

router.get('/policies', controller.viewpolicies);
router.post('/buy', controller.authorise_user, controller.buypolicy);
router.get('/viewmypolicies',controller.authorise_user,controller.view_my_policies);

router.post('/claimpolicy',controller.authorise_user,controller.claim_my_policy);
router.get('/viewmyclaims',controller.authorise_user,controller.viewmyclaims);

router.get('/logout_user', controller.authorise_user, controller.logout);

router.use('*', controller.page_404);


module.exports = router;