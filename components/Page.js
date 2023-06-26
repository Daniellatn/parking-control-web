import '../styles/Home.module.css'
import React from 'react'
import NavbarMain from './NavbarMain'
import { Breadcrumb, Container } from 'react-bootstrap'

const Page = (props) => {
  return (
    <>
      <NavbarMain />
      <div className='bg-light text-dark py-2 text-center'>
        <Container>
          <h4>{props.title}</h4>
        </Container>
      </div>
      <Container>
        {props.children}
      </Container>

    </>
  )
}

export default Page