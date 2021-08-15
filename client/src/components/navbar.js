import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header(props) {

    const doLogout = props.location;
    let username = props.username;

    let accountPrompt = "Ausloggen";
    let accountHref = "/?do=logout";
    let accountOptions = []

    if(doLogout === '?do=logout') {
        localStorage.clear();
        username = '';
    }

    if (username === '') {
        username = "Gast";
        accountPrompt = "Einloggen";
        accountHref = "/login"
    } else {
        accountOptions.push(<><NavDropdown.Item href={`/user/` + localStorage.getItem('username')}>Profil</NavDropdown.Item>
            <NavDropdown.Item href="/account/settings">Einstellungen</NavDropdown.Item>
            <NavDropdown.Item href="/races">Wettbewerbe ansehen</NavDropdown.Item>
            <NavDropdown.Divider /></>)
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">traktorraces24</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/" disabled>Rangliste</Nav.Link>
                        <NavDropdown title={username} id="basic-nav-dropdown">
                            {accountOptions}
                            <NavDropdown.Item href={accountHref}>{accountPrompt}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;