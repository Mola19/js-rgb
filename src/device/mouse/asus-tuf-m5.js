import AsusMouseGen2 from "./_asus-mouse-gen2.js"

export default class AsusTufM5 extends AsusMouseGen2 {
	name = "asus-tuf-m5"

	vendorId = 0x0b05
	productId = 0x1898
	interface = 0x2
	usagePage = 0xff01
	usage = 0x1

	dpi = {
		range: {
			type: "minmax",
			min: 100,
			max: 6200,
			step: 100
		},
		flags: {
			set: true,
			get: true,
			profileInput: false
		},
		set: async (dpi) => {
			await this.native.setPerformance(0, Math.floor(dpi / 100) - 1)
			return true
		},
		get: async () => {
			let { dpi } = await this.native.getPerformance()
			return (dpi + 1) * 100
		},
	}
}
