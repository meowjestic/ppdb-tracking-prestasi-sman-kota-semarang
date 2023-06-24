import puppeteer from "puppeteer";

export const getRankSMANDA = async (page) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  let halaman = 1;
  await page.goto(
    `https://ppdb.jatengprov.go.id/#/030201/hasil/seleksi/32030322/0/${halaman}/simple`,
    {
      waitUntil: "domcontentloaded",
    }
  );
  await page.waitForSelector(".modal-open");
  await page.waitForTimeout(2500);

  //   const [buttonModal] = await page.$x("//div[@class='modal-header']/button[@aria-label='Close']")
  //   await buttonModal.evaluate(b => b.click())

  //   await page.waitForTimeout(2500);

  await page.waitForSelector(".find-page");
  const showAll = await page.$$("ul.pagination");
  await showAll[1].click();

  await page.waitForSelector(".pilih-page");
  const [all] = await page.$x(
    "//ul[@class='daftar-page']/li/a[contains(., '1000')]"
  );
  await all.evaluate((a) => a.click());

  let [murid, p, dayaTampung] = await page.evaluate(() => {
    let data = {};
    const table = document.querySelector("table");

    const peringkat = Array.from(
      table.querySelectorAll('[data-label="No Urut"]')
    );
    const nilai = Array.from(
      table.querySelectorAll('[data-label="Nilai Akhir"]')
    );
    const nama = Array.from(table.querySelectorAll('[data-label="Nama"]'));

    for (let i = 0; i < peringkat.length; i++) {
      data[nama[i].innerText] = {
        Peringkat: peringkat[i].innerText,
        "Nilai Akhir": nilai[i].innerText,
      };
    }

    let totalTerdaftar = Object.keys(data).length;

    return [
      data,
      `Saskia Callerista ada di peringkat ${data["SASKIA CALLERISTA"]["Peringkat"]}`,
      totalTerdaftar,
    ];
    // return nilai.map(td => td.innerText)
    // return nilai.map((val, i) => ({
    //   Peringkat: peringkat[i].innerText,
    //   Nama: nama[i].innerText,
    //   "Nilai Akhir": val.innerText,
    // }));
  });

  await page.waitForTimeout(1000);
  return [murid, p, dayaTampung];
};

export const getRankSMA = async (url, page, nilai_akhir) => {
  await page.goto( url, {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector(".find-page");
  const showAll = await page.$$("ul.pagination");
  await showAll[1].evaluate((a) => a.click());

  await page.waitForSelector(".pilih-page");
  const [all] = await page.$x(
    "//ul[@class='daftar-page']/li/a[contains(., '1000')]"
  );
  await all.evaluate((a) => a.click());

  await page.waitForTimeout(250);
  await page.waitForSelector("table");
  await page.waitForTimeout(500);

  let [semua_pendaftar, text,daya_tampung,peringkat] = await page.evaluate((nilai_akhir) => {
    let data = {};
    let calc = 1;

    const table = document.querySelector("table");

    const peringkat = Array.from(
      table.querySelectorAll('[data-label="No Urut"]')
    );
    const nilai = Array.from(
      table.querySelectorAll('[data-label="Nilai Akhir"]')
    );
    const nama = Array.from(table.querySelectorAll('[data-label="Nama"]'));

    for (let i = 0; i < peringkat.length; i++) {
      data[nama[i].innerText] = {
        Peringkat: peringkat[i].innerText,
        "Nilai Akhir": nilai[i].innerText,
      };
    }
    let dayaTampung = Object.keys(data).length;
    for (let d = dayaTampung - 1; d >= 0; d--) {
      if (nilai_akhir < parseFloat(nilai[d].innerText).toFixed(2)) {
        calc = parseInt(peringkat[d].innerText) + 1;
        break;
      }
    }

    // let chance = ((dayaTampung - calc) / dayaTampung) * 100;
    // chance = chance.toFixed(2)

    let text = `Peringkat ${calc} dari ${dayaTampung}`;

    return [data, text, dayaTampung, calc];
    // return nilai.map(td => td.innerText)
    // return nilai.map((val, i) => ({
    //   Peringkat: peringkat[i].innerText,
    //   Nama: nama[i].innerText,
    //   "Nilai Akhir": val.innerText,
    // }));
  },nilai_akhir);

  await page.waitForTimeout(250);
  return [semua_pendaftar, text,daya_tampung,peringkat];
};

// const browser = await puppeteer.launch({
//   defaultViewport: null,
//   userDataDir: "./whatsappData",
//   headless: false,
// });

// const page = await browser.newPage()

export const extractDataSiswa = async (page, id) => {
  console.log(`getting student's data`);
  try {
    await page.goto(`https://ppdb.jatengprov.go.id/#/030201/detail/${id}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".mtable");
    const table = await page.evaluate(() => {
      let rootTable = document.querySelector("table");
      let namaSiswa = rootTable.querySelector(
        "thead > tr:nth-child(4) > td:nth-child(2)"
      );
      let nilaiAkhir = rootTable.querySelector(".text-danger");
      let peringkat = rootTable.querySelector(
        "thead > tr:last-child > td:nth-child(2)"
      );

      let data = {
        nama_siswa: namaSiswa.innerText,
        nilai_akhir: nilaiAkhir.innerText,
        peringkat_pilihan: peringkat.innerText,
      };
      return data;
    });

    return table;
  } catch (error) {
    return error;
  }
};

// console.log(await extractDataSiswa(page,483102380250112))
