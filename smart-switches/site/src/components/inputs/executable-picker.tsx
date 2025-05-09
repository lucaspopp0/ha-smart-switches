import * as React from "react"
import { ListExecutablesResponseBody, Executable, DefaultApi } from "../../api"
import { Select, Space, Typography } from "antd"
import { monospace } from "../../styles"
import useForceRefresh from "../../hooks/useForceRefresh"

export type ExecuablePickerProps = {
    api: DefaultApi,
    value?: string
    onPick?: (executable: Executable | undefined) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    let [executables, setExecutables] = React.useState<ListExecutablesResponseBody['executables'] | undefined>(undefined)
    let [fetchingExecutables, setFetchingExecutables] = React.useState(false)
    let forceRefresh = useForceRefresh()
    
    React.useEffect(() => {
        if (fetchingExecutables) {
            return () => {}
        }


        setFetchingExecutables(true)

        props.api
            .listExecutables()
            .then(response => {
                setExecutables(response.executables)
                forceRefresh()
            })

        return () => {
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
                    ...Object.keys(executables ?? {}).map(entityId => (
                        {
                            value: entityId,
                            label: (executables ?? {})[entityId]?.friendlyName
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
