const express = require("express");
const router = express.Router();
const {getAllUsers} = require("../controllers/user");
const {isLoginUser} = require("../../middleware/auth");

router.get("/", isLoginUser, getAllUsers);

module.exports = router;
