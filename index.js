import puppeteer from "puppeteer";
import express from 'express';
import bodyParser from 'body-parser';
import siswaRouters from './routers/siswa.js'
import cors from 'cors'

const app = express()
const __PORT__= 5000


app.use(bodyParser.json())
app.use(cors())
app.use('/peringkat', siswaRouters)
app.get('/', (req,res) => res.send('WELCOME !'))





app.listen(__PORT__, () => console.log(`Server is running on ${__PORT__}`))

// const browser = await puppeteer.launch({
//   defaultViewport: null,
//   userDataDir: "./whatsappData",
//   // headless: false,
// });

// Open a new page

// const getRankSMANDA = async (page) => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will in full width and height)

//   // On this new page:
//   // - open the "http://quotes.toscrape.com/" website
//   // - wait until the dom content is loaded (HTML is ready)
//   let halaman = 1;
//   await page.goto(
//     `https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030322/0/${halaman}/simple`,
//     {
//       waitUntil: "domcontentloaded",
//     }
//   );
//   await page.waitForSelector(".modal-open");
//   await page.waitForTimeout(2500);

//   //   const [buttonModal] = await page.$x("//div[@class='modal-header']/button[@aria-label='Close']")
//   //   await buttonModal.evaluate(b => b.click())

//   //   await page.waitForTimeout(2500);

//   await page.waitForSelector(".find-page");
//   const showAll = await page.$$("ul.pagination");
//   await showAll[1].click();

//   await page.waitForSelector(".pilih-page");
//   const [all] = await page.$x(
//     "//ul[@class='daftar-page']/li/a[contains(., '1000')]"
//   );
//   await all.evaluate((a) => a.click());

//   let [murid, p, dayaTampung] = await page.evaluate(() => {
//     let data = {};
//     const table = document.querySelector("table");

//     const peringkat = Array.from(
//       table.querySelectorAll('[data-label="No Urut"]')
//     );
//     const nilai = Array.from(
//       table.querySelectorAll('[data-label="Nilai Akhir"]')
//     );
//     const nama = Array.from(table.querySelectorAll('[data-label="Nama"]'));

//     for (let i = 0; i < peringkat.length; i++) {
//       data[nama[i].innerText] = {
//         Peringkat: peringkat[i].innerText,
//         "Nilai Akhir": nilai[i].innerText,
//       };
//     }

//     let totalTerdaftar = Object.keys(data).length;

//     return [
//       data,
//       `Saskia Callerista ada di peringkat ${data["SASKIA CALLERISTA"]["Peringkat"]}`,
//       totalTerdaftar,
//     ];
//     // return nilai.map(td => td.innerText)
//     // return nilai.map((val, i) => ({
//     //   Peringkat: peringkat[i].innerText,
//     //   Nama: nama[i].innerText,
//     //   "Nilai Akhir": val.innerText,
//     // }));
//   });

//   await page.waitForTimeout(1000);
//   return [murid, p, dayaTampung];
// };

// const getRankSMA = async (SMA, page) => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will in full width and height)

//   // On this new page:
//   // - open the "http://quotes.toscrape.com/" website
//   // - wait until the dom content is loaded (HTML is ready)
//   let halaman = 1;
//   await page.goto(
//     `https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/${SMA}/0/${halaman}/simple`,
//     {
//       waitUntil: "domcontentloaded",
//     }
//   );

//   await page.waitForTimeout(2000);

//   //   await page.waitForSelector(".modal-open");
//   //   await page.click("#app");
//   //   await page.click("#app");
//   await page.waitForSelector("table");

//   await page.waitForTimeout(2500);

//   //   await page.waitForSelector(".find-page");
//   //   const showAll = await page.$$("ul.pagination");
//   //   await showAll[1].click();

//   //   await page.waitForSelector(".pilih-page");
//   //   const all = await page.$x("//ul[@class='daftar-page']/li/a[contains(., '1000')]");
//   //   await all.click()

//   let [murid, text] = await page.evaluate(() => {
//     let data = {};

//     let calc = 0;

//     const table = document.querySelector("table");

//     const peringkat = Array.from(
//       table.querySelectorAll('[data-label="No Urut"]')
//     );
//     const nilai = Array.from(
//       table.querySelectorAll('[data-label="Nilai Akhir"]')
//     );
//     const nama = Array.from(table.querySelectorAll('[data-label="Nama"]'));

//     for (let i = 0; i < peringkat.length; i++) {
//       data[nama[i].innerText] = {
//         Peringkat: peringkat[i].innerText,
//         "Nilai Akhir": nilai[i].innerText,
//       };
//     }
//     let dayaTampung = Object.keys(data).length;
//     for (let i = dayaTampung - 1; i > 0; i--) {
//       if (64.52 < parseFloat(nilai[i].innerText)) {
//         calc = parseInt(peringkat[i].innerText) + 1;
//         break;
//       }
//     }

//     let chance = ((dayaTampung - calc) / dayaTampung) * 100;
//     chance = chance.toFixed(2)
//     let text = `Saskia akan ada di peringkat ${calc} dari total daya tampung ${dayaTampung} dengan kemungkinan sebesar ${chance} %`;

//     return [data, text, dayaTampung];
//     // return nilai.map(td => td.innerText)
//     // return nilai.map((val, i) => ({
//     //   Peringkat: peringkat[i].innerText,
//     //   Nama: nama[i].innerText,
//     //   "Nilai Akhir": val.innerText,
//     // }));
//   });

//   await page.waitForTimeout(1000);
//   return [murid, text];
// };

// const fetchAll = async () => {
//   const ppdb = await browser.newPage();
//   await ppdb.waitForTimeout(1000);
//   const [allMurid, posisi, daya] = await getRankSMANDA(ppdb); // SMANDA
//   const sma = [5, 3, 1, 11];
//   const target = [32030325, 32030323, 32030318, 32030320];
//   const allStatus = {};
//   for (let i = 0; i < target.length; i++) {
//     const [m, p] = await getRankSMA(target[i], ppdb);
//     allStatus[`SMA ${sma[i]}`] = p;
//   }

//   console.log("SMA Negeri 2 : ", posisi);
//   console.log(allStatus);
//   await ppdb.waitForTimeout(2500);
//   await ppdb.close();
// };

// const whatsApp = async () => {
//   const page = await browser.newPage();
//   await page.goto(`https://web.whatsapp.com`, {
//     waitUntil: "networkidle0",
//   });

//   await page.waitForSelector("[aria-label='Chat list']");
//   const [group] = await page.$x("//span[contains(.,'My Family')]");
//   const parentGroup = await group.getProperty("parentNode");
//   await parentGroup.click();
// };

// fetchAll();

