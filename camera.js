
const camera = () => ({
	schema: {
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
		rayCube: { type: 'selector' },
		rayFace: { type: 'selector' },
	},
	// dependency: ['raycaster'],

	init() {
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		const canvas = document.getElementById("scene")
		// document.getElementsByTagName('canvas')[0]
		const root = document.getElementById("root")

		this.data.camera_dist = camera2.object3D.position.z

		this.parts = undefined

		this.positionP = undefined
		this.zoom_mode = false
		this.root_mode = false

		this.mouse_or_touch = false

		this.NextMove = []

		this.plane = [
			document.getElementById('planeY'),
			document.getElementById('planeX'),
			document.getElementById('planeZ'),
		]

		this.index = ['planeY', 'planeX', 'planeZ']
		this.indexM = [
			{x:1, y:0, z:1},
			{x:0, y:1, z:1},
			{x:1, y:1, z:0},
		]

		this.atan = [
			["x","z"],
			["z","y"],
			["y","x"],
		]

		this.ziku = ['boxY', 'boxX', 'boxZ']
		this.rayFace
		this.targetFace = []
		this.startRad = []

		this.cubeTileMove = [
			["y","x"],
			["y","z"],
			["y","x"],
			["y","z"],
			["x","z"],
			["x","z"],
			
			["L"],["B"],
			["R"],["B"],
			["R"],["F"],
			["L"],["F"],

			["B"],["U"],
			["R"],["U"],
			["F"],["U"],
			["L"],["U"],

			["B"],["D"],
			["R"],["D"],
			["F"],["D"],
			["L"],["D"],

			["L","B"],
			["U","B"],
			["U","L"],

			["R","B"],
			["U","R"],
			["U","B"],

			["R","F"],
			["U","F"],
			["U","R"],

			["L","F"],
			["U","L"],
			["U","F"],
			

			["L","B"],
			["D","L"],
			["D","B"],

			["R","B"],
			["D","B"],
			["D","R"],

			["R","F"],
			["D","R"],
			["D","F"],

			["L","F"],
			["D","F"],
			["D","L"],
		]

		this.vec = {
			"U":0, "D":0, "L":1, "R":1, "B":2, "F":2, "y":0, "x":1, "z":2, 
		}

		this.faces_rad = {
			"U":-1, "D":1, "L":1, "R":-1, "B":1, "F":-1, "y":-1, "x":-1, "z":-1, 
		}
		// [-1, -1,1,  -1,   1,1,  -1,-1,-1]

		this.candidateMove = []
		this.insMove = document.getElementById('insMove')
		this.log = document.getElementById('logs')

		this.el.addEventListener('raycaster-intersection', (e) => {
			if (e.target !== this.data.rayFace) return; // 対応するレイキャスターのみ反応
			
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.cube_mode !== "stay")	return

			this.rayFace = e.target.components.raycaster
			for(let i=0;i<e.detail.els.length;i++){
				const ind = this.index.indexOf(e.detail.els[i].id)
				// console.log(`id [${e.detail.els[i].id}] index [${ind}]`)
				this.targetFace[ind] = e.detail.els[i]
			}
		})

		this.el.addEventListener('raycaster-intersection-cleared', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.cube_mode !== "stay")	return
			if (e.target !== this.data.rayFace) return; // 対応するレイキャスターのみ反応

			for(let i=0;i<e.detail.clearedEls.length;i++){
				const ind = this.index.indexOf(e.detail.clearedEls[i].id)
				this.targetFace[ind] = null
				// console.log(`id [${e.detail.clearedEls[i].id}] index [${ind}]`)
			}
		})

		root.addEventListener("mousedown", (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.cube_mode !== "stay"){
				scene.Color_set(e)
				return
			}
			if(this.root_mode)	return
			
			if(scene.data.all_sul_mode)	return

			this.parts = e.target
			// console.log(`mousedown ID [${e.target.parentElement.id}]`)

			const regex = /[^a-z]/g;
			const regex2 = /[^0-9]/g;
			const parts_type = this.parts.parentElement.id.replace(regex, "")
			const be = this.parts.parentElement.id.replace(regex2, "")
			if(!(parts_type === "edge" || parts_type === "center" || parts_type === "corner"))	return

			this.root_mode = true
			this.NextMove = []
			// this.parts = this.parts.id

			this.rayCube = this.data.rayCube.components.raycaster
			this.targetCube = e.target

			const pos = this.rayCube.getIntersection(this.targetCube)

			let num = 0
			if(parts_type === "center"){
				num = be
				// console.log(`center num [${num}]`)
			}
			else if(parts_type === "edge"	){
				num = be*2 + 6
				num += pos.face.normal.y > 0.707 ? 0 : 1
				// console.log(`edge num [${num}]`)
			}
			else if(parts_type === "corner"){
				num = be*3 + 30
				num += pos.face.normal.y > 0.707 ? 0 : (pos.face.normal.x > 0.707 ? 1 : 2)
				// console.log(`corner num [${num}]`)
			}

			// console.log(pos.face.normal)

			this.pmove = this.cubeTileMove[num]
			this.candidateMove = []

			for(let i=0;i<this.pmove.length;i++){
				this.candidateMove[i] = this.vec[this.pmove[i]]
			}

			this.startRad = []

			for(let i=0; i<3; i++){
				if(this.candidateMove.indexOf(i) !== -1){
					// console.log(`for i [${i}]`)
					this.startRad[i] = [pos.point[this.atan[i][0]], pos.point[this.atan[i][1]]]
					// this.startRad[i] = Math.atan2(pos.point[this.atan[i][0]], pos.point[this.atan[i][1]])
					this.plane[i].object3D.position[this.atan[(i+2)%3][0]] = pos.point[this.atan[(i+2)%3][0]]
					this.plane[i].classList.add("ground")
					// this.plane[i].object3D.visible = true
					// this.plane[i].children[0].setAttribute("color", "#FFF")
					// document.getElementById(this.ziku[i]).object3D.visible = true
				}
				else {
					// this.plane[i].object3D.visible = false
					// document.getElementById(this.ziku[i]).object3D.visible = false
				}
			}
		})
		
		this.el.addEventListener("raycaster-mouseup", (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.cube_mode !== "stay")	return
			if(!this.root_mode)	return

			this.parts = undefined
			this.root_mode = false
			
			let move1 = this.pmove[this.NextMove[0]] + ((this.faces_rad[this.pmove[this.NextMove[0]]] * this.NextMove[1] > 0) ? "":"'")

			if(this.NextMove.length > 0){
				scene.Ins_reset()
				if(move1[0] > "Z"){
					scrambled_state = scrambled_state.hand_move(moves[move1])
					color_data = color_re_set(move1)
				}
				else{
					scrambled_state = scamble2state(scrambled_state,move1)
				}
				one_rotate(scrambled_state, move1)
				// this.log.innerHTML = `moves [${move1}]<br>` + this.log.innerHTML
			}

			for(let i of this.candidateMove){
				this.plane[i].classList.remove("ground")
			}

			this.NextMove = []
			this.candidateMove = []
		})

		canvas.addEventListener('touchstart', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			
			this.mouse_or_touch = true
			if(this.root_mode)	return
			// console.log(`touchstart target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			if(e.touches.length === 1 && !this.zoom_mode){
				// console.log(`touchstart 1 len[${e.touches.length}]`)
				this.positionP = {x:e.touches[0].clientX , y:e.touches[0].clientY}
				this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
				this.zoom_mode = true
			}
			else if(e.touches.length === 2 && this.zoom_mode){
				// console.log(`touchstart 2 len[${e.touches.length}]`)
				this.positionP = {x:e.touches[1].clientX - e.touches[0].clientX , y:e.touches[1].clientY - e.touches[0].clientY}
				this.data.camera_dist = camera2.object3D.position.z		
				// this.zoom_mode = true
			}
		})

		canvas.addEventListener('touchmove', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			if(this.root_mode)	return

			if(e.touches.length === 1 && this.zoom_mode){
				let dx = {x:e.touches[0].clientX - this.positionP.x, y:e.touches[0].clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
			else if(e.touches.length === 2 && this.zoom_mode){
				// console.log(`touchmove 2 `)
				let pdx = Math.sqrt( Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) )
				let dx = Math.sqrt( Math.pow( this.positionP.x, 2) + Math.pow( this.positionP.y, 2) )
				camera2.object3D.position.z	= Math.max(this.data.camera_dist - ( pdx - dx )/70 , 0)
				
			}
		})

		canvas.addEventListener('touchend', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			this.mouse_or_touch = false
			this.zoom_mode = false
			this.el.emit('raycaster-mouseup')
		})
		
		canvas.addEventListener('mousedown', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			this.mouse_or_touch = true
			if(this.root_mode)	return
			// console.log(`mousedown target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			// console.log(e.target)
			// console.log(e.currentTarget)

			this.positionP = {x:e.clientX , y:e.clientY}
			this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
			this.mouse_ples = true
		})

		canvas.addEventListener('mousemove', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			// console.log(`face_select[${scene.data.face_select}] root_mode[${this.root_mode}] mouse_ples [${this.mouse_ples}]`)
			if(scene.data.face_select)	return
			if(this.root_mode)	return
			// console.log(`mousemove target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)

			if(this.mouse_ples){
				let dx = {x:e.clientX - this.positionP.x, y:e.clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
		})
		
		canvas.addEventListener('mouseup', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			this.mouse_or_touch = false
			this.el.emit('raycaster-mouseup')
			if(this.root_mode)	return
			// console.log(`mouseup target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			this.mouse_ples = false
		})

		canvas.addEventListener('mouseleave', (e) => {
			const scene = document.getElementById('scene').components["cube-mode"]
			if(scene.data.face_select)	return
			this.mouse_or_touch = false
			// console.log(
			// 	`target ${e.target.tagName} id [${e.target.id}]\n`+
			// 	`currentTarget${e.currentTarget.tagName} id [${e.currentTarget.id}]`)
			if(e.target.tagName === 'A-SCENE'){
				// console.log(`mouseleave target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
				this.mouse_ples = false
				this.el.emit('raycaster-mouseup')
			}
			if(this.root_mode)	return
		})

		canvas.addEventListener('wheel', (e) => {
			if(this.root_mode)	return
			this.data.camera_dist = camera2.object3D.position.z
			this.data.camera_dist += e.deltaY/200
			this.data.camera_dist = Math.max(this.data.camera_dist,0)
			camera2.object3D.position.z = this.data.camera_dist
		});
	},
	tick(){
		// if(window.readyState !== "complete")	console.log(window.readyState)
		if(this.candidateMove.length === 0) return
		let rads = []
		let dists = []
		// let radIndex = 0
		let distIndex = -1

		for(let i=0; i<this.candidateMove.length; i++){
			const m = this.candidateMove[i]
			if (!this.rayFace || !this.targetFace[m]) continue;
			const item = this.rayFace.getIntersection(this.targetFace[m])
			let dist = Math.sqrt(
				Math.pow(item.point[this.atan[m][0]] - this.startRad[m][0],2) +
				Math.pow(item.point[this.atan[m][1]] - this.startRad[m][1],2)
			)
			let rad = Math.round(
				(Math.atan2(item.point[this.atan[m][0]], item.point[this.atan[m][1]]) - 
				Math.atan2(this.startRad[m][0], this.startRad[m][1])			) / (Math.PI/180)
			)
			dists = dists.concat(dist)
			rads = rads.concat(rad)

			if(Math.abs(dist) < 0.5 || Math.abs(rad) < 15){
			}
			else if(dists[distIndex] == undefined ||dists[distIndex] > dist)	distIndex = i
		}


		if(distIndex !=-1){			
			const MoiveCode = this.pmove[distIndex] + ((this.faces_rad[this.pmove[distIndex]] * rads[distIndex] > 0) ? "":"'")
			// if(distIndex != undefined && this.NextMove[0] != distIndex)
			// 	raycast_rotate()

			if(this.NextMove.length > 0 && distIndex != this.NextMove[0])	
				raycast_rotate(this.pmove[this.NextMove[0]],0)

			this.NextMove = [distIndex, rads[distIndex]]
			// this.insMove.setAttribute("value",`moves [${MoveCode}]`)
			// console.log(`pmove [${this.pmove[distIndex]}] rad [${Math.min(dists[distIndex]/2,Math.PI/2) * (rads[distIndex] > 0 ?1:-1)}]`)
			raycast_rotate(this.pmove[distIndex],Math.min((dists[distIndex]-0.5)/2,Math.PI/2) * (rads[distIndex] > 0 ?1:-1))
		}
		else if(this.NextMove.length > 0){
			const MoveCode = this.pmove[this.NextMove[0]] + ((this.faces_rad[this.pmove[this.NextMove[0]]] * rads[this.NextMove[1]] > 0) ? "":"'")

			if(Math.abs(dists[this.NextMove[0]]) <= 0.5 || Math.abs(rads[this.NextMove[0]]) <= 15){
				// console.log(`return dist 0`)
				raycast_rotate(MoveCode, 0)
				this.NextMove = []
			}
			else{
				const rad = Math.min((dists[this.NextMove[0]]-0.5)/2,Math.PI/2) * (rads[this.NextMove[0]] > 0 ?1:-1)
				if(isNaN(rad)){
					console.log(`rad = NaN`)
					return
				}
				raycast_rotate(MoveCode, Math.min((dists[this.NextMove[0]]-0.5)/2,Math.PI/2) * (rads[this.NextMove[0]] > 0 ?1:-1))
			}
		}
	},
	
})