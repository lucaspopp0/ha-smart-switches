import * as React from "react"
import { ListExecutablesResponseBody, Executable } from "../../api"
import { Form, InputGroup } from "react-bootstrap"
import { Select } from "antd"
import { late } from "zod"

export type ExecuablePickerProps = {
    executables?: ListExecutablesResponseBody['executables'],
    value?: string
    onPick?: (executable: Executable | undefined) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    return (
        <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            onChange={value => {
                console.log('executable picker changed to:', value)

                if (props.onPick && props.executables){
                    if (value) {
                        props.onPick(props.executables[value])
                    } else {
                        props.onPick(undefined)
                    }
                }
            }}
            options={
                [
                    {
                        value: undefined,
                        label: 'none',
                        disabled: true,
                    },
                    {
                        value: undefined,
                        label: '--',
                        disabled: true,
                    },
                    ...Object.entries(props.executables ?? {}).map(([entityID, { friendlyName }]) => (
                        {
                            value: entityID,
                            label: friendlyName,
                        }
                    )),
                ]
            }
        />
    )
}

export default ExecutablePicker
