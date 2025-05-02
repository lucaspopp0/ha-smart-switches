import React from "react"
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { components } from "../../sdk";

export type NewSwitchModalProps = {
    show?: boolean,
    onShow?: () => void,
    onHide?: () => void,
    onConfirm?: (remoteName: string) => void,
}

const NewSwitchModal: React.FC<NewSwitchModalProps> = (props) => {
    const [name, setName] = React.useState("")

    const onShow = props.onShow ?? (() => {})
    const onHide = props.onHide ?? (() => {})
    const onConfirm = props.onConfirm ?? (() => {})

    return (
        <Modal
            show={props.show}
            onShow={onShow}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="nameInput">Switch Name</Form.Label>
                <Form.Control
                    type="text"
                    autoComplete="off"
                    id="nameInput"
                    value={name}
                    onChange={element => {
                        setName(element.target.value)
                    }}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    if (props.onHide) {
                        props.onHide()
                    }
                }}>Cancel</Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        onConfirm(name)
                    }}
                >Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewSwitchModal;
