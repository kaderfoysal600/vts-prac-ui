export class TableUtil {
  static exportToPdf(tableHtml: string, name?: string) {
    console.log('tableHtml', tableHtml)
    const popupWin = window.open('', '_blank','top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Printed Data of ${name}</title>
          <style>
          .table {
            /* Add any table styling you want here */
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000; /* Add a border around the table */
          }
          th, td {
            /* Add any header and data cell styling you want here */
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center; 
          }
          .full-name{
            min-width:90px;
          }
          .full-date{
            min-width:90px;
          }
          .pdf-image {
            max-width: 70px;
            height: auto;
          }
        </style>
        </head>
        <body onload="window.print(); window.close()">
          <table class="table table-bordered">${tableHtml}</table>
        </body>
      </html>`
    );
    popupWin.document.close();
  }
}