import React from 'react';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled } from '@ant-design/icons';
import { Button, Space, Switch, Typography, ColorPicker, Select } from 'antd';
import { config } from 'process';
import ExecutablePicker from '../inputs/executable-picker';
import { DefaultApi, Config } from '../../api';
import { ButtonsByLayout } from '../../api/convenience';


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
    currentLayout?: string,
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

    const onUpdate = async () => {
      if (!props.currentLayout) return

      currentSwitch.layouts[props.currentLayout] = currentLayout

      return props.onUpdate({
        switches: {
          ...(props.config?.switches ?? {}),
          [props.currentSwitch as string]: currentSwitch,
        }
      })
    }

    const canFlip = ButtonsByLayout[props.currentLayout].includes('flipped');

    const basicButtons = ButtonsByLayout[props.currentLayout]
      .filter(button => button != 'flipped')
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
            {canFlip
              ? <>
                <Typography.Text
                    type="secondary"
                    style={{ textTransform: 'uppercase', paddingLeft: 12, paddingTop: 12, }}
                    strong
                >Layout</Typography.Text>
              {
                row('flipped', 'Flipped?', <Switch
                  value={canFlip ? (currentLayout as { flipped?: boolean }).flipped : false}
                  onChange={checked => {
                    if (canFlip) {
                      (currentLayout as { flipped?: boolean }).flipped = checked
                      return onUpdate()
                    }
                  }} 
                />
              )}</>
              : <></>
            }
            <Typography.Text
                type="secondary"
                style={{ textTransform: 'uppercase', paddingLeft: 12, paddingTop: 12, }}
                strong
            >
                Basic Buttons
            </Typography.Text>
            {
              basicButtons
                .map(buttonName => {
                  const command = currentLayout.buttons[buttonName]
                  if (!command) return <></>

                  const r = Math.round(command.color?.[0] ?? 50)
                  const g = Math.round(command.color?.[1] ?? 100)
                  const b = Math.round(command.color?.[2] ?? 255)

                  return row(buttonName, buttonName, <Space direction='horizontal'>
                    <ColorPicker
                      value={`rgb(${r},${g},${b})`}
                      onChange={color => {
                        const { r, g, b } = color.toRgb()
                        command.color = [r, g, b]
                        currentLayout.buttons[buttonName] = command

                        return onUpdate()
                      }}
                    />
                    <ExecutablePicker
                        value={currentLayout.buttons[buttonName]?.cmd}
                        api={props.api}
                        onPick={async picked => {
                          let currentButton = currentLayout.buttons[buttonName]

                          if (currentButton && picked) {
                            currentButton.cmd = picked.entityId
                            currentLayout.buttons[buttonName] = currentButton
                          }

                          return onUpdate()
                        }}
                      />
                      <Button
                        icon={<CaretRightFilled />}
                        disabled={!currentLayout.buttons[buttonName]}
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
                })
            }
            {
              // Add button dropdown for unconfigured buttons
              (() => {
                const unconfiguredButtons = basicButtons.filter(btn => !currentLayout.buttons[btn])

                if (unconfiguredButtons.length > 0) {
                  return (
                    <div style={{ ...styles.editorRow, justifyContent: 'flex-start' }}>
                      <Select
                        placeholder="Add button"
                        style={{ width: 150 }}
                        value={null}
                        onChange={async (value) => {
                          if (value) {
                            // Initialize the button with default values
                            console.log('Adding button:', value)
                            currentLayout.buttons[value] = {
                              cmd: '',
                              color: [0, 0, 255]
                            }
                            console.log('Button added to layout, calling onUpdate')
                            await onUpdate()
                            console.log('onUpdate completed')
                          }
                        }}
                        options={unconfiguredButtons.map(btn => ({
                          value: btn,
                          label: btn
                        }))}
                      />
                    </div>
                  )
                }
                return <></>
              })()
            }
            <div style={{ display: 'flex', flexGrow: 2, }}/>
          </div>
        </div>
    )
}

export default LayoutEditor;
