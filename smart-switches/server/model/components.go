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
	On Command `json:"on,omitempty"`
}

func (c On) MatchesKey(key string) (Command, bool) {
	if key == "on" {
		return c.On, true
	}

	return Command{}, false
}

type Off struct {
	Off Command `json:"off,omitempty"`
}

func (c Off) MatchesKey(key string) (Command, bool) {
	if key == "off" {
		return c.Off, true
	}

	return Command{}, false
}

type One struct {
	One Command `json:"1,omitempty"`
}

func (c One) MatchesKey(key string) (Command, bool) {
	if key == "1" {
		return c.One, true
	}

	return Command{}, false
}

type Two struct {
	Two Command `json:"2,omitempty"`
}

func (c Two) MatchesKey(key string) (Command, bool) {
	if key == "2" {
		return c.Two, true
	}

	return Command{}, false
}

type Three struct {
	Three Command `json:"3,omitempty"`
}

func (c Three) MatchesKey(key string) (Command, bool) {
	if key == "3" {
		return c.Three, true
	}

	return Command{}, false
}

type Four struct {
	Four Command `json:"4,omitempty"`
}

func (c Four) MatchesKey(key string) (Command, bool) {
	if key == "4" {
		return c.Four, true
	}

	return Command{}, false
}

type Five struct {
	Five Command `json:"5,omitempty"`
}

func (c Five) MatchesKey(key string) (Command, bool) {
	if key == "5" {
		return c.Five, true
	}

	return Command{}, false
}

type Six struct {
	Six Command `json:"6,omitempty"`
}

func (c Six) MatchesKey(key string) (Command, bool) {
	if key == "6" {
		return c.Six, true
	}

	return Command{}, false
}

type Seven struct {
	Seven Command `json:"7,omitempty"`
}

func (c Seven) MatchesKey(key string) (Command, bool) {
	if key == "7" {
		return c.Seven, true
	}

	return Command{}, false
}

type Eight struct {
	Eight Command `json:"8,omitempty"`
}

func (c Eight) MatchesKey(key string) (Command, bool) {
	if key == "8" {
		return c.Eight, true
	}

	return Command{}, false
}

type WheelRoutine struct {
	Name    string `json:"name"`
	RGB     []int  `json:"rgb"`
	Command string `json:"command"`
}

type WheelRoutines struct {
	WheelRoutines []WheelRoutine `json:"wheel-routines,omitempty"`
}

func (c WheelRoutines) MatchesKey(key string) (Command, bool) {
	for _, routine := range c.WheelRoutines {
		if key == routine.Name {
			return Command{
				Cmd:   routine.Command,
				Color: routine.RGB,
			}, true
		}
	}

	return Command{}, false
}
