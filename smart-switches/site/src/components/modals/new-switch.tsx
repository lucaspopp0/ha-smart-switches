import React from "react"
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { components } from "../../sdk";

export type NewSwitchModalProps = {
    show?: boolean,
    onHide?: () => void,
    onConfirm?: (remoteName: string) => void,
}

const NewSwitchModal: React.FC<NewSwitchModalProps> = (props) => {
    const [name, setName] = React.useState('')
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="Remote Name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewSwitchModal;
