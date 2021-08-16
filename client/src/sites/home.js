import Carousel from 'react-bootstrap/Carousel';
import Accordion from 'react-bootstrap/Accordion';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function Home() {

    return (
        <div className="col-xxl mx-auto">
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="./images/menu/carousel1.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h5>Fahren sie gegen die besten Traktorfahrer Deutschlands</h5>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="./images/menu/carousel2.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h5>Offizielle Rangliste</h5>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="./images/menu/carousel3.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h5>Wetten sie auf ihre Favoriten</h5>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Karrieren</Accordion.Header>
                    <Accordion.Body>
                        traktorraces24 ist die groesste deutsche Traktorenrennen-Gemeinde, welche aus ueber
                        200.000 begeisterten Traktorfans besteht.<br></br>Die talentiertesten Rennfahrer unter
                        uns sind auch durch unsere Wettbewerbe zu internationalen Stars geworden! Melden auch
                        sie sich fuer eines unserer spannenden Rennen an und verpassen sie ihre Chance auf Ruhm
                        und Ehre nicht!
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Wettbewerbe</Accordion.Header>
                    <Accordion.Body>
                        Unsere Wettbewerbsangebote sind deutschlandweit verfuegbar und koennen ab 18 Jahren
                        bestritten werden. Fuer jeden Start wird eine kleine Gebuehr von $5 verlangt, welche sie
                        gleich bei der Anmeldung zahlen koennen. Preise und moegliche Karriereaussichten lassen
                        sich ganz einfach in der Wettbewerbsanmeldung einsehen.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Navbar expand="lg" variant="light" bg="light" fixed="bottom">
                <Container>
                    <Navbar.Brand href="#">traktorraces24</Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    );
}

export default Home;
