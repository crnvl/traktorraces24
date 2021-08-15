import Header from "../components/navbar";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
const settings = require('../api/settings.json');

function saveSettings() {
    const description = document.getElementById('input-description').value;
    const avatar = document.getElementById('input-url').value;
    const sessionToken = localStorage.getItem('sessionToken');

    (async () => {
        const rawResponse = await fetch(`${settings.serverDomain}/@me/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sessionToken": sessionToken,
                "description": description,
                "avatarUrl": avatar
            })
        });
        const content = await rawResponse.json();

        if (content.success) {
            alert('Einstellungen erfolgreich gespeichert!')
            localStorage.removeItem('credits');
            window.location.replace(`${settings.siteDomain}/account/settings`);
        } else {
            alert('Oops, irgendetwas ist schiefgelaufen.')
        }
    })();
}

function addCredits() {
    const balance = document.getElementById('input-credits').value;
    const sessionToken = localStorage.getItem('sessionToken');

    const isValid = /^\d+$/.test(balance);
    if (!isValid) {
        alert('Guthaben darf nur Zahlen enthalten');
        return;
    }

    (async () => {
        const rawResponse = await fetch(`${settings.serverDomain}/@me/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sessionToken": sessionToken,
                "balance": balance
            })
        });
        const content = await rawResponse.json();

        if (content.success) {
            alert('Credits hinzugefuegt!')
            localStorage.removeItem('credits');
            window.location.replace(`${settings.siteDomain}/account/settings`);
        } else {
            alert('Oops, irgendetwas ist schiefgelaufen.')
        }
    })();
}

function Settings() {
    const username = localStorage.getItem('username') || '';

    const [content, setContent] = useState(undefined);

    const serverDomain = settings.serverDomain;
    const serverPort = settings.serverPort;
    const sessionToken = localStorage.getItem('sessionToken');

    useEffect(() => {
        async function fetchSettings() {
            const response = await fetch(`${serverDomain}/@me/settings?sessionToken=${sessionToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const fetchedSettings = await response.json(response);
            setContent(fetchedSettings);
        }
        fetchSettings();
    }, [serverDomain, serverPort, sessionToken])

    return (
        <>
            <Header username={username}></Header>
            <div className="container">
                <div className="col-lg-4 mx-auto">
                    <Form.Label htmlFor="basic-url"><h1><b>Einstellungen</b></h1></Form.Label>
                    <NavDropdown.Divider />
                    <Form.Label htmlFor="basic-url">Dein Nutzername</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Nutzername"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue={content ? content.details.username : ''}
                            disabled
                        />
                    </InputGroup>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Profil-Beschreibung</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Deine Profil-Beschreibung" id="input-description" defaultValue={content ? content.details.description : ''}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Profilbild URL</Form.Label>
                        <Form.Control rows={1} placeholder="https://example.com/picture.png" id="input-url" defaultValue={content ? content.details.url : ''}></Form.Control>
                    </Form.Group>
                    <Button variant="dark" onClick={saveSettings}>Speichern</Button>
                    <NavDropdown.Divider />
                    <Form.Label><h3><b>Guthaben</b></h3></Form.Label>
                    <InputGroup.Text>Aktuell: ${content ? content.details.balance : ''}</InputGroup.Text>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>$</InputGroup.Text>
                        <FormControl aria-label="Dollar amount (with dot and two decimal places)" id="input-credits" />
                        <Button variant="dark" onClick={addCredits}>Aufladen</Button>
                    </InputGroup>
                </div>
            </div>
        </>
    )
}

export default Settings;