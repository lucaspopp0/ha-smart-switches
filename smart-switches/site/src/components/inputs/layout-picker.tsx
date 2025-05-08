import * as React from "react"
import { Layouts, LayoutV4, LayoutV5, LayoutV6, LayoutV7, Switch } from "../../api"
import { Dropdown } from "react-bootstrap"

type AnyLayout = Layouts[keyof Layouts]

export type LayoutPickerProps = {
    switch?: Switch,
    onPick: (key: keyof Layouts, layout: AnyLayout) => Promise<void>
}

const allLayouts = ['v4', 'v5', 'v6', 'v7']

const LayoutPicker: React.FC<LayoutPickerProps> = (props) => {
    const sw = props.switch ?? { layouts: {} }

    return (
        <Dropdown
            onSelect={(layout) => {
                if (layout == null) {
                    return
                }

                const key = layout as keyof Layouts

                props.onPick(key, {} as AnyLayout)
            }}
        >
            <Dropdown.Toggle>
                Add layout...
            </Dropdown.Toggle>

            <Dropdown.Menu>
                { allLayouts.map(layout => (layout in sw.layouts
                        ? <Dropdown.Item key={layout} disabled>{layout} (already configured)</Dropdown.Item>
                        : <Dropdown.Item key={layout}>{layout}</Dropdown.Item>))
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default LayoutPicker
