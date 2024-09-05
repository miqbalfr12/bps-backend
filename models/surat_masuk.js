"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
 class SuratMasuk extends Model {
  static associate(models) {
   this.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "pengimput",
   });
   this.hasMany(models.Disposisi, {
    foreignKey: "surat_masuk_id",
    as: "terdisposisi",
   });
  }
 }
 SuratMasuk.init(
  {
   surat_masuk_id: {
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
   tanggal_diterima: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.fn("now"),
   },
   instansi_pengirim: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   no_agenda: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   klasifikasi: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   perihal_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   jumlah_lampiran: {
    allowNull: false,
    type: DataTypes.INTEGER,
   },
   status_surat: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   sifat_tindakan: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   file: {
    allowNull: false,
    type: DataTypes.STRING,
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
   verifikasi_by: {
    type: DataTypes.STRING,
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
   modelName: "SuratMasuk",
   tableName: "surat_masuk",
   timestamps: false,
  }
 );
 return SuratMasuk;
};
