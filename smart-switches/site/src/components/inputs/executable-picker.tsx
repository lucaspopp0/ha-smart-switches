import * as React from "react"
import { ListExecutablesResponseBody, Executable } from "../../api"
import { Form, InputGroup } from "react-bootstrap"

export type ExecuablePickerProps = {
    executables?: ListExecutablesResponseBody['Executables'],
    onPick?: (executable: Executable) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    let [textInput, setTextInput] = React.useState('')
    let [focused, setFocused] = React.useState(false)
    let [textFocused, setTextFocused] = React.useState(false)

    const executables = props.executables
        ?  Object.entries(props.executables).map(([_, executable]) => (
            <p>{executable.friendlyName}</p>
        ))
        : <></>

    return (
        <InputGroup>
            <Form.Control
                type="text"
                value={textInput}
                onFocus={(event) => {
                    console.log(event)
                }}
                onChange={event => {
                    setTextInput(event.target.value)
                }}
            />
            <div>
                {executables}
            </div>
        </InputGroup>
    )
}

export default ExecutablePicker
