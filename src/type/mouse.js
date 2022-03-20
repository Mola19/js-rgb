import USBDevice from "./usbdevice.js"
import validator from "../utils/input.js"

export default class Mouse extends USBDevice {
	profile = {
		flags: {
			set: false,
			get: false,
			save: false
		}
	}

	dpi = {
		flags: {
			set: false,
			get: false
		}
	}

	initFunctions () {
		if (this.profile.flags.set) {
			this.profile.validateInput = validator(this.profile.range)
			const originalProfileSet = this.profile.set
			this.profile.set = async (...args) => {
				if (!this.profile.validateInput(args[0])) throw new Error("invalid Input")
				let result = await originalProfileSet(...args)
				return (typeof result == "undefined") ? true : result
			}
		}

		if (this.profile.flags.save) {
			const originalProfileSave = this.profile.save
			if (this.profile.flags.profileInput) {
				this.profile.shallowReactive = async (...args) => {
					if (!this.profile.validateInput(args[0])) throw new Error("invalid Input")
					let result = await originalProfileSave(...args)
					return (typeof result == "undefined") ? true : result
				}
			} else {
				this.profile.save = async (...args) => {
					let result = await originalProfileSave(...args)
					return (typeof result == "undefined") ? true : result
				}
			}
		}

		if (this.dpi.flags.set) {
			this.dpi.validateInput = validator(this.dpi.range)
			const originalDPISet = this.dpi.set
			if (this.dpi.flags.profileInput) {
				this.dpi.set = async (...args) => {
					if (!this.dpi.validateInput(args[0])) throw new Error("invalid Input")
					if (!this.profile.validateInput(args[1])) throw new Error("invalid Input")
					let result = await originalDPISet(...args)
					return (typeof result == "undefined") ? true : result
				}
			}
		}
	}
}
