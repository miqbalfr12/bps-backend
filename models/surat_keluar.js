"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
 class SuratKeluar extends Model {
  static associate(models) {
   this.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "pengimput",
   });
   this.hasMany(models.Disposisi, {
    foreignKey: "surat_keluar_id",
    as: "terdisposisi",
   });
  }
 }

 SuratKeluar.init(
  {
   surat_keluar_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
   },
   user_id: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {
     model: "users",
     key: "user_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
   },
   no_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   tanggal_surat: {
    allowNull: false,
    type: DataTypes.DATE,
   },
   tanggal_dikeluarkan: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.fn("now"),
   },
   no_urut: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   jenis_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   klasifikasi: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   jumlah_lampiran: {
    allowNull: false,
    type: DataTypes.INTEGER,
   },
   sifat_tindakan: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   status_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   perihal_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   kepada: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   tembusan: {
    type: DataTypes.STRING,
   },
   file: {
    type: DataTypes.STRING,
   },
   isi_surat: {
    type: DataTypes.TEXT, // Teks HTML surat
   },
   aksi: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ["view"],
   },
   status_persuratan: {
    type: DataTypes.STRING,
    defaultValue: "Menunggu Verifikasi",
   },
   verifikasi_at: {
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
   modelName: "SuratKeluar",
   tableName: "surat_keluar",
   timestamps: false,
  }
 );

 return SuratKeluar;
};
