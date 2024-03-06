import React from 'react'
import { Row, Col } from 'react-bootstrap'

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
    <footer>
        <Row>
            <Col className='text-center py-3'>
                <p>Find Your Farm &copy; {currentYear}</p>
            </Col>
        </Row>
    </footer>
  )
}

export default Footer