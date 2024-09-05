const fs = require("fs");
const path = require("path");
const config = require("../../../config");
require("dotenv").config();

const {User, SuratMasuk, Disposisi} = require("../../../models");
const {generatePDFfromHTML} = require("../../../helper/html-pdf");

const disposisiDir = config.disposisiPath;

module.exports = {
 createDisposisi: async (req, res) => {
  if (!fs.existsSync(disposisiDir)) {
   fs.mkdirSync(disposisiDir, {recursive: true});
  }

  try {
   const user = req.user;
   const payload = req.body;
   payload.created_by = user.user_id;
   payload.updated_by = user.user_id;

   const getDataSurat = await SuratMasuk.findOne({
    where: {surat_masuk_id: payload.surat_masuk_id},
   });

   const dataSuratJson = JSON.parse(JSON.stringify(getDataSurat));

   console.log(dataSuratJson);

   const dataUser = await User.findAll({where: {user_id: payload.disposisi}});
   const disposisiKepada = dataUser.map((data) => {
    return {fullname: data.fullname, user_id: data.user_id};
   });
   delete payload.disposisi;

   const createDisposisi = await Promise.all(
    disposisiKepada.map(async ({fullname, user_id}, index) => {
     const disposisi_id = Date.now() + index;

     const html = `<head><script src='https://cdn.tailwindcss.com'></script><style> @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'); @layer base { body { font-family: 'Montserrat', sans-serif; } } </style></head><body><div class='w-[20.99cm] h-[29.7cm] max-w-[20.99cm] max-h-[29.7cm] p-0 m-0 flex flex-col'><div class='w-full text-black my-8 p-8 px-12 flex justify-start items-start'><a href='https://reidteam.web.id'><img class='w-[130px]' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg/1160px-Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png' /></a><div class='w-full h-full flex px-4 flex-col text-center justify-center items-center'><h1 class='text-xl font-bold'>BADAN PUSAT STATISTIK KOTA TASIKMALAYA</h1><p class='text-xs mb-1'> Jl. Sukarindik No.71, Sukarindik, Kec. Bungursari, Kab. Tasikmalaya, Jawa Barat 46151 </p><p class='text-xs'>Website : https://tasikmalayakota.bps.go.id/</p></div></div><div class='m-12 my-0 grow'><h1 class='text-xl font-bold text-center py-2'>LEMBAR DISPOSISI</h1><h2 class='text-center my-4 mb-6'> PERHATIKAN: Dilarang memisah sehelai surat yang digabung dalam berkas ini </h2><table class='w-full'><tbody><tr><td class='py-2 w-3/12'>Nomor Surat</td><td class='py-2 px-1'>:</td><td class='py-2 w-4/12'>${
      dataSuratJson.no_surat
     }</td><td class='py-2 w-2/12'>Status</td><td class='py-2 px-1'>:</td><td class='py-2 w-3/12'>${
      dataSuratJson.status_surat
     }</td></tr><tr><td class='py-2 w-3/12'>Tanggal Surat</td><td class='py-2 px-1'>:</td><td class='py-2 w-4/12'>${
      dataSuratJson.tanggal_surat.split("T")[0]
     }</td><td class='py-2 w-2/12'>Sifat</td><td class='py-2 px-1'>:</td><td class='py-2 w-3/12'>${
      dataSuratJson.sifat_tindakan
     }</td></tr><tr><td class='py-2 w-3/12'>No. Agenda</td><td class='py-2 px-1'>:</td><td class='py-2' colspan='3'>${
      dataSuratJson.no_agenda
     }</td></tr><tr><td class='py-2 w-3/12'>Lampiran</td><td class='py-2 px-1'>:</td><td class='py-2' colspan='3'>${
      dataSuratJson.jumlah_lampiran
     }</td></tr><tr><td class='py-2 w-3/12'>Diterima Tanggal</td><td class='py-2 px-1'>:</td><td class='py-2' colspan='3'>${
      dataSuratJson.tanggal_diterima.split("T")[0]
     }</td></tr><tr><td class='py-2 w-3/12'>Dari Instansi</td><td class='py-2 px-1'>:</td><td class='py-2' colspan='3'>${
      dataSuratJson.instansi_pengirim
     }</td></tr></tbody></table><h1 class='text-xl font-bold text-center py-6'>PERIHAL</h1><p class='text-center pb-4'><i>${
      dataSuratJson.perihal_surat
     }</i></p><table class='w-full'><tbody><tr><td class='py-2 w-4/12'>Diteruskan Kepada</td><td class='py-2 px-1'>:</td><td class='py-2'>${
      user.jabatan
     }${user?.satker ? ` - ${user.satker}` : ""}${
      user?.subag ? ` - ${user.subag}` : ""
     }</td></tr><tr><td class='py-2 w-4/12'>Pada Tanggal</td><td class='py-2 px-1'>:</td><td class='py-2'>${new Date().toLocaleDateString(
      "en-CA"
     )}</td></tr><tr><td class='py-2 w-4/12'>Disposisi Kepada</td><td class='py-2 px-1'>:</td><td class='py-2'>${fullname}</td></tr><tr><td class='py-2 w-4/12'>Catatan ${
      user.jabatan
     }</td><td class='py-2 px-1'>:</td><td class='py-2'>${
      payload.catatan
     }</td></tr></tbody></tbody></table></div></div></body>`;

     await generatePDFfromHTML(
      html,
      `${disposisiDir}/Disposisi-${fullname}-${disposisi_id}.pdf`
     ).then(() => {
      payload.file = `${process.env.BASE_URL}/disposisi/Disposisi-${fullname}-${disposisi_id}.pdf`;
     });

     console.log(payload);
     const newDisposisi = await Disposisi.create({
      ...payload,
      user_id,
      disposisi_id,
     });
     console.log({newDisposisi});
     return newDisposisi;
    })
   );

   getDataSurat.status_persuratan = `Terdisposisi ${user.jabatan}`;
   getDataSurat.updated_by = user.user_id;
   getDataSurat.updated_at = new Date();
   await getDataSurat.save();

   console.log(createDisposisi);

   return res.status(200).json({
    user,
    payload,
    message: "Naonweh",
    createDisposisi,
    // path: `${process.env.BASE_URL}/disposisi/${disposisi_id}.pdf`,
   });
  } catch (error) {
   console.log(error);
   return res.status(500).json({message: error.message});
  }
 },

 getDisposisi: async (req, res, next) => {
  try {
   const user = req.user;
   const getDisposisi = await Disposisi.findAll({
    where: {
     user_id: user.user_id,
    },
    include: [
     {
      model: SuratMasuk,
      as: "surat",
     },
    ],
   });
   const dataDisposisiJson = JSON.parse(JSON.stringify(getDisposisi));
   dataDisposisiJson.map((data) => {
    data.status_persuratan = data.surat.status_persuratan;
    data.instansi_pengirim = data.surat.instansi_pengirim;
    data.perihal_surat = data.surat.perihal_surat;
    data.tanggal_disposisi = data.surat.created_at.split("T")[0];
    data.aksi = ["viewPegawai", "viewDisposisiPegawai"];
   });
   console.log(dataDisposisiJson);
   res.status(200).json(dataDisposisiJson);
  } catch (error) {
   console.log(error);
   return res.status(500).json({message: error.message});
  }
 },
};
