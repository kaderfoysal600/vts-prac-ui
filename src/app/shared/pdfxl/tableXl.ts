import * as XLSX from "xlsx";

const getFileName = (name: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = name || "ExportResult";
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName
  };
};
export class TableXl {
  static exportTableToExcel(table, name?: string) {
    console.log('table', table);
    
    let { sheetName, fileName } = getFileName(name);
    let wb = XLSX.utils.table_to_book(table, <XLSX.Table2SheetOpts>{
      sheet: sheetName
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportArrayToExcel(arr: any[], name?: string) {
    let { sheetName, fileName } = getFileName(name);

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr)


    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
