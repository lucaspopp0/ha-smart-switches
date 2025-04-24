package model

type Layouts struct {
	V4 *LayoutV4 `json:"v4,omitempty"`
	V5 *LayoutV5 `json:"v5,omitempty"`
	V6 *LayoutV6 `json:"v6,omitempty"`
	V7 *LayoutV7 `json:"v7,omitempty"`
}

type LayoutV4 struct {
	OnOff
	EightButtons
}

type LayoutV5 = LayoutV6

type LayoutV6 struct {
	OnOff
	FourButtons
	WheelRoutines
	Flippable
}

type LayoutV7 struct {
	OnOff
	EightButtons
	Flippable
}
