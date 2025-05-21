import { Modal, ModalProps } from "antd"
import React from "react"

export type ConfirmProps = {
    body: React.ReactNode,
    title: string,
    open: boolean,
    onOk: () => Promise<void>,
    onCancel: () => void,
    okButtonProps?: ModalProps['okButtonProps']
}

const ConfirmModal: React.FC<ConfirmProps> = props => {
    const [loading, setLoading] = React.useState(false)
    const [failed, setFailed] = React.useState(false)

    if (!props.open && loading) {
        setLoading(false)
    }

    if (!props.open && failed) {
        setFailed(false)
    }

    const onOk = async () => {
        setLoading(true)
        setFailed(false)
        
        try {
            await props.onOk()
        } catch(e) {
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title={props.title}
            open={props.open}
            onOk={onOk}
            confirmLoading={loading}
            onCancel={props.onCancel}
            okButtonProps={props.okButtonProps}
        >
            {props.body}
        </Modal>
    )
}

export default ConfirmModal;
