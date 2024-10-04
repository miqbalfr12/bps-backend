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

  const dataUserJson = JSON.parse(JSON.stringify(dataUser));

  dataUserJson
   .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
   .map((item, index) => {
    item.no = index + 1;
    console.log(item.deleted_at);
    if (item.jabatan === "Super Admin") item.aksi = ["view"];
    else
     item.aksi = [
      "view",
      ...(item.deleted_at ? ["restore"] : ["edit", "delete"]),
     ];
   });

  res.status(200).json(dataUserJson);
 },
 getProfile: (req, res) => {
  const user = req.user;

  res.status(200).json(user);
 },

 deleteUser: async (req, res) => {
  const user = req.user;
  const {user_id} = req.body;

  console.log(user_id);
  try {
   const userData = await User.findOne({where: {user_id}}).then((userData) => {
    userData.updated_at = new Date();
    userData.updated_by = user.user_id;
    userData.deleted_at = new Date();
    userData.deleted_by = user.user_id;
    return userData;
   });
   await userData.save().then(() => {
    console.log("User deleted");
    return res.status(200).json({message: "User deleted"});
   });
  } catch (error) {
   return res.status(500).json({message: error.message});
  }
 },
 restoreUser: async (req, res) => {
  const user = req.user;
  const {user_id} = req.body;

  console.log(user_id);
  try {
   const userData = await User.findOne({where: {user_id}}).then((userData) => {
    userData.updated_at = new Date();
    userData.updated_by = user.user_id;
    userData.deleted_at = null;
    userData.deleted_by = null;
    return userData;
   });
   await userData.save().then(() => {
    console.log("User deleted");
    return res.status(200).json({message: "User restored"});
   });
  } catch (error) {
   return res.status(500).json({message: error.message});
  }
 },
};
