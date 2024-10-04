"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable("surat_keluar", {
   surat_keluar_id: {
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
   tanggal_dikeluarkan: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("now"),
   },
   no_urut: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   jenis_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   klasifikasi: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   jumlah_lampiran: {
    allowNull: false,
    type: Sequelize.INTEGER,
   },
   sifat_tindakan: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   status_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   perihal_surat: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   kepada: {
    allowNull: false,
    type: Sequelize.STRING,
   },
   tembusan: {
    type: Sequelize.STRING,
   },
   file: {
    type: Sequelize.STRING,
   },
   isi_surat: {
    type: Sequelize.TEXT,
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
  await queryInterface.dropTable("surat_keluar");
 },
};
