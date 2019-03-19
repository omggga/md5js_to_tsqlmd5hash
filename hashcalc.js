const md5 = require('./md5')

const getMd5Hash = function(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (evt) => {

			const data = evt.target.result
			const maxBufSize = 8000
			const hashSize = 16

			const chunkSize = maxBufSize - hashSize

			let hash = new ArrayBuffer(hashSize)
			for (let i = 0, len = data.byteLength; i < len; i += chunkSize) {
				let chunk = data.slice(i, i + chunkSize)
				const buff = createTempUint8Array(hash, chunk)

				//Need to return string hash on final chunk, no need to convert arrayBuffer -> String later
				if((i + chunkSize) >= data.byteLength) {
					hash = md5(buff)
				} else {
					hash = md5.arrayBuffer(buff)
				}
			}
			resolve(hash)
		}
		reader.readAsArrayBuffer(file)
	})
}

const createTempUint8Array = function(hash, chunk) {
	const tmp = new Uint8Array(hash.byteLength + chunk.byteLength)
	tmp.set(new Uint8Array(hash), 0)
	tmp.set(new Uint8Array(chunk), hash.byteLength)
	return tmp.buffer
}

module.exports = getMd5Hash