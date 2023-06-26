import Page from '@/components/Page'
import apiVehicleMark from '@/services/apiVehicleMark'
import { storage } from '@/services/firebase'
import vehicleValidator from '@/validators/vehicleValidator'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Link from 'next/link'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Breadcrumb, Button, Form, Modal, ProgressBar, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiArrowLeftCircle, FiEdit, FiPlusCircle, FiSave, FiTrash2 } from 'react-icons/fi'
import { mask } from 'remask'

const index = () => {

  const [vehicle, setvehicle] = useState([])
  const [mark, setMark] = useState([])
  const [imgURL, setImgURL] = useState("");
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

  useEffect(() => {
    getAll()
  }, [])

  function getAll() {
    axios.get('/api/vehicle').then(result => {
      setvehicle(result.data)
    })
  }

  function getAllMark(type) {
    if(type == "") {
      setMark([])
    } else {
      apiVehicleMark.get('/' + type + '/marcas').then(result => {
        setMark(result.data)
      })
    }
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
            .post("/api/vehicle", dados)
            .then(() => {
              setProgress(0);
              handleClose()
              reset()
            })
        });
      }
    );
  };

  function remove(id) {
    if (confirm('Deseja relamente excluir?')) {
      axios.delete('/api/vehicle/' + id)
    }
    getAll()
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const maskField = event.target.getAttribute('mask')

    setValue(name, mask(value, maskField))
  }

  function handleChangeMark(event) {
    const value = event.target.value

    console.log('value', value)

    getAllMark(value)
  }

  return (
    <Page titulo="Veículos">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>Veículos</Breadcrumb.Item>
      </Breadcrumb>
      <Button onClick={handleShow} className='btn btn-success my-3'> <FiPlusCircle /> Novo</Button>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Cor</th>
            <th>Marca</th>
          </tr>
        </thead>
        <tbody>
          {vehicle.map((item) => (
            <tr key={item.id}>
              <td className='d-flex justify-content-evenly'>
                <Link href={'/vehicle/' + item.id} className='p-0'>
                  <FiEdit className="text-primary" />
                </Link>
                <span>
                  <FiTrash2 onClick={() => remove(item.id)} className="text-danger" />
                </span>
              </td>
              <td className="text-center">{item.plate}</td>
              <td className="text-center">{item.model}</td>
              <td className="text-center">{item.year}</td>
              <td className="text-center">{item.color}</td>
              <td className="text-center">{item.mark}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de veículos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="type" >
              <Form.Label>Tipo Veiculo</Form.Label>
              <Form.Select id="selectType" {...register('type', vehicleValidator.type)} onChange={handleChangeMark}>
                <option key={0} value="">Selecione</option>
                <option key={1} value="carros">Carro</option>
                <option key={2} value="motos">Moto</option>
              </Form.Select>
              {
                errors.type &&
                <small className='text-danger'>{errors.type.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="plate">
              <Form.Label>Placa</Form.Label>
              <Form.Control type="text" mask="AAS-9999" {...register('plate', vehicleValidator.plate)} onChange={handleChange} />
              {
                errors.plate &&
                <small className='text-danger'>{errors.plate.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="model">
              <Form.Label>Modelo</Form.Label>
              <Form.Control type="text" {...register('model', vehicleValidator.model)} />
              {
                errors.model &&
                <small className='text-danger'>{errors.model.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="year">
              <Form.Label>Ano</Form.Label>
              <Form.Control type="text" mask="9999" {...register('year', vehicleValidator.year)} onChange={handleChange} />
              {
                errors.year &&
                <small className='text-danger'>{errors.year.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="color">
              <Form.Label>Cor</Form.Label>
              <Form.Control type="text" {...register('color', vehicleValidator.color)} />
              {
                errors.color &&
                <small className='text-danger'>{errors.color.message}</small>
              }
            </Form.Group>
            <Form.Group className="mb-3" controlId="mark">
              <Form.Label>Marca</Form.Label>
              <Form.Select id="selectMark" {...register('mark', vehicleValidator.mark)}>
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
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Imagem</Form.Label>
              <Form.Control type="file" {...register('image')} />
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