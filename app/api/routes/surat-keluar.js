const express = require("express");
const router = express.Router();
const {isLoginUser} = require("../../middleware/auth");
const {
 uploadSuratKeluar,
 getSuratKeluar,
} = require("../controllers/surat-keluar");

const os = require("os");
const multer = require("multer");

router.post(
 "/",
 multer({dest: os.tmpdir()}).single("file"),
 isLoginUser,
 uploadSuratKeluar
);

router.get("/", isLoginUser, getSuratKeluar);

module.exports = router;
