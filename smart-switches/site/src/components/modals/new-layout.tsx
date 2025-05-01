import React from "react"
import { Button, Modal } from "react-bootstrap";

export type NewLayoutModalProps = {
    show?: boolean,
    onHide?: () => void,
}

const NewLayoutModal: React.FC<NewLayoutModalProps> = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Add Layout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}

export default NewLayoutModal;
