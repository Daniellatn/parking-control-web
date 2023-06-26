import Page from '@/components/Page'
import apartmentValidator from '@/validators/apartmentValidator'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Breadcrumb, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiSave } from 'react-icons/fi'
import { mask } from 'remask'

const formEditApartment = () => {

  const [block, setblock] = useState([])
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { push, query } = useRouter()

  useEffect(() => {
    if (query.idApartment) {
      axios.get('/api/apartment/' + query.idApartment).then(result => {
        const apartment = result.data
        console.log('Aqui', result.data)
        for (let attribute in apartment) {
          setValue(attribute, apartment[attribute])
        }
      })
    }
    getAllBlock()
  }, [query.idApartment])

  function getAllBlock() {
    axios.get('/api/block').then(result => {
      setblock(result.data)
    })
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function save(data) {
    axios.put('/api/apartment/' + query.idApartment, data)
    push('/apartment')
  }

  return (
    <Page title="Alteração do apartamento">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/apartment">Apartamento</Breadcrumb.Item>
        <Breadcrumb.Item active>Alteração apartamento</Breadcrumb.Item>
      </Breadcrumb>

      <Card className='shadow-lg p-3 mb-5 bg-white rounded'>
        <Card.Body>
          <Form name='formApartment'>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="number" >
                  <Form.Label>Número apartamento</Form.Label>
                  <Form.Control type="text" mask="9999" {...register('number', apartmentValidator.plate)} onChange={handleChange} />
                  {
                    errors.number &&
                    <small className='text-danger'>{errors.number.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="amountResidents">
                  <Form.Label>Quantidade de moradores?</Form.Label>
                  <Form.Control type="number" {...register('amountResidents')} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="floor">
                  <Form.Label>Andar</Form.Label>
                  <Form.Control type="text" mask="99" {...register('floor', apartmentValidator.floor)} />
                  {
                    errors.floor &&
                    <small className='text-danger'>{errors.floor.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="block">
                  <Form.Label>Bloco</Form.Label>
                  <Form.Select id="block" {...register('block', apartmentValidator.block)}>
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
              </Col>
            </Row>
            <div className='text-center my-2'>
              <Link className='btn btn-primary p-2 px-4' href={'/apartment'}>
                <FiArrowLeftCircle className='me-2 mb-1' />
                Voltar
              </Link>
              <Button className='p-2 px-4 ms-2 align-items-center' variant='success' onClick={handleSubmit(save)}>
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

export default formEditApartment