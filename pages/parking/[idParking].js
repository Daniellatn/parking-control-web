import Page from '@/components/Page'
import parkingValidator from '@/validators/parkingValidator'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiSave } from 'react-icons/fi'
import { mask } from 'remask'

const formEditParking = () => {

  const [apartment, setapartment] = useState([])
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { push, query } = useRouter()

  useEffect(() => {
    if(query.idParking) {
      axios.get('/api/parking/' + query.idParking).then(result => {
        const parking = result.data
        for(let attribute in parking) {
          setValue(attribute, parking[attribute])
        }
      })
    }
    getAllApartment()
  }, [query.idParking])

  function getAllApartment() {
    axios.get('/api/apartment').then(result => {
      setapartment(result.data)
    })
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function save(data) {
    const dataApi = {
      address: data.apartment,
      localization: data.localization,
      plate: data.plate,
      apartment: data.apartment
    }
    console.log(dataApi)
    axios.put('/api/parking/' + query.idParking, dataApi)
    push('/parking')
  }

  return (
    <Page title="Alteração da vaga">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/parking">Vagas</Breadcrumb.Item>
        <Breadcrumb.Item active>Alteração vaga</Breadcrumb.Item>
      </Breadcrumb>

      <Card className='shadow-lg p-3 mb-5 bg-white rounded'>
        <Card.Body>
          <Form name='formParking'>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="localization" >
                  <Form.Label>Localização</Form.Label><br></br>
                  <Form.Select id="selectType" disabled {...register('localization', parkingValidator.localization)}>
                    <option key={0} value="">Selecione</option>
                    <option key={1} value="Térreo">Térreo</option>
                    <option key={2} value="Subsolo">Subsolo</option>
                  </Form.Select>
                  {
                    errors.localization &&
                    <small className='text-danger'>{errors.localization.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="plate">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control type="text" mask="AAS-9999" {...register('plate', parkingValidator.plate)} onChange={handleChange} />
                  {
                    errors.plate &&
                    <small className='text-danger'>{errors.plate.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="apartment">
                  <Form.Label>Apartamento</Form.Label>
                  <Form.Select id="apartment" disabled {...register('apartment', parkingValidator.apartment)}>
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
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Endereço da Vaga</Form.Label>
                  <Form.Control type="text" disabled {...register('address', vehicleValidator.plate)} />
                  {
                    errors.address &&
                    <small className='text-danger'>{errors.address.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <div className='text-center my-2'>
              <Link className='btn btn-primary p-2 px-4' href={'/parking'}>
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

export default formEditParking