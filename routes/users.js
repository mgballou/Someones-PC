const express = require('express');
const router = express.Router();
const usersCtrl = require("../controllers/users")
const ensureLoggedIn = require('../config/ensureLoggedIn')


router.get("/:id", ensureLoggedIn, usersCtrl.show)

router.put('/:id', ensureLoggedIn, usersCtrl.update)


module.exports = router;

