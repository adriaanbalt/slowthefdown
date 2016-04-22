// var router = require('express').Router();

// module.exports = (router) => {
const express = require('express');
const router = express.Router();

// routes
const userRoutes = require('./user')(router);
const highscoreRoutes = require('./highscore')(router);
// const roomRoutes = require('./room')(router);
// const taskRoutes = require('	./task')(router);
// const skillRoutes = require('./skill')(router);
// const productRoutes = require('./product')(router);
// const materialRoutes = require('./material')(router);
// const calendarRoutes = require('./calendar')(router);
// const attachmentRoutes = require('./attachment')(router);

module.exports = router;

