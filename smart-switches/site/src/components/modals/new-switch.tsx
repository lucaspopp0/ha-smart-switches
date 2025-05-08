import React from "react"
import { Button, Form, InputGroup, Modal, Toast } from "react-bootstrap";
import { Config } from "../../api";

export type NewSwitchModalProps = {
    show?: boolean,
    onShow?: () => void,
    onHide?: () => void,
    onConfirm?: (remoteName: string) => Promise<Config>,
}

const NewSwitchModal: React.FC<NewSwitchModalProps> = (props) => {
    const [name, setName] = React.useState("")
    const [err, setError] = React.useState<any | undefined>(undefined)
    const [showErrorToast, setShowErrorToast] = React.useState(false)

    const onShow = props.onShow ?? (() => {})
    const onHide = props.onHide ?? (() => {})
    const onConfirm = () => {
        let f = props.onConfirm ?? (async (_: string) => {})

        f(name)
            .then(() => {
                onHide()
            })
            .catch(error => {
                setError(error)
                setShowErrorToast(true)
            })
    }

    return (
        <>
            <Modal
                show={props.show}
                onShow={onShow}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Layout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label htmlFor="nameInput">Name</Form.Label>
                    <Form.Control
                        type="text"
                        id="nameInput"
                        autoComplete="off"
                        placeholder="Switch Name"
                        value={name}
                        onChange={element => {
                            setName(element.target.value)
                        }}
                        onKeyDownCapture={event => {
                            if (event.code == "Enter") {
                                onConfirm()
                            }
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
                            onConfirm()
                        }}
                    >Save changes</Button>
                </Modal.Footer>
            </Modal>
            <Toast show={showErrorToast} onClose={() => {
                setShowErrorToast(false)
            }}>
                <Toast.Header>
                    <strong className="me-auto">Failed to add switch</strong>
                </Toast.Header>
                <Toast.Body>{String(err)}</Toast.Body>
            </Toast>
        </>
    )
}

export default NewSwitchModal;
