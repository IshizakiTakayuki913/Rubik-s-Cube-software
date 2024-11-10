const presskeyboard = () => ({
	schema: {
		Space_key: {type: 'boolean', default: false},
		Rotation: {type: 'boolean', default: false},
	},
	
	init() {
		// const btn1 = document.getElementById("btn1")
		// const body = document.getElementById("rootBody")
		// const scene = document.getElementById('scene')

		const key_ples = {
			'KeyW':false,
			'KeyX':false,
			'KeyA':false,
			'KeyD':false,
			'KeyE':false,
			'KeyC':false,
			'Digit1':false,
			'Digit2':false,
			'Digit3':false,
			'KeyJ':false,
			'KeyG':false,
		}
		
		const M = {
			'KeyW':'U',
			'KeyX':'D',
			'KeyA':'L',
			'KeyD':'R',
			'KeyE':'B',
			'KeyC':'F',
			'Digit1':'x',
			'Digit2':'y',
			'Digit3':'z',
			'KeyJ':'r',
			'KeyG':'l',
			'KeyY':'u',
			'KeyN':'d',
			'KeyM':'f',
			'KeyU':'b',
		}

		window.addEventListener("keydown", (e) => {
			if(!this.data.Rotation) return
			if(e.code == "KeyP"){
				const camera = document.getElementById('camOut').components["sync-user"]
				camera.load()
			}
			const A = e.code
			const scene = document.getElementById('scene').components["cube-mode"]

			if(e.code == "Space")
				this.data.Space_key = true
			if(key_ples[e.code]) return
			key_ples[e.code]= true
			if(M[A] == undefined)	return
			
			if(scene.data.all_sul_mode)	return
			scene.Ins_reset()

			let sulb = M[A]
			if(e.shiftKey) sulb += "'"
			else if(this.data.Space_key) sulb += "2"
			
			rotate(sulb,500)
		})
		
		window.addEventListener("keyup", (e) => {
			if(e.code == "Space")
				this.data.Space_key = false
			key_ples[e.code] = false
		})
	},
})