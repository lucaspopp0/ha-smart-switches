import * as React from "react"
import { Layouts, LayoutV4, LayoutV5, LayoutV6, LayoutV7, Switch } from "../../api"
import { Button, Dropdown, Space } from "antd"
import { LayoutNames } from "../../api/convenience"

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

    return (
        <Dropdown
            menu={{
                items: LayoutNames.map(layout => ({
                    key: layout,
                    label: layout,
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
