const express=require('express');
const { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const router=express.Router()
const requireLogin = require("../middleware/requireLogin");

router.route("/").post(requireLogin,accessChat);

router.route("/").get(requireLogin,fetchChat);


router.route("/group").post(requireLogin ,createGroupChat);
router.route("/rename").put(requireLogin ,renameGroup);
router.route("/groupremove").put(requireLogin ,removeFromGroup);
router.route("/groupadd").put(requireLogin ,addToGroup);





// router.route("/").post(accessChat);

// router.route("/").get(fetchChat);


// router.route("/group").post(createGroupChat);
// router.route("/rename").put(renameGroup);
// router.route("/groupremove").put(removeFromGroup);
// router.route("/groupadd").put(addToGroup);




module.exports=router