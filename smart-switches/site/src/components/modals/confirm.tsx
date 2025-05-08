import { Modal } from "antd"
import React from "react"

export type ConfirmProps = {
    body: React.ReactNode,
    title: string,
    open: boolean,
    onOk: () => Promise<void>,
    onCancel: () => void,
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
            title="Title"
            open={props.open}
            onOk={onOk}
            confirmLoading={loading}
            onCancel={props.onCancel}
        >
            {props.body}
        </Modal>
    )
}

export default ConfirmModal;
