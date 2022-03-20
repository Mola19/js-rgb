import Mouse from "../../type/mouse.js"

export default class AsusMouseGen2 extends Mouse {
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
		get: async () => {
			let { activeProfile } = await this.native.getDeviceInfo()
			return activeProfile
		},
		set: async (profile) => {
			await this.native.setProfile(profile)
			return true
		},
		save: async () => {
			await this.native.saveProfile()
			return true
		}
	}

	dpi = {
		range: {
			type: "minmax",
			min: 50,
			max: 7200,
			step: 50
		},
		flags: {
			set: true,
			get: true,
			profileInput: false
		},
		get: async () => {
			let { dpi } = await this.native.getPerformance()
			return (dpi + 1) * 50
		},
		set: async (dpi) => {
			await this.native.setPerformance(0, Math.floor(dpi / 50) - 1)
			return true
		}
	}


	native = {
		setPerformance: async (type, value) => {
			this.hid.write([ 0x00, 0x51, 0x31, type, 0x00, value ])
			await this.hid.readQueue.add([ 0x51, 0x31, type, 0x00, value ])
		},
		getPerformance: async () => {
			this.hid.write([ 0x00, 0x12, 0x04 ])
			let res = await this.hid.readQueue.add([ 0x12, 0x04 ])
			return {
				dpi: res[4],
				dpi2: (res[6] + 1) * 50,
				pollingRate: [ 125, 250, 500, 1000 ][res[8]],
				buttonResponse: (res[10] + 1) * 4,
				angleSnapping: Boolean(res[12]),
				accelleration: res[14],
				deccellaration: res[16]
			}
		},
		getDeviceInfo: async () => {
			this.hid.write([ 0x00, 0x12, 0x00 ])
			let res = await this.hid.readQueue.add([ 0x12, 0x00 ])
			return {
				version: String(res.slice(4, 8)),
				profileSize: res[8],
				modeSize: res[9],
				activeProfile: res[10],
				activeDPIIndex: res[11],
				activeDPI: (res[12] + 1) * 50
			}
		},
		setProfile: async (profile) => {
			this.hid.write([ 0x00, 0x50, 0x02, profile ])
			await this.hid.readQueue.add([ 0x50, 0x02, profile ])
		},
		saveProfile: async () => {
			this.hid.write([ 0x00, 0x50, 0x03 ])
			await this.hid.readQueue.add([ 0x50, 0x03 ])
		}
	}
}
