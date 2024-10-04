"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
 class Disposisi extends Model {
  static associate(models) {
   this.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "penerima",
   });
   this.belongsTo(models.SuratMasuk, {
    foreignKey: "surat_masuk_id",
    as: "surat",
   });
   this.belongsTo(models.SuratKeluar, {
    foreignKey: "surat_keluar_id",
    as: "surat_keluar",
   });
  }
 }
 Disposisi.init(
  {
   disposisi_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
   },
   surat_masuk_id: {
    type: DataTypes.STRING,
    references: {
     model: "surat_masuk",
     key: "surat_masuk_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
   },
   surat_keluar_id: {
    type: DataTypes.STRING,
    references: {
     model: "surat_keluar",
     key: "surat_keluar_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
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
   file: {
    allowNull: false,
    type: DataTypes.STRING,
   },
   catatan: {
    allowNull: false,
    type: DataTypes.JSON,
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
   modelName: "Disposisi",
   tableName: "disposisi",
   timestamps: false,
  }
 );
 return Disposisi;
};
