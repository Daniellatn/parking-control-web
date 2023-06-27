import Page from '@/components/Page'
import blockValidator from '@/validators/blockValidator';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Modal, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiArrowLeftCircle, FiEdit, FiPlusCircle, FiSave, FiTrash2 } from "react-icons/fi";
import { mask } from 'remask';

const index = () => {

  const [block, setblock] = useState([])
  const [show, setShow] = useState(false)
  

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

  useEffect(() => {
    getAll()
  }, [])

  function getAll() {
    axios.get('/api/block').then(result => {
      const listBlock = result.data
      listBlock.sort((a, b) => a.block > b.block ? 1 : -1)
      setblock(listBlock)
    })
  }

  function save(data) {
    const dataApi = {
      block: data.block,
      description: data.description
    }
    axios.post('/api/block', dataApi).then(() => {
      getAll()
      handleClose()
      reset()
    })    
  }

  function handleClose() {
    setShow(false)
  }

  function handleShow() {
    setShow(true)  
  }

  function remove(id) {
    if (confirm('Deseja relamente excluir?')) {
      axios.delete('/api/block/' + id)
    }
    getAll()
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')
    setValue(name, mask(value, maskField))
  }

  return (
    <Page title="Bloco">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Bloco</Breadcrumb.Item>
      </Breadcrumb>
      <Button onClick={handleShow} className='btn btn-success my-3'> <FiPlusCircle /> Novo</Button>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Bloco</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {block.map((item) => (
            <tr key={item.id}>
              <td className='d-flex justify-content-evenly'>
                <Link href={'/block/' + item.id} className='p-0'>
                  <FiEdit className="text-primary" />
                </Link>
                <span>
                  <FiTrash2 onClick={() => remove(item.id)} className="text-danger" />
                </span>
              </td>
              <td className="text-center">{item.block}</td>
              <td className="text-center">{item.description}</td>
            </tr>
          ))}

        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de bloco</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="block">
              <Form.Label>Bloco</Form.Label>
              <Form.Control type="text" mask='A' {...register('block', blockValidator.block)} onChange={handleChange} />
              {
                errors.block &&
                <small className='text-danger'>{errors.block.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" {...register('description', blockValidator.description)}/>
              {
                errors.description &&
                <small className='text-danger'>{errors.description.message}</small>
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