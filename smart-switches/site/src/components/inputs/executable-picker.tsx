import * as React from "react"
import { ListExecutablesResponseBody, Executable } from "../../api"
import { Form, InputGroup } from "react-bootstrap"

export type ExecuablePickerProps = {
    executables?: ListExecutablesResponseBody['executables'],
    value?: string
    onPick?: (executable: Executable | undefined) => Promise<void>
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
        <select
            value={props.value ?? "none"}
        onChange={event => {
                if (props.onPick && props.executables){
                    if (event.target.value == "none") {
                        props.onPick(undefined)
                    } else {
                        props.onPick(props.executables[event.target.value])
                    }
                }
            }}
        >
            <option key="none">none</option>
            <option disabled key="--">----</option>
            {executables}
        </select>
    )
}

export default ExecutablePicker
