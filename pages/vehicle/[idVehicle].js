import Page from '@/components/Page'
import apiVehicleMark from '@/services/apiVehicleMark'
import { storage } from '@/services/firebase'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Breadcrumb, Button, Card, Col, Form, ProgressBar, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiSave } from 'react-icons/fi'
import { mask } from 'remask'

const formEditVehicle = () => {

  const [mark, setMark] = useState([])
  const [progress, setProgress] = useState(0)
  const [imgURL, setImgURL] = useState("")
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { push, query } = useRouter()

  useEffect(() => {
    if (query.idVehicle) {
      axios.get('/api/vehicle/' + query.idVehicle).then(result => {
        const vehicle = result.data
        for (let attribute in vehicle) {
          setValue(attribute, vehicle[attribute])
        }
        getAllMark(vehicle.type)
      })
    }
  }, [query.idVehicle])

  function getAllMark(type) {
    if (type == "") {
      setMark([])
    } else {
      apiVehicleMark.get('/' + type + '/marcas').then(result => {
        setMark(result.data)
      })
    }
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function handleChangeMark(event) {
    const value = event.target.value
    getAllMark(value)
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
          const dados = {
            type: data.type,
            plate: data.plate,
            model: data.model,
            year: data.year,
            color: data.color,
            mark: data.mark,
            imageUrl: url,
          };

          axios
            .put("/api/vehicle/" + query.idVehicle, dados)
            .then(() => {
              setProgress(0)
              push('/vehicle')
            })
        });
      }
    );
  };

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }


  return (
    <Page title="Alteração do Veículo">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/vehicle">Veiculo</Breadcrumb.Item>
        <Breadcrumb.Item active>Alteração veiculo</Breadcrumb.Item>
      </Breadcrumb>

      <Card className='shadow-lg p-3 mb-5 bg-white rounded'>
        <Card.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="type" >
                  <Form.Label>Tipo Veiculo</Form.Label>
                  <Form.Select id="type" {...register('type', vehicleValidator.type)} onChange={handleChangeMark}>
                    <option key={0} value="">Selecione</option>
                    <option key={1} value="carros">Carro</option>
                    <option key={2} value="motos">Moto</option>
                  </Form.Select>
                  {
                    errors.type &&
                    <small className='text-danger'>{errors.type.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="mark">
                  <Form.Label>Marca</Form.Label>
                  <Form.Select id="mark" {...register('mark', vehicleValidator.mark)}>
                    <option value="">Selecione</option>
                    {mark.map((item) => (
                      <option key={item.codigo} value={item.nome}>{item.nome}</option>
                    ))}
                  </Form.Select>
                  {
                    errors.mark &&
                    <small className='text-danger'>{errors.mark.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="model">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control type="text" {...register('model', vehicleValidator.model)} />
                  {
                    errors.model &&
                    <small className='text-danger'>{errors.model.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="color">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control type="text" {...register('color', vehicleValidator.color)} />
                  {
                    errors.color &&
                    <small className='text-danger'>{errors.color.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="year">
                  <Form.Label>Ano</Form.Label>
                  <Form.Control type="text" mask="9999" {...register('year', vehicleValidator.year)} onChange={handleChange} />
                  {
                    errors.year &&
                    <small className='text-danger'>{errors.year.message}</small>
                  }
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="plate">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control type="text" mask="AAS-9999" {...register('plate', vehicleValidator.plate)} onChange={handleChange} />
                  {
                    errors.plate &&
                    <small className='text-danger'>{errors.plate.message}</small>
                  }
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Imagem</Form.Label>
                <Form.Control type="file" {...register('image', vehicleValidator.image)} />
                {
                errors.image &&
                <small className='text-danger'>{errors.image.message}</small>
              }
              </Form.Group>
            </Row>

            {!imgURL && <ProgressBar animated now={progress} label={`${progress}%`} />}

            <div className='text-center my-2'>
              <Link className='btn btn-primary p-2 px-4' href={'/vehicle'}>
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

export default formEditVehicle