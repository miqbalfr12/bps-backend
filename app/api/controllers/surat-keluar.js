const fs = require("fs");
const path = require("path");
const config = require("../../../config");
const {PDFDocument} = require("pdf-lib");

require("dotenv").config();

const {User, SuratKeluar, Disposisi} = require("../../../models");
const {generatePDFfromHTML} = require("../../../helper/html-pdf");

const suratKeluarDir = config.suratKeluarPath;

function convertToRoman(num) {
 const romanNumerals = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
 ];
 return romanNumerals[num - 1];
}

async function mergePDFs(pdfPath1, pdfPath2, outputPath) {
 // Muat dua PDF yang akan digabungkan
 const pdf1Bytes = fs.readFileSync(pdfPath1);
 const pdf2Bytes = fs.readFileSync(pdfPath2);

 // Buat dokumen PDF baru
 const mergedPdf = await PDFDocument.create();

 // Muat masing-masing PDF
 const pdf1 = await PDFDocument.load(pdf1Bytes);
 const pdf2 = await PDFDocument.load(pdf2Bytes);

 // Salin semua halaman dari pdf1 ke mergedPdf
 const pagesPdf1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
 pagesPdf1.forEach((page) => mergedPdf.addPage(page));

 // Salin semua halaman dari pdf2 ke mergedPdf
 const pagesPdf2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
 pagesPdf2.forEach((page) => mergedPdf.addPage(page));

 // Simpan hasil penggabungan ke file baru
 const mergedPdfBytes = await mergedPdf.save();
 fs.writeFileSync(outputPath, mergedPdfBytes);
}

module.exports = {
 uploadSuratKeluar: async (req, res) => {
  if (!fs.existsSync(suratKeluarDir)) {
   fs.mkdirSync(suratKeluarDir, {recursive: true});
  }

  try {
   const user = req.user;
   const file = req.file;
   const payload = req.body;
   const filePath = file?.path;

   const totalSuratKeluar = await SuratKeluar.count();
   payload.no_surat = `${payload.jenis_surat}/${(totalSuratKeluar + 1)
    .toString()
    .padStart(3, "0")}/BPS/${convertToRoman(
    new Date().getMonth() + 1
   )}/${new Date().getFullYear()}`;

   //  return res.status(201).json({user, file, payload, filePath});

   const surat_keluar_id = payload.no_surat.replace(/\//g, "");
   console.log(surat_keluar_id);
   payload.surat_keluar_id = surat_keluar_id;

   if (payload.isi_surat)
    payload.status_surat = "Soft Copy (created in aplication)";
   else payload.status_surat = "Hard Copy (upload/scan surat)";

   payload.user_id = user.user_id;
   payload.created_by = user.user_id;
   payload.updated_by = user.user_id;

   const newFileName = `${surat_keluar_id}-${payload.perihal_surat}`;
   const savePath = path.join(suratKeluarDir, `${newFileName}.pdf`);

   if (payload.isi_surat) {
    const html = `<script src='https://cdn.tailwindcss.com'></script><script src="https://cdn.tailwindcss.com?plugins=typography"></script><style>@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap);</style><div class='flex flex-col  h-[29.7cm] m-0 min-h-[29.7cm] max-w-[20.99cm] p-0 w-[20.99cm]'><div class='flex w-full mt-8 items-start justify-start p-8 px-12 text-black'><a href='https://reidteam.web.id'><img class='w-[130px]'src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg/1160px-Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png'></a><div class='flex w-full flex-col h-full items-center justify-center px-4 text-center'><h1 class='font-bold text-xl'>BADAN PUSAT STATISTIK KOTA TASIKMALAYA</h1><p class='text-xs'>Jl. Sukarindik No.71, Sukarindik, Kec. Bungursari, Kab. Tasikmalaya, Jawa Barat 46151<p class='text-xs'>Website : https://tasikmalayakota.bps.go.id/</div></div><div class='grow m-12 my-0'><table class='w-full border-black border-t-4'><tr><td class='py-2 w-3/12'>Nomor Surat<td class='py-2 px-1'>:<td class='py-2 w-3/12'>${payload.no_surat}<td class='py-2 w-3/12'><td class='py-2 px-1'><td class='py-2 w-3/12'>${payload.tanggal_surat}<tr><td class='py-2 w-3/12'>Lampiran<td class='py-2 px-1'>:<td class='py-2'colspan='3'>${payload.jumlah_lampiran}<tr><td class='py-2 w-3/12'>perihal<td class='py-2 px-1'>:<td class='py-2'colspan='3'>${payload.perihal_surat}</table><div class='mt-8'><p>Kepada Yth.<p>${payload.kepada}</div><div class='my-8 prose w-full mx-auto'>${payload.isi_surat}</div><div class='flex w-full mt-8 items-end justify-end'><div><p class='text-base'>Kepala<p class='text-base pt-20'>(Nama Kepala Instansi)</div></div><p class='text-base mt-4'>Tembusan : ${payload.tembusan}</div></div>`;

    await generatePDFfromHTML(html, savePath).then(() => {
     if (file && path.extname(file.originalname) === ".pdf") {
      mergePDFs(
       savePath,
       filePath,
       path.join(suratKeluarDir, `${newFileName}+lampiran.pdf`)
      );
      payload.file = `${process.env.BASE_URL}/surat-keluar/${newFileName}+lampiran.pdf`;
     } else {
      payload.file = `${process.env.BASE_URL}/surat-keluar/${newFileName}.pdf`;
     }
    });
   } else {
    fs.copyFileSync(filePath, savePath);
    fs.unlinkSync(filePath);
    payload.file = `${process.env.BASE_URL}/surat-keluar/${newFileName}.pdf`;
   }

   const dataSuratKeluar = await SuratKeluar.create(payload);

   return res.status(201).json(dataSuratKeluar);
  } catch (error) {
   console.log(error);
   return res.status(500).json({error: error.message});
  }
 },

 getSuratKeluar: async (req, res) => {
  try {
   const user = req.user;

   let whereClause = {};

   if (user.jabatan === "Kepala Satker") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSatker = await User.findAll({
     attributes: ["user_id"],
     where: {satker: user.satker},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSatker.map((u) => u.user_id);

    // Buat whereClause untuk filter surat keluar berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (user.jabatan === "Kepala Subag") {
    // Ambil semua user yang memiliki subag yang sama dengan Kepala Subag yang sedang login
    const usersInSameSubag = await User.findAll({
     attributes: ["user_id"],
     where: {subag: user.subag},
    });

    // Extract user_id dari hasil query
    const userIds = usersInSameSubag.map((u) => u.user_id);

    // Buat whereClause untuk filter surat keluar berdasarkan user_id yang ada di subag yang sama
    whereClause = {user_id: userIds};
   }

   if (user.jabatan === "Pegawai") {
    whereClause = {user_id: user.user_id};
   }

   const dataSuratKeluar = await SuratKeluar.findAll({
    where: whereClause,
    include: [
     {
      model: User,
      as: "pengimput",
      attributes: ["fullname"],
     },
     {
      model: Disposisi,
      as: "terdisposisi",
      include: [
       {
        model: User,
        as: "penerima",
        attributes: ["fullname"],
       },
      ],
     },
    ],
   });

   const dataSuratKeluarJson = JSON.parse(JSON.stringify(dataSuratKeluar));

   dataSuratKeluarJson.map((s) => {
    s.penerima_tugas = s.terdisposisi
     .map((d) => d.penerima.fullname)
     .join(", ");
   });
   if (user.jabatan !== "Kepala Satker") {
    return res
     .status(200)
     .json(
      dataSuratKeluarJson.sort(
       (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
     );
   }
   if (user.jabatan === "Kepala Satker") {
    await Promise.all(
     dataSuratKeluarJson.map(async (s) => {
      if (s.terdisposisi.length > 0) {
       s.aksi = [...s.aksi, "viewDisposisi"];
       const ids = s.terdisposisi.flatMap((d) => Object.keys(d.catatan));
       const userData = await User.findAll({
        where: {user_id: ids},
       });
       const userMap = userData.reduce((acc, user) => {
        acc[user.user_id] = `${user.jabatan ? `${user.jabatan} - ` : ""}${
         user.satker ? `${user.satker} - ` : ""
        }${user.subag ? `${user.subag} - ` : ""}${user.fullname}`;
        return acc;
       }, {});
       s.terdisposisi.map(
        (d) =>
         (d.catatan = Object.entries(d.catatan).reduce(
          (acc, [userId, value]) => {
           const username = userMap[userId] || userId; // Fallback to userId if username not found
           acc[username] = value;
           return acc;
          },
          {}
         ))
       );
      } else s.aksi = [...s.aksi, "disposisi"];
     })
    );
    return res
     .status(200)
     .json(
      dataSuratKeluarJson.sort(
       (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
     );
   }
  } catch (error) {
   console.log(error);
   return res.status(500).json({error: error.message});
  }
 },
};
