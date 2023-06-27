import React from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function generatedPDFResident(parking) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const reportTitle = [
    {
      text: 'Relatório de moradores',
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45]
    }
  ]

  const data = parking.map((item) => {
    return [
      { text: item.nameComplete, fontSize: 10 },
      { text: item.cpf, fontSize: 10 },
      { text: item.email, fontSize: 10 },
      { text: item.cellphone, fontSize: 10 }
    ]
  })

  const details = [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: [
          [
            { text: 'Nome', style: 'tableHeader', fontSize: 12 },
            { text: 'CPF', style: 'tableHeader', fontSize: 12 },
            { text: 'E-mail', style: 'tableHeader', fontSize: 12 },
            { text: 'Contato', style: 'tableHeader', fontSize: 12 }
          ],
          ...data
        ]

      },
      layout: 'headerLineOnly'
    }
  ]

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [15, 50, 15, 40],

    header: [reportTitle],
    content: [details]

  }

  pdfMake.createPdf(docDefinition).download()
}

export default generatedPDFResident