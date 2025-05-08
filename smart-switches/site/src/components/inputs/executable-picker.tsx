import * as React from "react"
import { ListExecutablesResponseBody, Executable, DefaultApi } from "../../api"
import { Form, InputGroup } from "react-bootstrap"
import { Select, Space, Typography } from "antd"
import { late } from "zod"
import { monospace } from "../../styles"
import { exec } from "child_process"

export type ExecuablePickerProps = {
    api: DefaultApi,
    value?: string
    onPick?: (executable: Executable | undefined) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    let [executables, setExecutables] = React.useState<ListExecutablesResponseBody['executables'] | undefined>(undefined)
    let [fetchingExecutables, setFetchingExecutables] = React.useState(false)

    console.log('executables: ', executables)
    
    React.useEffect(() => {
        if (fetchingExecutables) {
            return () => {}
        }

        let ignore = false
        setFetchingExecutables(true)

        props.api
            .listExecutables()
            .then(response => {
                if (ignore) {
                return
                }

                setExecutables(response.data.executables)
            })

        return () => {
            ignore = true
        }
    }, [fetchingExecutables, setFetchingExecutables, executables, setExecutables])

    return (
        <Select
            showSearch
            placeholder="none"
            value={props.value}
            optionFilterProp="label"
            popupMatchSelectWidth={false}
            onChange={value => {
                console.log('executable picker changed to:', value)

                if (props.onPick && executables){
                    if (value) {
                        props.onPick(executables[value])
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
                    ...Object.entries(executables ?? {}).map(([entityId, { friendlyName }]) => (
                        {
                            value: entityId,
                        }
                    )),
                ]
            }
            optionRender={option => (
                executables && option.value ? 
                    <Space direction="vertical">
                        <Typography.Text italic type="secondary" style={monospace}>{executables[option.value].entityId}</Typography.Text>
                        <Typography.Text>{executables[option.value].friendlyName}</Typography.Text>
                    </Space> :
                    option.label
            )}
        />
    )
}

export default ExecutablePicker
