import * as React from "react"
import { Switch } from "../../api"
import { LayoutInstance } from "../../api/models/LayoutInstance"
import { Button, Dropdown, Space, Typography } from "antd"
import { LayoutNames, LayoutDescriptions } from "../../api/convenience"

export type LayoutPickerProps = {
    switch?: Switch,
    onPick: (key: string, layout: LayoutInstance) => Promise<void>
}

const LayoutPicker: React.FC<LayoutPickerProps> = (props) => {
    const sw = props.switch ?? { layouts: {} }

    const pickLayout = (layout: string) => {
        console.log(layout)

        if (!layout) {
            return
        }

        const newLayout: LayoutInstance = {
            version: layout,
            buttons: {},
            flipped: false,
        }

        props.onPick(layout, newLayout)
    }

    return (
        <Dropdown
            menu={{
                items: LayoutNames.map(layout => ({
                    key: layout,
                    label: (
                        <Space size='small' direction="vertical" style={{ maxWidth: 200 }}>
                            <Typography.Text
                                strong
                                disabled={!!sw.layouts[layout]}
                            >
                                {layout}
                            </Typography.Text>
                            <Typography.Text
                                disabled={!!sw.layouts[layout]}
                            >
                                {LayoutDescriptions[layout] || "No description"}
                            </Typography.Text>
                        </Space>
                    ),
                    disabled: !!sw.layouts[layout],
                })),
                onClick: (event) => {
                    pickLayout(event.key)
                }
            }}
        >
            <Button>
                Add layout
            </Button>
        </Dropdown>
    )
}

export default LayoutPicker
