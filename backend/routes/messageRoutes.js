const express=require("express");
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const router=express.Router();
const requireLogin = require("../middleware/requireLogin");


router.route("/").post(requireLogin,sendMessage)
router.route("/:chatId").get(requireLogin,allMessages)


module.exports=router