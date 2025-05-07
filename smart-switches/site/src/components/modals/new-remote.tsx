import React from "react"
import { Button, InputGroup, Modal } from "react-bootstrap";
import { components } from "../../sdk";

export type NewRemoteModalProps = {
    show?: boolean,
    onHide?: () => void,
    onConfirm?: (remoteName: string) => void,
}

const NewRemoteModal: React.FC<NewRemoteModalProps> = (props) => {
    console.log(props.show)
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <InputGroup.Text>
                        Remote Name
                    </InputGroup.Text>
                </InputGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewRemoteModal;
