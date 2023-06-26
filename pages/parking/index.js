import Page from '@/components/Page'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Breadcrumb, Button, Table } from 'react-bootstrap'
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi'

const index = () => {

  const [parking, setparking] = useState([])
  const [block, setblock] = useState([])

  useEffect(() => {
    getAll()
    getAllBlock()

  }, [])

  function getAll() {
    axios.get('/api/parking').then(result => {
      setparking(result.data)
    })
  }

  function getAllBlock() {
    axios.get('/api/block').then(result => {
      setblock(result.data)
    })
  }

  function gerenateParking() {
    if (parking.length == 0) {
      block.forEach(element => {
        for (let i = 1; i <= 48; i++) {
          const dataApi = {
            localization: 'Terreo',
            address: element.block + i,
            plate: '-',
            apartment: '-',
          }
          axios.post('/api/parking', dataApi).then(() => {
            getAll()
          })
        }
      });

    }
    getAll()
  }

  return (
    <Page title="Vagas">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Vagas</Breadcrumb.Item>
      </Breadcrumb>

      <Button variant="success" onClick={gerenateParking}>
        <FiSave className='me-2 mb-1' />
        Gerar
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Endereço</th>
            <th>Localização</th>
            <th>Placa veículo</th>
            <th>Apartamento</th>
          </tr>
        </thead>
        <tbody>
          {parking.map((item) => (
            <tr key={item.id}>
              <td className='d-flex justify-content-evenly'>
                <Link href={'/apartment/' + item.id} className='p-0'>
                  <FiEdit className="text-primary" />
                </Link>
                <span>
                  <FiTrash2 onClick={() => remove(item.id)} className="text-danger" />
                </span>
              </td>
              <td className="text-center">{item.address}</td>
              <td className="text-center">{item.localization}</td>
              <td className="text-center">{item.plate}</td>
              <td className="text-center">{item.apartment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  )
}

export default index