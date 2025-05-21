import React, { useState } from 'react';
import ConfirmModal from '../modals/confirm';
import { CaretRightFilled, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Switch, List, Input, Card, ColorPicker, Typography, Divider, message, ColorPickerProps } from 'antd';
import ExecutablePicker from '../inputs/executable-picker';
import { DefaultApi, Config, Layouts, Executable } from '../../api';
import { ButtonsByLayout, LayoutKey } from '../../api/convenience';
import { WheelRoutine } from '../../api';
import { AggregationColor } from 'antd/es/color-picker/color';

const { Text, Title } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  routineRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  formItem: {
    marginBottom: 16,
  },
  addRoutineForm: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addRoutineButton: {
    width: '100%',
  },
}

export type WheelRoutinesEditorProps = {
    wheelRoutines?: WheelRoutine[],
    onUpdate: (newRoutines: WheelRoutine[]) => Promise<void>,
    api: DefaultApi,
}

export const WheelRoutinesEditor: React.FC<WheelRoutinesEditorProps> = props => {
    const { wheelRoutines, onUpdate, api } = props;

    const [addingNewRoutine, setAddingNewRoutine] = useState(false)
    
    // State for new routine
    const [newRoutine, setNewRoutine] = useState<Partial<WheelRoutine>>({
        name: '',
        command: '',
        rgb: [255, 0, 0] // Default red color
    });
    
    // State for showing confirm delete modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [routineToDelete, setRoutineToDelete] = useState<number>(-1);
    
    // For color picker
    const handleColorChange: ColorPickerProps['onChange'] = color => {
        const { r, g, b } = color.toRgb();
        setNewRoutine({
            ...newRoutine,
            rgb: [r, g, b]
        });
    };

    // For name input
    const handleNameChange = (value: string) => {
        setNewRoutine({
            ...newRoutine,
            name: value
        });
    };

    // For executable picker
    const handleExecutableChange = async (executable: Executable | undefined) => {
        setNewRoutine({
            ...newRoutine,
            command: executable?.entityId || ''
        });
    };

    // For adding new routine
    const handleAddRoutine = async () => {
        // Validation
        if (!newRoutine.name || !newRoutine.command) {
            message.error('Name and command are required');
            return;
        }

        const addedRoutine: WheelRoutine = {
            name: newRoutine.name,
            command: newRoutine.command,
            rgb: newRoutine.rgb || [255, 0, 0]
        };

        // Add to list and notify parent
        const updatedRoutines = [...(wheelRoutines ?? []), addedRoutine];
        
        try {
            await onUpdate(updatedRoutines);
            
            // Reset form
            setNewRoutine({
                name: '',
                command: '',
                rgb: [255, 0, 0]
            });
            
            message.success('Routine added');
        } catch (e) {
            message.error(e as string);
        }
    };

    // For deleting routine
    const handleDeleteClick = (index: number) => {
        setRoutineToDelete(index);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (routineToDelete >= 0) {
            const updatedRoutines = [...(wheelRoutines ?? [])];
            updatedRoutines.splice(routineToDelete, 1);
            
            try {
                await onUpdate(updatedRoutines);
                message.success('Routine deleted');
            } catch(e) {
                message.error(e as string);
            }
        }
        setShowDeleteConfirm(false);
    };

    const rgb2color = (rgb: number[] | null): string => {
        if (!rgb || rgb.length < 3) return 'rgb(255, 0, 0)';
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };
    
    const row = (key: string, title: React.ReactNode, accessory: React.ReactNode) => (
      <div key={key} style={styles.routineRow}>
        {title}
        <div style={{ display: 'flex', height: 0, flexGrow: 2, }} />
        {accessory}
      </div>
    )

    return (
        <div style={styles.container}>
            <Typography.Text
                type="secondary"
                style={{ textTransform: 'uppercase', paddingLeft: 12, paddingTop: 12, }}
                strong
            >
                Wheel Options
            </Typography.Text>
            {(wheelRoutines ?? []).map((routine, i) => (
                row(
                    "" + i,
                    <Space direction='horizontal'>
                        <ColorPicker
                                defaultValue={rgb2color(routine.rgb)}
                                disabled
                            />
                        <Typography.Text>{routine.name}</Typography.Text>
                    </Space>,
                    <Space direction="horizontal">
                        <ExecutablePicker
                            api={api}
                            value={routine.command}
                            onPick={async picked => {
                                if (wheelRoutines) {
                                    wheelRoutines[i].command = picked?.entityId ?? ''
                                    await onUpdate(wheelRoutines)
                                }
                            }}
                        />
                        <Button 
                                icon={<DeleteOutlined />} 
                                danger 
                                onClick={() => handleDeleteClick(i)}
                            />
                    </Space>)
            ))}
            {row(
                "new",
                addingNewRoutine
                    ? <Space direction='vertical' style={{ display: 'flex', width: '100%' }}>
                        <Space direction='horizontal' style={{ display: 'flex', width: '100%' }}>
                            <ColorPicker
                                defaultValue={rgb2color(newRoutine.rgb as number[] | null)}
                                onChange={handleColorChange}
                            />
                            <Input 
                                placeholder="Routine Name" 
                                value={newRoutine.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                            <div style={{ display: 'flex', flexGrow: 2 }} />
                            <ExecutablePicker
                                api={api}
                                value={newRoutine.command}
                                onPick={handleExecutableChange}
                            />
                        </Space>
                        <Space
                            direction='horizontal'
                            style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
                        >
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                style={styles.addRoutineButton}
                                onClick={handleAddRoutine}
                            >
                                Add Routine
                            </Button>
                            <Button 
                                onClick={() => {
                                    setAddingNewRoutine(false)
                                    setNewRoutine({})
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Space>
                    : <Button onClick={() => setAddingNewRoutine(true)}>Add option</Button>,
                <></>,
            )
            }

            <ConfirmModal
                title={`You are about to delete "${(wheelRoutines ?? []).length && routineToDelete >= 0 ? (wheelRoutines ?? [])[routineToDelete].name : ""}"`}
                body="Are you sure you want to delete this routine?"
                open={showDeleteConfirm}
                onOk={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};
