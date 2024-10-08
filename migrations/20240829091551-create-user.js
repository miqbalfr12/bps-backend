"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
   user_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
   },
   nik: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   fullname: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   email: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   profile_photo: {
    type: Sequelize.STRING,
   },
   birth_date: {
    type: Sequelize.DATE,
   },
   phone_number: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   password: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   jabatan: {
    type: Sequelize.ENUM(
     "Super Admin",
     "Kepala Satker",
     "Kepala Subag",
     "Admin Subag",
     "Pegawai"
    ),
    defaultValue: "Pegawai",
   },
   satker: {
    type: Sequelize.STRING,
   },
   subag: {
    type: Sequelize.STRING,
   },
   status: {
    type: Sequelize.ENUM("not-verified", "verified", "deleted"),
    defaultValue: "not-verified",
   },
   last_signin: {
    type: Sequelize.DATE,
   },
   last_activity: {
    type: Sequelize.DATE,
   },
   last_reset: {
    type: Sequelize.DATE,
   },
   created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("now"),
   },
   created_by: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("now"),
   },
   updated_by: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   deleted_at: {
    type: Sequelize.DATE,
   },
   deleted_by: {
    type: Sequelize.STRING,
   },
  });
 },
 async down(queryInterface, Sequelize) {
  await queryInterface.dropTable("users");
 },
};
