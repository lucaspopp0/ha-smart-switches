import React from 'react';
import { Config, DefaultApi, Layouts, ListExecutablesResponseBody, Switch } from '../../api';
import { AnyButton, AnyLayout, LayoutKey } from '../../api/convenience';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { config } from 'process';
import ExecutablePicker from '../inputs/executable-picker';


const styles: { [key: string]: React.CSSProperties } = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 2,
    margin: 0,
    padding: 0,
  },
}

export type LayoutEditorProps = {
    api: DefaultApi,
    config?: Config,
    currentSwitch?: string,
    currentLayout?: LayoutKey,
    onUpdate: (latestConfig: Config) => Promise<void>,
}

const LayoutEditor: React.FC<LayoutEditorProps> = props => {
    let [executables, setExecutables] = React.useState({} as ListExecutablesResponseBody['executables'])
    let [fetchingExecutables, setFetchingExecutables] = React.useState(false)
    
    React.useEffect(() => {
        if (fetchingExecutables) {
            return () => {}
        }

        let ignore = false
        setFetchingExecutables(true)

        props.api
            .listExecutables()
            .then(response => {
                if (!ignore) {
                    setExecutables(response.data.executables ?? {})
                }
            })

        return () => {
            ignore = true
        }
    }, [fetchingExecutables, setFetchingExecutables, executables, setExecutables])

    if (!props.config || !props.currentSwitch || !props.currentLayout) {
        return <div style={styles.content} />
    }

    const currentSwitch = props.config.switches[props.currentSwitch]
    const currentLayout = currentSwitch.layouts[props.currentLayout] as AnyLayout;
    const currentButtons = Object.keys(currentLayout) as (keyof typeof currentLayout)[]

    return (
        <div style={styles.content}>
          <div style={{ display: 'flex', flexGrow: 2, }} />
          <div style={{ ...styles.sidebar, width: 400 }}>
            {currentButtons.map(buttonName => (
              <div style={styles.sidebarItem}>
                {buttonName}
                <div style={{ display: 'flex', flexGrow: 2, }} />
                <ExecutablePicker
                  value={currentLayout[buttonName]}
                  executables={executables}
                  onPick={async picked => {
                    currentLayout[buttonName] = picked?.entityId
                    currentSwitch.layouts[props.currentLayout as LayoutKey] = currentLayout
                    
                    props.onUpdate({
                        switches: {
                            ...(props.config?.switches ?? {}),
                            [props.currentSwitch as string]: currentSwitch,
                        }
                    })
                  }}
                />
                <Button
                  icon={<CaretRightFilled />}
                  disabled={!currentLayout[buttonName]}
                  onClick={() => {
                    props.api.press({
                      switch: props.currentSwitch as string,
                      layout: props.currentLayout as string,
                      key: buttonName,
                    }).finally(console.log)
                  }}
                />
                </div>
            ))}
          </div>
        </div>
    )
}

export default LayoutEditor;
