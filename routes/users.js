var express = require('express');
var router = express.Router();
const User=require('../model/User');
/* GET users listing. */
router.post('/upload', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
