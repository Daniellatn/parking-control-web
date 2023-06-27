import Page from '@/components/Page'
import { storage } from '@/services/firebase'
import residentValidator from '@/validators/residentValidator'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Col, Form, Modal, ProgressBar, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiEdit, FiPlusCircle, FiSave, FiTrash2 } from 'react-icons/fi'
import { mask } from 'remask'

const index = () => {

  const [resident, setresident] = useState([])
  const [imgURL, setImgURL] = useState("")
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

  useEffect(() => {
    getAll()
  }, [])

  function getAll() {
    axios.get('/api/resident').then(result => {
      setresident(result.data)
    })
  }

  function handleClose() {
    getAll()
    setShow(false)
  }

  function handleShow() {
    setShow(true)
  }

  function handleUpload(data) {
    const file = data.image[0];

    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImgURL(url)
          const dataApi = {
            name: data.name,
            lastName: data.lastName,
            cpf: data.cpf,
            rg: data.rg,
            email: data.email,
            cellphone: data.cellphone,
            imageUrl: url,
          }
          axios
            .post("/api/resident", dataApi)
            .then(() => {
              setProgress(0);
              handleClose()
              reset()
            })
        })
      }
    )
  }

  function remove(id) {
    if (confirm('Deseja relamente excluir?')) {
      axios.delete('/api/resident/' + id)
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
    <Page titulo="Morador">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Moradores</Breadcrumb.Item>
      </Breadcrumb>

      <Button onClick={handleShow} className='btn btn-success my-3'> <FiPlusCircle /> Novo</Button>

      <Row md={3}>
        {resident.map(item => (
          <Col key={item.id} className='mb-3'>
            <Card className="mb-3">
              <Card.Img variant="top" width={75} height={250} src={item.imageUrl} />
              <Card.Body>
                <Card.Title className='text-center'>{item.name + " " + item.lastName}</Card.Title>
                <p><strong> CPF: </strong> {item.cpf} <strong> RG: </strong>{item.rg} </p>
                <p><strong> E-mail: </strong> {item.email}</p>
                <p><strong> Telefone: </strong> {item.cellphone}</p>

                <div className='text-center my-2'>
                  <Button className='p-2 px-4 align-items-center' variant='danger' onClick={() => remove(item.id)}>
                    <FiTrash2 className='me-2 mb-1' />
                    Excluir
                  </Button>
                  <Link className='btn btn-success p-2 px-4 ms-2' href={'/resident/' + item.id}>
                    <FiEdit className='me-2 mb-1' />
                    Editar
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de moradores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text"{...register('name', residentValidator.name)} />
              {
                errors.name &&
                <small className='text-danger'>{errors.name.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control type="text"{...register('lastName', residentValidator.lastName)} />
              {
                errors.lastName &&
                <small className='text-danger'>{errors.lastName.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="cpf">
              <Form.Label>CPF</Form.Label>
              <Form.Control type="text" mask="999.999.999-99" {...register('cpf', residentValidator.cpf)} onChange={handleChange} />
              {
                errors.cpf &&
                <small className='text-danger'>{errors.cpf.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="rg">
              <Form.Label>RG</Form.Label>
              <Form.Control type="text" mask="9.999.999" {...register('rg', residentValidator.rg)} onChange={handleChange} />
              {
                errors.rg &&
                <small className='text-danger'>{errors.rg.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="text" {...register('email', residentValidator.email)} />
              {
                errors.email &&
                <small className='text-danger'>{errors.email.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="cellphone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" mask='(99) 99999-9999' {...register('cellphone', residentValidator.cellphone)} onChange={handleChange} />
              {
                errors.cellphone &&
                <small className='text-danger'>{errors.cellphone.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Imagem</Form.Label>
              <Form.Control type="file" {...register('image', residentValidator.image)} />
              {
                errors.image &&
                <small className='text-danger'>{errors.image.message}</small>
              }
            </Form.Group>
          </Form>
          {!imgURL && <ProgressBar animated now={progress} label={`${progress}%`} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FiArrowLeftCircle className='me-2 mb-1' />
            Voltar
          </Button>
          <Button variant="success" onClick={handleSubmit(handleUpload)}>
            <FiSave className='me-2 mb-1' />
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Page>
  )
}

export default index