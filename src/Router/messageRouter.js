const router = require("express").Router();

const messageController = require("../controller/messageController");
// router.post('/getdata', messageController.userMessage);
router.post('/showdata', messageController.showMessage);
module.exports = router;