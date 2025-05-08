import * as React from "react"
import { ListExecutablesResponseBody, Executable } from "../../api"
import { Form, InputGroup } from "react-bootstrap"
import { Select, Space, Typography } from "antd"
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
            placeholder="none"
            value={props.value}
            optionFilterProp="label"
            popupMatchSelectWidth={false}
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
                    },
                    {
                        value: undefined,
                        label: '--',
                        disabled: true,
                    },
                    ...Object.entries(props.executables ?? {}).map(([entityId, { friendlyName }]) => (
                        {
                            value: entityId,
                            label: friendlyName,
                        }
                    )),
                ]
            }
            optionRender={option => (
                option.value ? 
                    <Space direction="vertical">
                        <Typography.Text italic type="secondary">{option.value}</Typography.Text>
                        <Typography.Text>{option.label}</Typography.Text>
                    </Space> :
                    option.label
            )}
        />
    )
}

export default ExecutablePicker
