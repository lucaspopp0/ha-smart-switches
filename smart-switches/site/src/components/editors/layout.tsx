import React from 'react';
import { Config, DefaultApi, Layouts, ListExecutablesResponseBody, Switch } from '../../api';
import { AnyButton, AnyLayout, ButtonsByLayout, LayoutKey } from '../../api/convenience';
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
    if (!props.config || !props.currentSwitch || !props.currentLayout) {
        return <div style={styles.flexRow} />
    }

    const currentSwitch = props.config.switches[props.currentSwitch]
    const currentLayout = currentSwitch.layouts[props.currentLayout] as AnyLayout;

    return (
        <div style={styles.flexRow}>
          <div style={styles.flexRow} />
          <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
            {ButtonsByLayout[props.currentLayout].map(buttonName => (
              <div style={{ ...styles.flexRow, padding: 12, }}>
                {buttonName}
                <div style={styles.flexRow} />
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
