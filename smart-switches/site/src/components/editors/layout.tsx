import React from 'react';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled } from '@ant-design/icons';
import { Button, Space, Switch } from 'antd';
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
  editorRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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

    const hasWheelRoutines = ButtonsByLayout[props.currentLayout].includes('wheel-routines');
    const canFlip = ButtonsByLayout[props.currentLayout].includes('flipped');

    const basicButtons = ButtonsByLayout[props.currentLayout]
      .filter(button => button != 'flipped' && button != 'wheel-routines')
      .sort((a, b): number => {
        // Handle the equal condition right away
        if (a == b) {
          return 0
        }

        let intA = parseInt(a)
        let aIsInt = !Number.isNaN(intA)

        let intB = parseInt(b)
        let bIsInt = !Number.isNaN(intB)

        // Remember, at this point elements will not be equal
        if (bIsInt && aIsInt) {
          return intA < intB ? -1 : 1
        } else if (aIsInt) {
          return 1
        } else if (bIsInt) {
          return -1
        } else {
          return a < b ? -1 : 1
        }
      })

    const row = (key: string, title: string, accessory: React.ReactNode) => (
      <div key={key} style={styles.editorRow}>
        {title}
        <div style={{ display: 'flex', height: 0, flexGrow: 2, }} />
        {accessory}
      </div>
    )

    return (
        <div style={styles.flexRow}>
          <div style={styles.flexRow} />
          <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
            {basicButtons.map(buttonName => (
              row(buttonName, buttonName, <Space direction='horizontal'>
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
                </Space>,
              )
            ))}
            {canFlip
              ? row('flipped', 'Flipped?', <Switch
                  value={canFlip ? (currentLayout as { flipped?: boolean }).flipped : false}
                  onChange={checked => {
                    if (canFlip) {
                      (currentLayout as { flipped?: boolean }).flipped = checked

                      currentSwitch.layouts[props.currentLayout as LayoutKey] = currentLayout

                      props.onUpdate({
                        switches: {
                            ...(props.config?.switches ?? {}),
                            [props.currentSwitch as string]: currentSwitch,
                        }
                      })
                    }
                  }} 
                />)
              : <></>
            }
            <div style={{ display: 'flex', flexGrow: 2, }}/>
          </div>
        </div>
    )
}

export default LayoutEditor;
