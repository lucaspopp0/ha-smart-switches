import * as React from "react"
import { Layouts, LayoutV4, LayoutV5, LayoutV6, LayoutV7, Switch } from "../../api"
import { Button, Dropdown, Space, Typography } from "antd"
import { LayoutKey, LayoutNames } from "../../api/convenience"

type AnyLayout = Layouts[keyof Layouts]

export type LayoutPickerProps = {
    switch?: Switch,
    onPick: (key: keyof Layouts, layout: AnyLayout) => Promise<void>
}

const LayoutPicker: React.FC<LayoutPickerProps> = (props) => {
    const sw = props.switch ?? { layouts: {} }

    const pickLayout = (layout: keyof Layouts) => {
        console.log(layout)

        if (!layout) {
            return
        }

        const key = layout as keyof Layouts

        props.onPick(key, {} as AnyLayout)
    }

    const layoutDescriptions: Record<LayoutKey, string> = {
        v4: "Green circuit board, eight buttons + on/off",
        v5: "White circuit board, wheel, no switch to enable/disable",
        v6: "White circuit board, wheel, + switch to enable/disable",
        v7: "First fully enclosed case",
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
                                disabled={!!sw.layouts[layout as keyof Layouts]}
                            >
                                {layout}
                            </Typography.Text>
                            <Typography.Text
                                disabled={!!sw.layouts[layout as keyof Layouts]}
                            >
                                {layoutDescriptions[layout as LayoutKey]}
                            </Typography.Text>
                        </Space>
                    ),
                    disabled: !!sw.layouts[layout as keyof Layouts],
                })),
                onClick: (event) => {
                    pickLayout(event.key as keyof Layouts)
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
