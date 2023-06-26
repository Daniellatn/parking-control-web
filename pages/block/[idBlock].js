import Page from '@/components/Page';
import blockValidator from '@/validators/blockValidator';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { FiArrowLeftCircle, FiSave } from 'react-icons/fi';

const formEditBlock = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { push, query } = useRouter()

  useEffect(() => {
    if (query.idBlock) {
      axios.get('/api/block/' + query.idBlock).then(result => {
        const block = result.data
        for (let attribute in block) {
          setValue(attribute, block[attribute])
        }
      })
    }
  }, [query.idBlock])

  function save(data) {
    axios.put('/api/block/' + query.idBlock, data)
    push('/block')
  }

  return (
    <Page title="Alteração do bloco">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/block">Bloco</Breadcrumb.Item>
        <Breadcrumb.Item active>Alteração bloco</Breadcrumb.Item>
      </Breadcrumb>

      <Form className='my-3'>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Bloco</Form.Label>
          <Form.Control type="text" mask='A' {...register('block', blockValidator.block)} />
          {
            errors.block &&
            <small className='text-danger'>{errors.block.message}</small>
          }
        </Form.Group>

        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Descrição</Form.Label>
          <Form.Control type="text" {...register('description', blockValidator.description)}/>
          {
            errors.description &&
            <small className='text-danger'>{errors.description.message}</small>
          }
        </Form.Group>



        <div className='text-center'>
          <Link className='btn btn-secondary p-2 px-4' href={'/block'}>
            <FiArrowLeftCircle className='me-2 mb-1' />
            Voltar
          </Link>
          <Button className='p-2 px-4 ms-2 align-items-center' variant='success' onClick={handleSubmit(save)}>
            <FiSave className='me-2 mb-1' />
            Salvar
          </Button>
        </div>
      </Form>

    </Page>

  )
}

export default formEditBlock