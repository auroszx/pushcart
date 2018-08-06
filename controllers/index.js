const express = require('express');
let router = express.Router();

router.use('/db',require('./route'));
module.exports = router;