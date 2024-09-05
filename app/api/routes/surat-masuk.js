const express = require("express");
const router = express.Router();
const {isLoginUser} = require("../../middleware/auth");
const {uploadSuratMasuk, getSuratMasuk} = require("../controllers/surat-masuk");

const os = require("os");
const multer = require("multer");

router.post(
 "/",
 multer({dest: os.tmpdir()}).single("file"),
 isLoginUser,
 uploadSuratMasuk
);

router.get("/", isLoginUser, getSuratMasuk);

module.exports = router;
