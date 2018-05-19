var express    = require('express');
var router     = express.Router();
const auth     = require('../auth/auth');
const userCtrl = require('../controller/api/v1/user');
const cateCtrl = require('../controller/api/v1/category');
const proCtrl  = require('../controller/api/v1/project');

/* GET users listing. */
router.get('/users', auth.checkLogin, auth.checkAdmin, userCtrl.getUsers);

/* GET users listing. */
router.get('/makeUsers', userCtrl.makeUsers);

/* GET user  */
router.get('/user', auth.checkLogin, auth.checkAdmin, userCtrl.getUser);

// login
router.post('/login', auth.checkNotLogin, userCtrl.login);

// register
router.post('/reg', auth.checkNotLogin, userCtrl.reg);

// update
router.put('/user', auth.checkLogin, userCtrl.update);

// grant user
router.post('/grant', auth.checkLogin, auth.checkAdmin, userCtrl.grantUser);

// delete
router.delete('/user', auth.checkLogin, auth.checkAdmin, userCtrl.delUser);

// logout
router.get('/logout', auth.checkLogin, userCtrl.logout);

module.exports = router;
