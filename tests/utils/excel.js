const XLSX = require('xlsx');
const path = require('path');

function readExcel(fileName) {
  const wb = XLSX.readFile(path.resolve('tests/utils/data', fileName));
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

module.exports = { readExcel };