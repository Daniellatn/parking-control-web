import GeneratedPDF from '@/util/generatedPDFParking'
import NavbarMain from '@/components/NavbarMain'
import Page from '@/components/Page'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Card, Col, Row } from 'react-bootstrap'
import { FiDownloadCloud } from 'react-icons/fi'
import generatedPDFParking from '@/util/generatedPDFParking'
import generatedPDFApartment from '@/util/generatedPDFAparment'
import generatedPDFResident from '@/util/generatedPDFResident'

export default function Home() {

  const [parking, setparking] = useState([])
  const [apartment, setapartment] = useState([])
  const [resident, setresident] = useState([])

  useEffect(() => {
    getAllParking()
    getAllApartment()
    getAllResident()
  }, [])

  function getAllParking() {
    axios.get('/api/parking').then(result => {
      setparking(result.data)
    })
  }

  function getAllApartment() {
    axios.get('/api/apartment').then(result => {
      setapartment(result.data)
    })
  }

  function getAllResident() {
    axios.get('/api/resident').then(result => {
      setresident(result.data)
    })
  }

  function pdfParking() {
    generatedPDFParking(parking)
  }

  function pdfApartment() {
    generatedPDFApartment(apartment)
  }

  function pdfResident() {
    generatedPDFResident(resident)
  }

  return (
    <>
      <Page title="Relatórios">
        <Row md={3}>
          <Card onClick={pdfParking} border="success" style={{ width: '18rem' }} className='ms-2'>
            <Card.Header>Relatório vagas</Card.Header>
            <Card.Body className='text-center'>
              <FiDownloadCloud />
            </Card.Body>
          </Card>

          <Card onClick={pdfApartment} border="success" style={{ width: '18rem' }} className='ms-2'>
            <Card.Header>Relatório apartamentos</Card.Header>
            <Card.Body className='text-center'>
              <FiDownloadCloud />
            </Card.Body>
          </Card>

          <Card onClick={pdfResident} border="success" style={{ width: '18rem' }} className='ms-2'>
            <Card.Header>Relatório moradores</Card.Header>
            <Card.Body className='text-center'>
              <FiDownloadCloud />
            </Card.Body>
          </Card>
        </Row>


      </Page>
    </>
  )
}
