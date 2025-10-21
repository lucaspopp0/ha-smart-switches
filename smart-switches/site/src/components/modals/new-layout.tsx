import React from "react"
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Switch } from "../../api";

export type NewLayoutModalProps = {
    show?: boolean,
    onHide?: () => void,
    switch?: Switch,
}

const NewLayoutModal: React.FC<NewLayoutModalProps> = (props) => {
    const layouts = ['v4', 'v5', 'v6', 'v7', 'v9'];

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown>
                    <Dropdown.Toggle>
                        Layout Version
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {layouts.map(layout => (
                            props.switch
                            ? (layout in props.switch.layouts
                                ? <Dropdown.Item key={layout} disabled>{layout} (already configured)</Dropdown.Item>
                                : <Dropdown.Item key={layout}>{layout}</Dropdown.Item>)
                            : ''
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewLayoutModal;
