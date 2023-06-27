import Page from '@/components/Page'
import parkingValidator from '@/validators/parkingValidator'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Breadcrumb, Button, Form, Modal, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiEdit, FiPlusCircle, FiSave, FiTrash2 } from 'react-icons/fi'
import { mask } from 'remask'

const index = () => {

  const [parking, setparking] = useState([])
  const [block, setblock] = useState([])
  const [apartment, setapartment] = useState([])
  const [adress1, setadress1] = useState([])
  const [show, setShow] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

  useEffect(() => {
    getAll()
    getAllBlock()
    getAllApartment()
  }, [])

  function getAll() {
    axios.get('/api/parking').then(result => {
      setparking(result.data)
    })
  }

  function getAllBlock() {
    axios.get('/api/block').then(result => {
      const listBlock = result.data
      listBlock.sort((a, b) => a.block > b.block ? 1 : -1)
      setblock(listBlock)
    })
  }

  function getAllApartment() {
    axios.get('/api/apartment').then(result => {
      setapartment(result.data)
    })
  }

  function handleClose() {
    setShow(false)
  }

  function handleShow() {
    setShow(true)
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')
    setValue(name, mask(value, maskField))
  }

  function handleChangeAdrees(event) {
    const value = event.target.value
    setValue('address', value)
  }

  function save(data) {
    const dataApi = {
      address: data.apartment,
      localization: data.localization,
      plate: data.plate,
      apartment: data.apartment
    }
    axios.post('/api/parking', dataApi).then(() => {
      getAll()
      handleClose()
      reset()
    })
  }

  return (
    <Page title="Vagas">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Vagas</Breadcrumb.Item>
      </Breadcrumb>

      <Button onClick={handleShow} className='btn btn-success my-3'> <FiPlusCircle /> Novo</Button>

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
                <Link href={'/parking/' + item.id} className='p-0'>
                  <FiEdit className="text-primary" />
                </Link>
              </td>
              <td className="text-center">{item.address}</td>
              <td className="text-center">{item.localization}</td>
              <td className="text-center">{item.plate}</td>
              <td className="text-center">{item.apartment}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de vagas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="localization" >
              <Form.Label>Localização</Form.Label><br></br>
              <Form.Select id="selectType" {...register('localization', parkingValidator.localization)}>
                <option key={0} value="">Selecione</option>
                <option key={1} value="Térreo">Térreo</option>
                <option key={2} value="Subsolo">Subsolo</option>
              </Form.Select>
              {
                errors.localization &&
                <small className='text-danger'>{errors.localization.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="plate">
              <Form.Label>Placa</Form.Label>
              <Form.Control type="text" mask="AAA-S999" {...register('plate',  parkingValidator.plate)} onChange={handleChange} />
              {
                errors.plate &&
                <small className='text-danger'>{errors.plate.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="apartment">
              <Form.Label>Apartamento</Form.Label>
              <Form.Select id="apartment" {...register('apartment',  parkingValidator.apartment)} onChange={handleChangeAdrees}>
                <option value="">Selecione</option>
                {apartment.map((item) => (
                  <option key={item.id} value={item.unit}>{item.unit}</option>
                ))}
              </Form.Select>
              {
                errors.apartment &&
                <small className='text-danger'>{errors.apartment.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Endereço da Vaga</Form.Label>
              <Form.Control type="text" {...register('address')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FiArrowLeftCircle className='me-2 mb-1' />
            Voltar
          </Button>
          <Button variant="success" onClick={handleSubmit(save)}>
            <FiSave className='me-2 mb-1' />
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Page>
  )
}

export default index