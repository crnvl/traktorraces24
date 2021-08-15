import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header(props) {

    const doLogout = props.location;
    let username = props.username;

    if (doLogout === '?do=logout') {
        localStorage.clear();
        username = '';
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">traktorraces24</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/" disabled>Rangliste</Nav.Link>
                        <NavDropdown title={username || "Gast"} id="basic-nav-dropdown">
                            {username && <>
                                <NavDropdown.Item
                                    href={`/user/` + localStorage.getItem('username')}>Profil</NavDropdown.Item>
                                <NavDropdown.Item href="/account/settings">Einstellungen</NavDropdown.Item>
                                <NavDropdown.Item href="/races">Wettbewerbe ansehen</NavDropdown.Item>
                                <NavDropdown.Divider/>
                            </>}
                            <NavDropdown.Item href={username ? "/?do=logout" : "/login"}>{username ? "Ausloggen" : "Einloggen"}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
