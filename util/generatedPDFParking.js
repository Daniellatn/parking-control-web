import React from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function generatedPDFParking(parking) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const reportTitle = [
    {
      text: 'Relatório de vagas',
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45]
    }
  ]

  const data = parking.map((item) => {
    return [
      { text: item.address, fontSize: 10 },
      { text: item.localization, fontSize: 10 },
      { text: item.plate, fontSize: 10 },
      { text: item.apartment, fontSize: 10 }
    ]
  })

  const details = [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: [
          [
            { text: 'Vaga', style: 'tableHeader', fontSize: 12 },
            { text: 'Localização', style: 'tableHeader', fontSize: 12 },
            { text: 'Placa veículo', style: 'tableHeader', fontSize: 12 },
            { text: 'Apartamento', style: 'tableHeader', fontSize: 12 }
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

export default generatedPDFParking