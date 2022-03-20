export function minMax ({ min, max }, input ) {
	if (input >= min && input <= max) return true
	return false
}

export function minMaxStep ({ min, max, step }, input ) {
	if (input >= min && input <= max && !(( input - min ) % step )) return true
	return false
}

export function validateValues ( values, input ) {}

export default function validator ({ type, ...rest }) {
	if (type == "minmax") {
		if (rest.step) {
			return minMaxStep.bind(null, rest)
		}
		return minMax.bind(null, rest)
	} else if (type == "values") {
		return validateValues.bind(null, rest)
	}
}
