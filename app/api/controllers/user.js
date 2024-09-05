const {Op} = require("sequelize");
const {User} = require("../../../models");

module.exports = {
 getAllUsers: async (req, res) => {
  const userData = req.user;

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
    satker: userData.satker, // Same satker
    subag: userData.subag, // Same subag
   };
  }

  const dataUser = await User.findAll({
   where: userWhereClause,
  });

  res.status(200).json(dataUser);
 },
 getProfile: (req, res) => {
  const user = req.user;

  res.status(200).json(user);
 },
};
