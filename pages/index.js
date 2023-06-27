import NavbarMain from '@/components/NavbarMain'
import Page from '@/components/Page'
import { Button, ButtonToolbar, Card, Col, Row } from 'react-bootstrap'
import { FiDownloadCloud } from 'react-icons/fi'

export default function Home() {

  function teste() {
    console.log('Funcionoou')
  }

  return (
    <>
      <Page title="Relatórios">
          <Card onClick={teste} border="success" style={{ width: '18rem' }}>
            <Card.Header>Relatório em PDF</Card.Header>
            <Card.Body className='text-center'>
              <FiDownloadCloud/>
              
            </Card.Body>
          </Card>
      </Page>
    </>
  )
}
