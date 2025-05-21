import React from 'react';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled } from '@ant-design/icons';
import { Button, Space, Switch, Typography } from 'antd';
import { config } from 'process';
import ExecutablePicker from '../inputs/executable-picker';
import { DefaultApi, Config, Layouts, WheelRoutine } from '../../api';
import { ButtonsByLayout, LayoutKey } from '../../api/convenience';
import { WheelRoutinesEditor } from './wheel-routines';


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

    const onUpdate = async () => {
      currentSwitch.layouts[props.currentLayout as LayoutKey] = currentLayout
      
      return props.onUpdate({
        switches: {
          ...(props.config?.switches ?? {}),
          [props.currentSwitch as string]: currentSwitch,
        }
      })
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

    const row = (key: string, title: React.ReactNode, accessory: React.ReactNode) => (
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
            {basicButtons.map(buttonName => (
              row(
                buttonName,
                <Typography.Text code>{buttonName}</Typography.Text>,
                <Space direction='horizontal'>
                <ExecutablePicker
                    value={currentLayout[buttonName as keyof typeof currentLayout]}
                    api={props.api}
                    onPick={async picked => {
                      currentLayout[buttonName as keyof typeof currentLayout] = picked?.entityId
                      return onUpdate()
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
            {hasWheelRoutines
              ? <WheelRoutinesEditor
                  api={props.api}
                  wheelRoutines={(currentLayout as { 'wheel_routines': WheelRoutine[] })['wheel_routines']}
                  onUpdate={async newRoutines => {
                    (currentLayout as { 'wheel_routines': WheelRoutine[] })['wheel_routines'] = newRoutines
                    return onUpdate()
                  }}
                />
              : <></>}
            <div style={{ display: 'flex', flexGrow: 2, }}/>
          </div>
        </div>
    )
}

export default LayoutEditor;
