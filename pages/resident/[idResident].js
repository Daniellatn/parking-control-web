import Page from '@/components/Page'
import { storage } from '@/services/firebase'
import residentValidator from '@/validators/residentValidator'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Col, Form, ProgressBar, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiSave } from 'react-icons/fi'
import { mask } from 'remask'

const formEditResident = () => {

  const [progress, setProgress] = useState(0)
  const [imgURL, setImgURL] = useState("")
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { push, query } = useRouter()

  useEffect(() => {
    if (query.idResident) {
      axios.get('/api/resident/' + query.idResident).then(result => {
        const resident = result.data
        for (let attribute in resident) {
          setValue(attribute, resident[attribute])
        }
      })
    }
  }, [query.idResident])

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function handleUpload(data) {
    const file = data.image[0];

    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
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
            .put("/api/resident/" + query.idResident, dataApi)
            .then(() => {
              setProgress(0)
              push('/resident')
            })
        })
      }
    )
  }

  return (
    <Page title="Alteração do morador">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/resident">Morador</Breadcrumb.Item>
        <Breadcrumb.Item active>Alteração morador</Breadcrumb.Item>
      </Breadcrumb>

      <Card className='shadow-lg p-3 mb-5 bg-white rounded'>
        <Card.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text"{...register('name', residentValidator.name)} />
                  {
                    errors.name &&
                    <small className='text-danger'>{errors.name.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Sobrenome</Form.Label>
                  <Form.Control type="text"{...register('lastName', residentValidator.lastName)} />
                  {
                    errors.lastName &&
                    <small className='text-danger'>{errors.lastName.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="cpf">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" mask="999.999.999-99" {...register('cpf', residentValidator.cpf)} onChange={handleChange} />
                  {
                    errors.cpf &&
                    <small className='text-danger'>{errors.cpf.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="rg">
                  <Form.Label>RG</Form.Label>
                  <Form.Control type="text" mask="9.999.999" {...register('rg', residentValidator.rg)} onChange={handleChange} />
                  {
                    errors.rg &&
                    <small className='text-danger'>{errors.rg.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="text" {...register('email', residentValidator.email)} />
                  {
                    errors.email &&
                    <small className='text-danger'>{errors.email.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="cellphone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" mask='(99) 99999-9999' {...register('cellphone', residentValidator.cellphone)} onChange={handleChange} />
                  {
                    errors.cellphone &&
                    <small className='text-danger'>{errors.cellphone.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Imagem</Form.Label>
                <Form.Control type="file" {...register('image', residentValidator.image)} />
                {
                errors.image &&
                <small className='text-danger'>{errors.image.message}</small>
              }
              </Form.Group>
            </Row>

            {!imgURL && <ProgressBar animated now={progress} label={`${progress}%`} />}

            <div className='text-center my-2'>
              <Link className='btn btn-primary p-2 px-4' href={'/resident'}>
                <FiArrowLeftCircle className='me-2 mb-1' />
                Voltar
              </Link>
              <Button className='p-2 px-4 ms-2 align-items-center' variant='success' onClick={handleSubmit(handleUpload)}>
                <FiSave className='me-2 mb-1' />
                Salvar
              </Button>
            </div>


          </Form>
        </Card.Body>
      </Card>
    </Page>
  )
}

export default formEditResident