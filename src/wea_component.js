import React from 'react';
import {Card, Container, Row, Col} from 'react-bootstrap';

export default class Weather_component extends React.Component {

    render() {
        return (
            <Container className="WeaCompo">
                <Row className="WeaCompo">
                    <Col xs={4} className='cardimg'>
                        <Card.Img
                            className={'weathercardimg' + this.props.inverted ? ' inverted' : ''}
                            variant='top' src={this.props.imgsrc}
                            title = {this.props.imgalt}
                        >
                        </ Card.Img>
                    </Col>
                    <Col className='carddesc'>
                        <Card className='semi-trans' bg='secondary' text='white'>
                            <Card.Body>
                                <Card.Title>{this.props.name}: {this.props.value}</Card.Title>
                                <Card.Text>{this.props.text}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            );
    }
}

