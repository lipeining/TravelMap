var express    = require('express');
var router     = express.Router();
const auth     = require('../auth/auth');
const spotCtrl = require('../controller/api/v1/spot');

const {oneOf, check, checkSchema} = require('express-validator/check');

// get Spots
// router.get('/spots', spotCtrl.getSpots);
router.get('/spots', auth.checkLogin,
  checkSchema({
    pageIndex: {
      in   : ['query'],
      isInt: true
    },
    pageSize : {
      in   : ['query'],
      isInt: true
    }
  }), spotCtrl.getSpots);

// get spot
router.get('/spot', auth.checkLogin,
  checkSchema({
    id: {
      in   : ['query'],
      toInt: true,
      isInt: true
    }
  }), spotCtrl.getSpot);

// create spot
router.post('/spot', auth.checkLogin,
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
    },
    // location
    location : {
      in    : ['body'],
      custom: {
        options: (value, {req, location, path}) => {
          // check the location is right?
          console.log(`lng:${value.lng}-lat:${value.lat}`);
          return true;
        }
      }
    },
  }), spotCtrl.createSpot);

router.put('/spotlocation', auth.checkLogin,
  checkSchema({
    id       : {
      in   : ['body'],
      isInt: true,
      toInt: true,
    },
    // location
    location : {
      in    : ['body'],
      custom: {
        options: (value, {req, location, path}) => {
          // check the location is right?
          console.log(`lng:${value.lng}-lat:${value.lat}`);
          return true;
        }
      }
    },
  }), spotCtrl.updateSpotLocation);

// update spot
router.put('/spot', auth.checkLogin,
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
    },
    // location
    location : {
      in    : ['body'],
      custom: {
        options: (value, {req, location, path}) => {
          // check the location is right?
          console.log(`lng:${value.lng}-lat:${value.lat}`);
          return true;
        }
      }
    },
  }), spotCtrl.updateSpot);

// delete spot
// router.delete('/spot', auth.checkLogin,
//   checkSchema({
//     id: {
//       in   : ['body'],
//       isInt: true,
//       toInt: true
//     }
//   }), spotCtrl.delSpot);

module.exports = router;