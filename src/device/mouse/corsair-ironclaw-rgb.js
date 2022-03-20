import Mouse from "../../type/mouse.js"
import { sleep } from "../../utils/misc.js"
// import { minMax } from "../../utils/input.js"

export default class AsusRogStrixEvolve extends Mouse {
	name = "asus-strix"

	vendorId = 0x1B1C
	productId = 0x1B5D
	interface = 0x1
	usagePage = 0xffc2
	usage = 0x4

	profile = {
		range: {
			type: "minmax",
			min: 0,
			max: 2
		},
		flags: {
			set: true,
			get: true,
			save: true,
			profileInput: false // only important for save since set needs profile
		},
		get: async () => this.native.getActiveProfile(),
		set: async (profile) => {
			this.native.setProfile(profile)
			return true
		},
		save: async () => {
			await this.native.saveProfiles()
		}
	}

	dpi = {
		range: {
			type: "minmax", // or "values" or ...
			// values: [ 125, 250, 500, 1000 ]
			min: 50,
			max: 7200,
			step: 50
		},
		flags: {
			set: true,
			get: true,
			profileInput: true
		},
		set: async ( dpi, profile ) => {
			let result = await this.native.setProfileValue(profile + 1, 0x07, Math.floor(dpi / 50))
			return result
		},
		get: async ( ) => {
			const { dpi } = (await this.native.getProfileData())[profile]
			return dpi
		}
	}

	native = {
		saveProfiles: async () => {
			this.hid.sendFeatureReport([
				0x0c, 0xc4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
			])

			await sleep(20)
		},
		getActiveProfile: () => {
			let profile
			do {
				this.hid.sendFeatureReport([
					0x0c, 0xdf, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
				])
				profile = this.hid.getFeatureReport(0x0c, 9)[4]
			} while (profile < 240 || profile > 242)

			return profile % 16
		},
		getProfileData: async () => {
			this.hid.sendFeatureReport([
				0x0c, 0xc4, 0x13, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
			])

			await sleep(30) // might break if to many changes

			const data = this.hid.getFeatureReport(0x0e, 2053)

			let profiles = []
			for (let profileIndex = 0; profileIndex < 3; profileIndex++) {
				const offset = ( 256 * profileIndex ) + 260
				let profile = {
					pollingRate:    data[offset + 0x00],
					angleSnapping:  data[offset + 0x01],
					buttonResponse: data[offset + 0x03],
					dpi:            data[offset + 0x07] * 50,
					dpi2:           data[offset + 0x09] * 50,
					deceleration:   data[offset + 0x18] % 16,
					acceleration:   Math.floor(data[offset + 0x18] / 16),
					lighting: {
						mode:       data[offset + 0x19],
						brightness: data[offset + 0x1a],
						red:        data[offset + 0x1c],
						green:      data[offset + 0x1d],
						blue:       data[offset + 0x1e]
					},
					buttons: []
				}

				for (let buttonIndex = 0; buttonIndex < 10; buttonIndex++) {
					profile.buttons[buttonIndex] = []

					for (let buttonValueIndex = 0; buttonValueIndex < 5; buttonValueIndex++) {
						profile.buttons[buttonIndex][buttonValueIndex] = data[offset + 0x4f + ( buttonIndex * 5 ) + buttonValueIndex]
					}
				}

				profiles[profileIndex] = profile
			}
			return profiles
		},
		setProfileValue: async (profile, key, value) => {
			this.hid.sendFeatureReport([
				0x0c, 0xde, key, profile, value, 0x00, 0x00, 0x00, 0x00
			])

			await sleep(1) // might break if too many changes

			for (let i = 0; i < 100; i++) {
				let res = this.hid.getFeatureReport(0x0c, 9)
				if (res[2] === key && res[3] === profile && res[4] === value) return true
				await sleep(1)
			}

			return false
		},
		setProfile: (profile) => {
			this.hid.sendFeatureReport([
				0x0c, 0xc4, 0x07, profile, 0x00, 0x00, 0x00, 0x00, 0x00
			])
		}
	}
}
