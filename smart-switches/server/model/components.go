package model

type commandMatcher interface {
	MatchesKey(key string) (command string, ok bool)
}

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

func (c On) MatchesKey(key string) (string, bool) {
	if key == "on" {
		return c.On, true
	}

	return "", false
}

type Off struct {
	Off string `json:"off,omitempty"`
}

func (c Off) MatchesKey(key string) (string, bool) {
	if key == "off" {
		return c.Off, true
	}

	return "", false
}

type One struct {
	One string `json:"1,omitempty"`
}

func (c One) MatchesKey(key string) (string, bool) {
	if key == "1" {
		return c.One, true
	}

	return "", false
}

type Two struct {
	Two string `json:"2,omitempty"`
}

func (c Two) MatchesKey(key string) (string, bool) {
	if key == "2" {
		return c.Two, true
	}

	return "", false
}

type Three struct {
	Three string `json:"3,omitempty"`
}

func (c Three) MatchesKey(key string) (string, bool) {
	if key == "3" {
		return c.Three, true
	}

	return "", false
}

type Four struct {
	Four string `json:"4,omitempty"`
}

func (c Four) MatchesKey(key string) (string, bool) {
	if key == "4" {
		return c.Four, true
	}

	return "", false
}

type Five struct {
	Five string `json:"5,omitempty"`
}

func (c Five) MatchesKey(key string) (string, bool) {
	if key == "5" {
		return c.Five, true
	}

	return "", false
}

type Six struct {
	Six string `json:"6,omitempty"`
}

func (c Six) MatchesKey(key string) (string, bool) {
	if key == "6" {
		return c.Six, true
	}

	return "", false
}

type Seven struct {
	Seven string `json:"7,omitempty"`
}

func (c Seven) MatchesKey(key string) (string, bool) {
	if key == "7" {
		return c.Seven, true
	}

	return "", false
}

type Eight struct {
	Eight string `json:"8,omitempty"`
}

func (c Eight) MatchesKey(key string) (string, bool) {
	if key == "8" {
		return c.Eight, true
	}

	return "", false
}

type WheelRoutine struct {
	Name    string `json:"name"`
	RGB     []int  `json:"rgb"`
	Command string `json:"command"`
}

type WheelRoutines struct {
	WheelRoutines []WheelRoutine `json:"wheel-routines"`
}

func (c WheelRoutines) MatchesKey(key string) (string, bool) {
	for _, routine := range c.WheelRoutines {
		if key == routine.Name {
			return routine.Command, true
		}
	}

	return "", false
}
