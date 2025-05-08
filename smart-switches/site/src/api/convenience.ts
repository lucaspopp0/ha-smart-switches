import { Layouts, LayoutV4, LayoutV5, LayoutV6, LayoutV7 } from "./api";

type ButtonsOf<K extends Layouts[keyof Layouts]> = Record<keyof K, true>

const v4: ButtonsOf<LayoutV4> = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    off: true,
    on: true
}

const v5: ButtonsOf<LayoutV5> = {
    5: true,
    6: true,
    7: true,
    8: true,
    off: true,
    on: true,
    flipped: true,
    "wheel-routines": true
}

const v6: ButtonsOf<LayoutV6> = {
    5: true,
    6: true,
    7: true,
    8: true,
    off: true,
    on: true,
    flipped: true,
    "wheel-routines": true
}

const v7: ButtonsOf<LayoutV7> = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    off: true,
    on: true,
    flipped: true
}

const buttonsByLayout: Record<keyof Layouts, string[]> = {
    v4: Object.keys(v4),
    v5: Object.keys(v5),
    v6: Object.keys(v6),
    v7: Object.keys(v7)
}

export type LayoutKey = keyof Layouts;

export type AnyLayout = LayoutV4 | LayoutV5 | LayoutV6 | LayoutV7;
export type AnyButton = keyof (LayoutV4 & LayoutV5 & LayoutV6 & LayoutV7)

export const LayoutNames = Object.keys(buttonsByLayout)

export const ButtonsByLayout = buttonsByLayout;
