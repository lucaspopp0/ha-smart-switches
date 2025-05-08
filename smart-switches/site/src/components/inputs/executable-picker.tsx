import * as React from "react"
import { ListExecutablesResponseBody, Executable } from "../../api"
import { Form, InputGroup } from "react-bootstrap"

export type ExecuablePickerProps = {
    executables?: ListExecutablesResponseBody['executables'],
    onPick?: (executable: Executable) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    let [textInput, setTextInput] = React.useState('')
    let [focused, setFocused] = React.useState(false)
    let [textFocused, setTextFocused] = React.useState(false)

    const executables = props.executables
        ?  Object.entries(props.executables).map(([_, executable]) => (
            <option key={executable.entityId}>{executable.friendlyName}</option>
        ))
        : <></>

    return (
        <select onChange={event => {
            setTextInput(event.target.value)
        }}>
            {executables}
        </select>
    )
}

export default ExecutablePicker
