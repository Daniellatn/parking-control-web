import Page from '@/components/Page'
import apartmentValidator from '@/validators/apartmentValidator'
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

  const [apartment, setapartment] = useState([])
  const [block, setblock] = useState([])
  const [resident, setresident] = useState([])
  const [show, setShow] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

  useEffect(() => {
    getAll()
    getAllBlock()
    getAllResident()
  }, [])

  function getAll() {
    axios.get('/api/apartment').then(result => {
      setapartment(result.data)
    })
  }

  function getAllResident() {
    axios.get('/api/resident').then(result => {
      setresident(result.data)
    })
  }

  function getAllBlock() {
    axios.get('/api/block').then(result => {
      const listBlock = result.data
      listBlock.sort((a, b) => a.block > b.block ? 1 : -1)
      setblock(listBlock)
    })
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function handleClose() {
    setShow(false)
  }

  function handleShow() {
    setShow(true)
  }

  function save(data) {
    const dataApi = {
      unit: data.block + data.number,
      number: data.number,
      amountResidents: data.amountResidents,
      floor: data.floor,
      block: data.block,
      resident: data.resident
    }
    axios.post('/api/apartment', dataApi).then(() => {
      getAll()
      handleClose()
      reset()
    })    
  }

  function remove(id) {
    if (confirm('Deseja relamente excluir?')) {
      axios.delete('/api/apartment/' + id)
    }
    getAll()
  }

  return (
    <Page title="Apartamento">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Apartamentos</Breadcrumb.Item>
      </Breadcrumb>
      <Button onClick={handleShow} className='btn btn-success my-3'> <FiPlusCircle /> Novo</Button>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Unidade</th>
            <th>Andar</th>
            <th>Bloco</th>
            <th>Número apartamento</th>
            <th>Morador responsável</th>
          </tr>
        </thead>
        <tbody>
          {apartment.map((item) => (
            <tr key={item.id}>
              <td className='d-flex justify-content-evenly'>
                <Link href={'/apartment/' + item.id} className='p-0'>
                  <FiEdit className="text-primary" />
                </Link>
                <span>
                  <FiTrash2 onClick={() => remove(item.id)} className="text-danger" />
                </span>
              </td>
              <td className="text-center">{item.unit}</td>
              <td className="text-center">{item.floor}</td>
              <td className="text-center">{item.block}</td>
              <td className="text-center">{item.number}</td>
              <td className="text-center">{item.resident}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de veículos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form name='formApartment'>
            <Form.Group className="mb-3" controlId="number" >
              <Form.Label>Número apartamento</Form.Label>
              <Form.Control type="text" mask="9999" {...register('number', apartmentValidator.number)} onChange={handleChange} />
              {
                errors.number &&
                <small className='text-danger'>{errors.number.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="amountResidents">
              <Form.Label>Quantidade de moradores?</Form.Label>
              <Form.Control type="number" {...register('amountResidents')} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="floor">
              <Form.Label>Andar</Form.Label>
              <Form.Control type="text" mask="99" {...register('floor', apartmentValidator.floor)} />
              {
                errors.floor &&
                <small className='text-danger'>{errors.floor.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="block">
              <Form.Label>Bloco</Form.Label>
              <Form.Select id="selectBlock" {...register('block', apartmentValidator.block)}>
                <option value="">Selecione</option>
                {block.map((item) => (
                  <option key={item.id} value={item.block}>{item.block}</option>
                ))}
              </Form.Select>
              {
                errors.block &&
                <small className='text-danger'>{errors.block.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="resident">
              <Form.Label>Morador</Form.Label>
              <Form.Select id="selectBlock" {...register('resident', apartmentValidator.resident)}>
                <option value="">Selecione</option>
                {resident.map((item) => (
                  <option key={item.id} value={item.nameComplete}>{item.nameComplete}</option>
                ))}
              </Form.Select>
              {
                errors.resident &&
                <small className='text-danger'>{errors.resident.message}</small>
              }
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