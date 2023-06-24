import puppeteer from "puppeteer";
import { extractDataSiswa, getRankSMA } from "../scrapeppdb.js";

export const getAllPeringkat = async (req, res) => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    // userDataDir: "./whatsappData",
    // headless: false,
  });

  const page = await browser.newPage();

  const {nama_siswa, nilai_akhir, peringkat_pilihan} = await extractDataSiswa(
    page,
    req.params.id
  );

  console.log(nama_siswa,nilai_akhir,peringkat_pilihan)

  const urls = {
    1: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030318/0/1/simple",
    2: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030322/0/1/simple",
    3: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030323/0/1/simple",
    4: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030328/0/1/simple",
    5: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030325/0/1/simple",
    6: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030326/0/1/simple",
    7: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030315/0/1/simple",
    8: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030329/0/1/simple",
    9: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030324/0/1/simple",
    10: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030317/0/1/simple",
    11: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030320/0/1/simple",
    12: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030321/0/1/simple",
    13: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030319/0/1/simple",
    14: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030330/0/1/simple",
    15: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030327/0/1/simple",
    16: "https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030316/0/1/simple",
  };

  let summary = {};
  summary["Pilihan"] = `${nama_siswa} berada di urutan ${peringkat_pilihan} dengan nilai akhir ${nilai_akhir}`;

  for (let i = 0; i < Object.keys(urls).length; i++) {
    console.log(`fetching data from SMA ${i+1} `);
    const [data,text,dayaTampung, peringkat] = await getRankSMA( urls[i+1], page, parseFloat(nilai_akhir).toFixed(2) );
    summary[`SMA ${i+1}`] = {
        'status' : text,
        'peringkat' : peringkat,
        'sma' : i + 1,
        'daya_tampung': dayaTampung
    };
  }

  await browser.close();
  res.send(summary);
};
