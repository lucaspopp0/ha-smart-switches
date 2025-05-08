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

    const newLayout = (layout: keyof Layouts): AnyLayout => {
        switch (layout) {
            case "v4":
                return {} as LayoutV4
            case "v5":
                return {} as LayoutV5
            case "v6":
                return {} as LayoutV6
            case "v7":
                return {} as LayoutV7
        }
    }

    return (
        <Dropdown
            onSelect={(layout) => {
                if (layout == null) {
                    return
                }

                const key = layout as keyof Layouts

                props.onPick(key, newLayout(key))
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
