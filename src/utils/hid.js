import * as hid from "node-hid"
import { compareOrUndef } from "./misc.js"

let devices = hid.devices()
function getDevice ( vendorId, productId, $interface, usagePage, usage ) {
	const device = devices.find(( dev ) => (
		dev.vendorId === vendorId
		&& dev.productId === productId
		&& compareOrUndef(dev.interface, $interface)
		&& compareOrUndef(dev.usagePage, usagePage)
		&& compareOrUndef(dev.usage, usage)
	))

	return device
}

export function getDeviceByStuff ( vid, pid, int, usagePage, usage ) {
	const device = getDevice(vid, pid, int, usagePage, usage)
	return new hid.HID(device.path)
}

export function hasDevice ( vid, pid, int, usagePage, usage ) {
	const device = getDevice(vid, pid, int, usagePage, usage)
	return Boolean(device)
}
