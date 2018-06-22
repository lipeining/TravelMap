var express    = require('express');
var router     = express.Router();
const auth     = require('../auth/auth');
const planCtrl = require('../controller/api/v1/plan');

const {oneOf, check, checkSchema} = require('express-validator/check');

// get Plans
// router.get('/Plans', planCtrl.getPlans);
router.get('/plans', auth.checkLogin,
  checkSchema({
    pageIndex: {
      in   : ['query'],
      toInt: true
    },
    pageSize : {
      in   : ['query'],
      toInt: true
    },
  }), planCtrl.getPlans);

// get Plan
router.get('/plan', auth.checkLogin,
  checkSchema({
    id: {
      in   : ['query'],
      toInt: true,
      isInt: true
    }
  }), planCtrl.getPlan);

// create Plan
router.post('/plan', auth.checkLogin,
  checkSchema({
    name     : {
      in      : ['body'],
      isLength: {
        errorMessage: 'name should be in [5,16]',
        // Multiple options would be expressed as an array
        options     : {min: 5, max: 16}
      }
    },
    intro    : {
      in      : ['body'],
      isLength: {
        errorMessage: 'introduction should be in [20,120]',
        // Multiple options would be expressed as an array
        options     : {min: 20, max: 120}
      }
    },
    cost     : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    status   : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    startTime: {
      in    : ['body'],
      toDate: true,
      custom: {
        options: (value, {req, location, path}) => {
          // check startTime < endTime!
          let start = Date.parse(value) || 0;
          let end   = Date.parse(req.body.endTime) || -1;
          return (end - start) >= 0;
        }
      },
    },
    endTime  : {
      in    : ['body'],
      toDate: true,
    }
  }), planCtrl.createPlan);

//  Plan remove user
router.get('/planusers', auth.checkLogin,
  checkSchema({
    inOut : {
      in   : ['query'],
      isInt: true,
      toInt: true
    },
    planId: {
      in   : ['query'],
      isInt: true,
      toInt: true,
    }
  }), planCtrl.getPlanUsers);

//  Plan add user
router.post('/planuser', auth.checkLogin,
  checkSchema({
    id     : {
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
  }), planCtrl.addUser);

//  Plan edit user
router.put('/planuser', auth.checkLogin,
  checkSchema({
    id    : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    userId: {
      in   : ['body'],
      isInt: true,
      toInt: true,
    },
    status: {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    type  : {
      in   : ['body'],
      isInt: true,
      toInt: true
    }
  }), planCtrl.setUser);

//  Plan remove user
router.delete('/planuser', auth.checkLogin,
  checkSchema({
    id    : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    userId: {
      in   : ['body'],
      isInt: true,
      toInt: true,
    }
  }), planCtrl.removeUser);

// update Plan
router.put('/plan', auth.checkLogin,
  checkSchema({
    id       : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    name     : {
      in      : ['body'],
      isLength: {
        errorMessage: 'name should be in [5,16]',
        // Multiple options would be expressed as an array
        options     : {min: 5, max: 16}
      }
    },
    intro    : {
      in      : ['body'],
      isLength: {
        errorMessage: 'introduction should be in [20,120]',
        // Multiple options would be expressed as an array
        options     : {min: 20, max: 120}
      }
    },
    cost     : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    status   : {
      in   : ['body'],
      isInt: true,
      toInt: true
    },
    startTime: {
      in    : ['body'],
      toDate: true,
      custom: {
        options: (value, {req, location, path}) => {
          // check startTime < endTime!
          let start = Date.parse(value) || 0;
          let end   = Date.parse(req.body.endTime) || -1;
          return (end - start) >= 0;
        }
      },
    },
    endTime  : {
      in    : ['body'],
      toDate: true,
    }
  }), planCtrl.updatePlan);

// update Plans
// router.put('/plans', auth.checkLogin, planCtrl.updatePlans);

// delete Plan
// router.delete('/plan', auth.checkLogin,
//   checkSchema({
//     id: {
//       in   : ['body'],
//       isInt: true,
//       toInt: true
//     }
//   }), planCtrl.delPlan);

module.exports = router;