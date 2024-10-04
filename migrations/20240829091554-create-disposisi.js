"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable("disposisi", {
   disposisi_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
   },
   surat_masuk_id: {
    type: Sequelize.STRING,
    references: {
     model: "surat_masuk",
     key: "surat_masuk_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
   },
   surat_keluar_id: {
    type: Sequelize.STRING,
    references: {
     model: "surat_keluar",
     key: "surat_keluar_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
   },
   user_id: {
    allowNull: false,
    type: Sequelize.STRING,
    references: {
     model: "users",
     key: "user_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
   },
   file: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   catatan: {
    allowNull: false,
    type: Sequelize.JSON,
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
  await queryInterface.dropTable("disposisi");
 },
};
