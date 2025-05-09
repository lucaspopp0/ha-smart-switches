import { Layouts } from "./models/Layouts"
import { LayoutV4 } from "./models/LayoutV4"
import { LayoutV5 } from "./models/LayoutV5"
import { LayoutV6 } from "./models/LayoutV6"
import { LayoutV7 } from "./models/LayoutV7"

export type LayoutKey = keyof Layouts;

export const ButtonsByLayout: Record<keyof Layouts, string[]> = {
    v4: LayoutV4.attributeTypeMap.map(attr => attr.baseName),
    v5: LayoutV5.attributeTypeMap.map(attr => attr.baseName),
    v6: LayoutV6.attributeTypeMap.map(attr => attr.baseName),
    v7: LayoutV7.attributeTypeMap.map(attr => attr.baseName),
}


export type AnyLayout = LayoutV4 | LayoutV5 | LayoutV6 | LayoutV7;
export type AnyButton = keyof (LayoutV4 & LayoutV5 & LayoutV6 & LayoutV7)

export const LayoutNames = Object.keys(ButtonsByLayout)
