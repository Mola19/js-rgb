import RoccatKoneAimo from "./device/mouse/roccat-kone-aimo.js"
import AsusRogStrixEvolve from "./device/mouse/asus-rog-strix-evolve.js"
import AsusRogPugio from "./device/mouse/asus-rog-pugio.js"
import AsusTufM5 from "./device/mouse/asus-tuf-m5.js"

const all = [ AsusRogStrixEvolve, AsusRogPugio, AsusTufM5 ]

// export async function register () {

// }

export async function registerAll () {
	let deviceList = []

	for (const Device of all) {
		const dev = new Device

		if (dev.has()) {
			dev.init() // dev.shouldConnect() here?
			// map.set(device.name as string, device)
			deviceList.push(dev)
		}
	}

	return deviceList
}


export async function init () {
	// initialize all the stuff to devices here
	// basically what main() does but when we know what it should do
}

export function device ( first, pid ) {
	if (typeof first == "string" && typeof pid == "undefined") {
		console.error("\x1b[31m -- feature not yet available -- \x1b[0m")
	} else {
		console.error("\x1b[31m -- feature not yet available -- \x1b[0m")
	}
}
