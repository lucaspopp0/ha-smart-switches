package model

type Flippable struct {
	Flipped bool `json:"flipped,omitempty"`
}

type OnOff struct {
	On
	Off
}

type EightButtons struct {
	One
	Two
	Three
	Four
	Five
	Six
	Seven
	Eight
}

type FourButtons struct {
	Five
	Six
	Seven
	Eight
}

type On struct {
	On string `json:"on,omitempty"`
}

type Off struct {
	Off string `json:"off,omitempty"`
}

type One struct {
	One string `json:"1,omitempty"`
}

type Two struct {
	Two string `json:"2,omitempty"`
}

type Three struct {
	Three string `json:"3,omitempty"`
}

type Four struct {
	Four string `json:"4,omitempty"`
}

type Five struct {
	Five string `json:"5,omitempty"`
}

type Six struct {
	Six string `json:"6,omitempty"`
}

type Seven struct {
	Seven string `json:"7,omitempty"`
}

type Eight struct {
	Eight string `json:"8,omitempty"`
}

type WheelRoutine struct {
	Name    string `json:"name"`
	RGB     []int  `json:"rgb"`
	Command string `json:"command"`
}

type WheelRoutines struct {
	WheelRoutines []WheelRoutine `json:"wheel-routines"`
}
