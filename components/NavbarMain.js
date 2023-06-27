import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import { Container, Image, Nav, Navbar } from 'react-bootstrap'

const NavbarMain = () => {
  return (
    <>
      <Navbar bg="success" variant="dark">
        <Container>
          <Navbar.Brand href="/">Parking Control Web</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/block">Bloco</Nav.Link>
            <Nav.Link href="/apartment">Apartamento</Nav.Link>
            <Nav.Link href="/vehicle">Veículo</Nav.Link>
            <Nav.Link href="/resident">Morador</Nav.Link>
            <Nav.Link href="/parking">Vaga</Nav.Link>
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Olá, Sindico <a href="#login">Sair</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavbarMain