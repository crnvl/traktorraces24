import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

const settings = require('../api/settings.json');

async function sendLogin() {
    const username = document.getElementById('input-username').value;
    const password = document.getElementById('input-password').value;

    if (username === '') {
        alert('Alle Felder muessen ausgefuellt sein.')
    }

    const rawResponse = await fetch(`${settings.serverDomain}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    const content = await rawResponse.json();

    if (content.success) {
        alert('Sie haben sich erfolgreich eingeloggt!')
        localStorage.clear();

        localStorage.setItem('sessionToken', content.sessionKey);
        localStorage.setItem('username', username);
        window.location.replace(`${settings.siteDomain}/`);
    } else {
        alert('Die angegebenen Daten sind inkorrekt.')
    }
}

function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className="col-lg-4 mx-auto">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nutzername</Form.Label>
                        <Form.Control type="username" placeholder="joeMama69" id="input-username"/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Passwort</Form.Label>
                        <Form.Control type="password" placeholder="Passwort" id="input-password"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={sendLogin}>
                        Login
                    </Button>
                    <p>Sie besitzen noch kein Konto? Klicken sie <a href="/register">hier</a>!</p>
                </Form>
            </div>
        </>
    )
}

export default Login;
