const router = require("express").Router();

const userController = require("../controller/userController");
// router.post('/getAUser', userController.getUserId);
router.post('/login', userController.login);
router.post('/getAllUsers', userController.getAllUsers);
router.post('/register', userController.register);
module.exports = router;