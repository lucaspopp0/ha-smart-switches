import React from 'react';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { config } from 'process';
import ExecutablePicker from '../inputs/executable-picker';
import { DefaultApi, Config, Layouts } from '../../api';
import { ButtonsByLayout, LayoutKey } from '../../api/convenience';


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
    currentLayout?: keyof Layouts,
    onUpdate: (latestConfig: Config) => Promise<void>,
}

const LayoutEditor: React.FC<LayoutEditorProps> = props => {
    if (!props.config || !props.currentSwitch || !props.currentLayout) {
        return <div style={styles.flexRow} />
    }

    const currentSwitch = props.config.switches[props.currentSwitch]
    const currentLayout = currentSwitch.layouts[props.currentLayout];

    if (currentSwitch == undefined || currentLayout == undefined) {
        return <div style={styles.flexRow} />
    }

    return (
        <div style={styles.flexRow}>
          <div style={styles.flexRow} />
          <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
            {ButtonsByLayout[props.currentLayout].map(buttonName => (
              <div key={buttonName} style={{ display: 'flex', padding: 12, }}>
                {buttonName}
                <div style={{ display: 'flex', height: 0, flexGrow: 2, }} />
                <ExecutablePicker
                  value={currentLayout[buttonName as keyof typeof currentLayout]}
                  api={props.api}
                  onPick={async picked => {
                    currentLayout[buttonName as keyof typeof currentLayout] = picked?.entityId
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
                  disabled={!currentLayout[buttonName as keyof typeof currentLayout]}
                  onClick={() => {
                    props.api
                      .press({
                        _switch: props.currentSwitch as string,
                        layout: props.currentLayout as string,
                        key: buttonName,
                      })
                      .catch(err => {
                        console.error(err)
                      })
                  }}
                />
                </div>
            ))}
            <div style={{ display: 'flex', flexGrow: 2, }}/>
          </div>
        </div>
    )
}

export default LayoutEditor;
