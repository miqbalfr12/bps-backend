"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
 class User extends Model {
  static associate(models) {}
 }
 User.init(
  {
   user_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
   },
   nik: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   fullname: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   email: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   profile_photo: {
    type: DataTypes.STRING,
   },
   birth_date: {
    type: DataTypes.DATE,
   },
   phone_number: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   password: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   jabatan: {
    type: DataTypes.ENUM(
     "Super Admin",
     "Kepala Satker",
     "Kepala Subag",
     "Admin Subag",
     "Pegawai"
    ),
    defaultValue: "Pegawai",
   },
   satker: {
    type: DataTypes.STRING,
   },
   subag: {
    type: DataTypes.STRING,
   },
   status: {
    type: DataTypes.ENUM("not-verified", "verified", "deleted"),
    defaultValue: "not-verified",
   },
   last_signin: {
    type: DataTypes.DATE,
   },
   last_activity: {
    type: DataTypes.DATE,
   },
   last_reset: {
    type: DataTypes.DATE,
   },
   created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.fn("now"),
   },
   created_by: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.fn("now"),
   },
   updated_by: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   deleted_at: {
    type: DataTypes.DATE,
   },
   deleted_by: {
    type: DataTypes.STRING,
   },
  },
  {
   sequelize,
   modelName: "User",
   tableName: "users",
   timestamps: false,
  }
 );
 return User;
};
