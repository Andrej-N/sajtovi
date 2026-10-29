// name -> slug for one niche, read from EMAIL-LEADOVI.xlsx so the folders always match the links in the mail.
const path = require('path');
const ExcelJS = require('exceljs');

module.exports = async function slugovi(niche) {
  const root = path.join(__dirname, '..', '..');
  const sheet = require(path.join(root, 'email-leadovi-po-delatnosti.json')).find((x) => x.niche === niche).sheet;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(root, 'EMAIL-LEADOVI.xlsx'));
  const map = new Map();
  wb.getWorksheet(sheet).eachRow((r, i) => { if (i > 1) map.set(String(r.getCell(2).value), String(r.getCell(3).value)); });
  return map;
};
