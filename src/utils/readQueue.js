export default class ReadQueue {
	#queue = []

	constructor (dev) {
		dev.readEmpty()
		dev.on("data", this.#onInput)
	}

	#onInput = (buffer) => {
		for (let i = 0; i < this.#queue.length; i++) {
			let check = true
			for (let j = 0; j < this.#queue[i].buffer.length; j++) {
				if ( this.#queue[i].buffer[j] !== null && this.#queue[i].buffer[j] != buffer[j]) {
					check = false
					break
				}
			}
			if (check) {
				this.#queue[i].resolve(buffer)
				break
			}
		}
	}

	add = (buffer) => new Promise(( resolve ) => {
		this.#queue.push({ buffer, resolve })
	})
}
