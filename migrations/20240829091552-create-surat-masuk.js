"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable("surat_masuk", {
   surat_masuk_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
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
   no_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   tanggal_surat: {
    allowNull: false,
    type: Sequelize.DATE,
   },
   tanggal_diterima: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("now"),
   },
   instansi_pengirim: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   no_agenda: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   klasifikasi: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   perihal_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   jumlah_lampiran: {
    allowNull: false,
    type: Sequelize.INTEGER,
   },
   status_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   sifat_tindakan: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   file: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   aksi: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: ["view"],
   },
   status_persuratan: {
    type: Sequelize.STRING,
    defaultValue: "Menunggu Verifikasi",
   },
   verifikasi_at: {
    type: Sequelize.DATE,
   },
   verifikasi_by: {
    type: Sequelize.STRING,
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
  await queryInterface.dropTable("surat_masuk");
 },
};
