var express     = require('express');
var router      = express.Router();
const auth      = require('../auth/auth');
const groupCtrl = require('../controller/api/v1/group');

const {oneOf, check, checkSchema} = require('express-validator/check');

// get Groups
// router.get('/Groups', groupCtrl.getPlans);
router.get('/groups', auth.checkLogin,
  checkSchema({
    pageIndex: {
      in   : ['query'],
      isInt: true
    },
    pageSize : {
      in   : ['query'],
      isInt: true
    }
  }), groupCtrl.getGroups);

// get Group
router.get('/group', auth.checkLogin,
  checkSchema({
    id: {
      in   : ['query'],
      toInt: true,
      isInt: true
    }
  }), groupCtrl.getGroup);

// create Group
router.post('/group', auth.checkLogin,
  checkSchema({
    name : {
      in      : ['body'],
      isLength: {
        errorMessage: 'name should be in [5,16]',
        // Multiple options would be expressed as an array
        options     : {min: 5, max: 16}
      }
    },
    intro: {
      in      : ['body'],
      isLength: {
        errorMessage: 'introduction should be in [20,120]',
        // Multiple options would be expressed as an array
        options     : {min: 20, max: 120}
      }
    }
  }), groupCtrl.createGroup);

//  Group remove user
router.get('/groupusers', auth.checkLogin,
  checkSchema({
    inOut  : {
      in   : ['query'],
      isInt: true,
      toInt: true
    },
    groupId: {
      in   : ['query'],
      isInt: true,
      toInt: true,
    }
  }), groupCtrl.getGroupUsers);

//  Group add user
router.post('/groupuser', auth.checkLogin,
  checkSchema({
    groupId: {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    userIds: {
      in     : ['body'],
      isArray: true
    },
    status : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    type   : {
      in   : ['body'],
      isInt: true,
      toInt: true
    }
  }), groupCtrl.addUser);

//  Group edit user
router.put('/groupuser', auth.checkLogin,
  checkSchema({
    groupId: {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    userId : {
      in   : ['body'],
      isInt: true,
      toInt: true,
    },
    status : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    type   : {
      in   : ['body'],
      isInt: true,
      toInt: true
    }
  }), groupCtrl.setUser);

//  Group remove user
router.delete('/groupuser', auth.checkLogin,
  checkSchema({
    groupId: {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    userId : {
      in   : ['body'],
      isInt: true,
      toInt: true,
    }
  }), groupCtrl.removeUser);

// update Group
router.put('/group', auth.checkLogin,
  checkSchema({
    id   : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    name : {
      in      : ['body'],
      isLength: {
        errorMessage: 'name should be in [5,16]',
        // Multiple options would be expressed as an array
        options     : {min: 5, max: 16}
      }
    },
    intro: {
      in      : ['body'],
      isLength: {
        errorMessage: 'introduction should be in [20,120]',
        // Multiple options would be expressed as an array
        options     : {min: 20, max: 120}
      }
    }
  }), groupCtrl.updateGroup);

// update Groups
// router.put('/groups', auth.checkLogin, groupCtrl.updateGroups);

// delete Group
// router.delete('/group', auth.checkLogin,
//   checkSchema({
//     id: {
//       in   : ['body'],
//       isInt: true,
//       toInt: true
//     }
//   }), groupCtrl.delgroup);

module.exports = router;