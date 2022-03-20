export function compareOrUndef ( comp1, comp2 ) {
	return comp1 === comp2 || (typeof comp1 === "undefined" && comp2 === 0)
}

export function sleep ( ms ) {
	return new Promise(( resolve ) => setTimeout(resolve, ms))
}
