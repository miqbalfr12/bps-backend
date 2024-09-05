require("dotenv").config();

const {Op} = require("sequelize");
const {User, SuratMasuk, Disposisi} = require("../../../models");

module.exports = {
 getDashboard: async (req, res) => {
  try {
   const userData = req.user;
   const {data} = req.query;

   const dataDiperlukan = data ? data.split(",") : [];

   let whereClause = {};
   if (userData.jabatan === "Kepala Satker") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSatker = await User.findAll({
     attributes: ["user_id"],
     where: {satker: userData.satker},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSatker.map((u) => u.user_id);

    // Buat whereClause untuk filter surat masuk berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (userData.jabatan === "Kepala Subag") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSubag = await User.findAll({
     attributes: ["user_id"],
     where: {subag: userData.subag},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSubag.map((u) => u.user_id);

    // Buat whereClause untuk filter surat masuk berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (userData.jabatan === "Pegawai") {
    whereClause = {user_id: userData.user_id};
   }

   let responseData = {};

   if (
    dataDiperlukan.includes("user") &&
    ["Super Admin", "Kepala Satker", "Kepala Subag"].includes(userData.jabatan)
   ) {
    let userWhereClause = {};
    // Super Admin: No restriction, can see all users
    if (userData.jabatan === "Super Admin") {
     userWhereClause = {}; // No restrictions
    }

    // Kepala Satker: Can see all users except Super Admin
    if (userData.jabatan === "Kepala Satker") {
     userWhereClause = {
      jabatan: {[Op.not]: "Super Admin"}, // Exclude Super Admin
      satker: userData.satker, // Same satker
     };
    }

    // Kepala Subag: Can see only users with jabatan "Pegawai" within the same subag
    if (userData.jabatan === "Kepala Subag") {
     userWhereClause = {
      jabatan: "Pegawai", // Only Pegawai
      subag: userData.subag, // Same subag
      satker: userData.satker, // Same satker
     };
    }

    const dataUser = await User.count({
     where: userWhereClause,
    });
    responseData.user = dataUser;
   }

   if (dataDiperlukan.includes("surat_masuk")) {
    const surat_masuk = await SuratMasuk.count({
     where: whereClause,
    });
    responseData.surat_masuk = surat_masuk;
   }

   if (dataDiperlukan.includes("surat_keluar")) {
    // const surat_masuk = await SuratMasuk.count({
    //  where: whereClause,
    // });
    // responseData.surat_masuk = surat_masuk;
    responseData.surat_keluar = 0;
   }

   if (dataDiperlukan.includes("disposisi_surat_masuk")) {
    const surat_masuk = await Disposisi.count({
     where: whereClause,
    });
    responseData.surat_masuk = surat_masuk;
   }

   if (dataDiperlukan.includes("disposisi_surat_keluar")) {
    // const surat_masuk = await SuratMasuk.count({
    //  where: whereClause,
    // });
    // responseData.surat_masuk = surat_masuk;
    responseData.surat_keluar = 0;
   }

   return res.status(200).json(responseData);
  } catch (error) {
   console.log(error);
   return res.status(500).json({message: error.message});
  }
 },
};
