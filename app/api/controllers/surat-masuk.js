const fs = require("fs");
const path = require("path");
const config = require("../../../config");
require("dotenv").config();

const {User, SuratMasuk, Disposisi} = require("../../../models");

const suratMasukDir = config.suratMasukPath;

module.exports = {
 uploadSuratMasuk: async (req, res) => {
  if (!fs.existsSync(suratMasukDir)) {
   fs.mkdirSync(suratMasukDir, {recursive: true});
  }

  try {
   const user = req.user;
   const file = req.file;
   const payload = req.body;
   const filePath = file?.path;

   let getSuratMasuk;
   let surat_masuk_id;
   do {
    charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    surat_masuk_id = user.fullname.charAt(0);
    for (var i = 0, n = charset.length; i < 8; ++i) {
     surat_masuk_id += charset.charAt(Math.floor(Math.random() * n));
    }
    payload.surat_masuk_id = surat_masuk_id;

    getSuratMasuk = await SuratMasuk.findOne({where: {surat_masuk_id}});
   } while (getSuratMasuk !== null);

   payload.user_id = user.user_id;
   payload.created_by = user.user_id;
   payload.updated_by = user.user_id;

   const newFileName = `${surat_masuk_id}-${payload.instansi_pengirim}-${
    payload.perihal_surat
   }${path.extname(file.originalname)}`;
   const savePath = path.join(suratMasukDir, newFileName);

   fs.copyFileSync(filePath, savePath);
   fs.unlinkSync(filePath);
   payload.file = `${process.env.BASE_URL}/surat-masuk/${newFileName}`;

   const dataSuratMasuk = await SuratMasuk.create(payload);

   return res.status(201).json(dataSuratMasuk);
  } catch (error) {
   console.log(error);
   return res.status(500).json({error: error.message});
  }
 },

 getSuratMasuk: async (req, res) => {
  try {
   const user = req.user;

   let whereClause = {};

   if (user.jabatan === "Kepala Satker") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSatker = await User.findAll({
     attributes: ["user_id"],
     where: {satker: user.satker},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSatker.map((u) => u.user_id);

    // Buat whereClause untuk filter surat masuk berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (user.jabatan === "Kepala Subag") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSubag = await User.findAll({
     attributes: ["user_id"],
     where: {subag: user.subag},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSubag.map((u) => u.user_id);

    // Buat whereClause untuk filter surat masuk berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (user.jabatan === "Pegawai") {
    whereClause = {user_id: user.user_id};
   }

   const dataSuratMasuk = await SuratMasuk.findAll({
    where: whereClause,
    include: [
     {
      model: User,
      as: "pengimput",
      attributes: ["fullname"],
     },
     {
      model: Disposisi,
      as: "terdisposisi",
      include: [
       {
        model: User,
        as: "penerima",
        attributes: ["fullname"],
       },
      ],
     },
    ],
   });

   const dataSuratMasukJson = JSON.parse(JSON.stringify(dataSuratMasuk));

   dataSuratMasukJson.map((s) => {
    s.penerima_tugas = s.terdisposisi
     .map((d) => d.penerima.fullname)
     .join(", ");
   });
   if (user.jabatan !== "Kepala Satker") {
    return res
     .status(200)
     .json(
      dataSuratMasukJson.sort(
       (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
     );
   }
   if (user.jabatan === "Kepala Satker") {
    await Promise.all(
     dataSuratMasukJson.map(async (s) => {
      if (s.terdisposisi.length > 0) {
       s.aksi = [...s.aksi, "viewDisposisi"];
       const ids = s.terdisposisi.flatMap((d) => Object.keys(d.catatan));
       const userData = await User.findAll({
        where: {user_id: ids},
       });
       const userMap = userData.reduce((acc, user) => {
        acc[user.user_id] = `${user.jabatan ? `${user.jabatan} - ` : ""}${
         user.satker ? `${user.satker} - ` : ""
        }${user.subag ? `${user.subag} - ` : ""}${user.fullname}`;
        return acc;
       }, {});
       s.terdisposisi.map(
        (d) =>
         (d.catatan = Object.entries(d.catatan).reduce(
          (acc, [userId, value]) => {
           const username = userMap[userId] || userId; // Fallback to userId if username not found
           acc[username] = value;
           return acc;
          },
          {}
         ))
       );
      } else s.aksi = [...s.aksi, "disposisi"];
     })
    );
    return res
     .status(200)
     .json(
      dataSuratMasukJson.sort(
       (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
     );
   }
  } catch (error) {
   console.log(error);
   return res.status(500).json({error: error.message});
  }
 },
};
