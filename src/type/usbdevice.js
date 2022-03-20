import { EventEmitter } from "node:events"
import { getDeviceByStuff, hasDevice } from "../utils/hid.js"

export default class USBDevice extends EventEmitter {
	name = null

	vendorId = null
	productId = null
	interface = null
	usagePage = null
	usage = null

	#initialized = false
	init () {
		if (this.#initialized) return
		this.#initialized = true

		// maybe check if those are all really numbers?
		// or check where we check if the user has those devices
		// or just not if we don't allow outsiders to do this
		// but we probably should allow that
		const device = getDeviceByStuff(this.vendorId, this.productId, this.interface, this.usagePage, this.usage)

		device.awaitRead = () => (
			new Promise(( resolve, reject ) => {
				device.read(( err, data ) => {
					if (err) {
						reject(err)
					} else resolve(data)
				})
			})
		)

		device.readEmpty = () => {
			while (true) if (!device.readTimeout(0).length) return
		}

		device.readEmpty()

		this.hid = device

		this.hid.readQueue = {}

		this.hid.readQueue.queue = []

		this.hid.readQueue.onInput = (buffer) => {
			for (let i = 0; i < this.hid.readQueue.queue.length; i++) {
				let check = true
				for (let j = 0; j < this.hid.readQueue.queue[i].buffer.length; j++) {
					if ( this.hid.readQueue.queue[i].buffer[j] !== null && this.hid.readQueue.queue[i].buffer[j] != buffer[j]) {
						check = false
						break
					}
				}
				if (check) {
					this.hid.readQueue.queue[i].resolve(buffer)
					break
				}
			}
		}

		this.hid.readQueue.add = (buffer) => new Promise(( resolve ) => {
			this.hid.readQueue.queue.push({ buffer, resolve })
		})

		device.on("data", this.hid.readQueue.onInput)

		this.initFunctions()

		// if (this.customInit) this.customInit()

		// maybe not here, but outside
		// if (!this.shouldConnect()) "abort" // await
	}

	// maybe not like this
	has () {
		return hasDevice(this.vendorId, this.productId, this.interface, this.usagePage, this.usage)
	}

	shouldConnect () {
		return true
	}
}
