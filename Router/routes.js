const express = require('express');
const controller = require('../Controllers/controller.js')
const middleware = require('../Middlewares/middleware.js');
const router = express.Router();

router.use(middleware);


router.post('/signup',controller.signup_user,(req,res)=>{
	res.send(req.body);
})
router.post('/login',controller.login_post);
router.get('/restricted',controller.authorise);
router.get('/logout', controller.logout);

module.exports = router;