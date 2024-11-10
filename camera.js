const camera = () => ({
	schema: {
		Viewpoint: {type: 'boolean', default: true},
		scene: {type: 'string', default: ""},
		camOut: {type: 'string', default: ""},
		camIn: {type: 'string', default: ""},
	},		


	init() {
		// this.scene = document.querySelector(`#${this.data.scene}`)
		// this.camOut = document.querySelector(`#${this.data.camOut}`)
		// this.camIn = document.querySelector(`#${this.data.camIn}`)

		this.scene = document.getElementById(this.data.scene)
		this.camOut = document.getElementById(this.data.camOut)
		this.camIn = document.getElementById(this.data.camIn)
		
		this.mousePress = false
		this.touchPress = false
		this.touchMode = undefined

		// console.log(`カメラ　ーーーー`)

		// console.log(this.scene)
		// this.setpos = this.scene.getBounndingClientRect()

		this.scene.addEventListener('mousedown', (e) => {
			// console.log(`カメラ　ーーーー　mousedown　0`)
			if(!this.data.Viewpoint) return
			// console.log(`カメラ　ーーーー　mousedown　1`)
			if(e.target.tagName !== 'CANVAS') return
			// console.log(`カメラ　ーーーー　mousedown　2`)
			if(!this.hit({
				x:e.clientX - this.scene.getBoundingClientRect().left,
				y:e.clientY - this.scene.getBoundingClientRect().top
			})) return
			// console.log(`カメラ　ーーーー　mousedown　3`)
			this.mousePress = true

			// console.log(`camOut DOWN ${this.el.id}`)
			
			if(this.touchPress || this.touchMode !== undefined){
				this.touchPress =false
				this.touchMode = undefined
				console.log("touchPres")
			}

			this.mousePos = {
				x:e.clientX - this.scene.getBoundingClientRect().left,
				y:e.clientY - this.scene.getBoundingClientRect().top
			}
			this.sceneRot = {x:this.camOut.object3D.rotation.x, y:this.camOut.object3D.rotation.y}
		})
		
		document.addEventListener('mousemove', (e) => {
			if(!this.data.Viewpoint) return
			if(!this.mousePress)	return
			// console.log(`target [${e.target.tagName}] current [${e.currentTarget.tagName}]`)
			
			// console.log(`camOut MOVE ${this.el.id}`)
			let dx = {
				x:e.clientX - this.scene.getBoundingClientRect().left - this.mousePos.x,
				y:e.clientY - this.scene.getBoundingClientRect().top - this.mousePos.y
			}
			this.camOut.object3D.rotation.y = (this.sceneRot.y - dx.x/150) % (2*Math.PI)
			this.camOut.object3D.rotation.x = Math.max(Math.min(this.sceneRot.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)

			// console.log(`rotation ${JSON.stringify(this.camOut.object3D.rotation)}`)
		})
		
		document.addEventListener('mouseup', (e) => {
			// console.log(e.target)
			if(!this.mousePress)	return
			this.mousePress=false
		})

		this.scene.addEventListener('wheel', (e) => {
			if(e.target.tagName !== 'CANVAS') return
			d = this.camIn.object3D.position.z
			d += e.deltaY/200
			d = Math.max(d,0)
			this.camIn.object3D.position.z = d
			
			// console.log(`camOut WHEEL ${this.el.id} scene ${this.scene.id} camIn ${this.camIn.id}`)
		})

		this.scene.addEventListener('touchstart', (e) => {
			if(!this.data.Viewpoint) return
			if(e.target.tagName !== 'CANVAS') return
			// console.log(e.touches[0])
			if(e.touches.length>0 && !this.hit({
				x:e.touches[0].clientX - this.scene.getBoundingClientRect().left,
				y:e.touches[0].clientY - this.scene.getBoundingClientRect().top
			})) return	

			this.touchPress = true

			if(this.mousePress){
				this.mousePress =false
				console.log("mousePres")
			}

			if(this.touchMode === "none"){}
			else if(e.touches.length == 1){
				this.touchMode = "oun"
				this.touchPos = {
					x:e.touches[0].clientX - this.scene.getBoundingClientRect().left,
					y:e.touches[0].clientY - this.scene.getBoundingClientRect().top
				}
				this.sceneRot = {x:this.camOut.object3D.rotation.x, y:this.camOut.object3D.rotation.y}
			}
			else if(e.touches.length == 2){
				this.touchMode = "two"
				this.touchPos = {
					x:e.touches[1].clientX - e.touches[0].clientX ,
					y:e.touches[1].clientY - e.touches[0].clientY
				}
				this.touchSetPos = this.camIn.object3D.position.z
			}
		})
		
		this.scene.addEventListener('touchmove', (e) => {
			if(!this.data.Viewpoint) return
			if(!this.touchPress)	return

			if(this.touchMode === "oun"){
				let dx = {
					x:e.touches[0].clientX - this.scene.getBoundingClientRect().left - this.touchPos.x,
					y:e.touches[0].clientY - this.scene.getBoundingClientRect().top - this.touchPos.y
				}
				this.camOut.object3D.rotation.y = (this.sceneRot.y - dx.x/150) % (2*Math.PI)
				this.camOut.object3D.rotation.x = Math.max(Math.min(this.sceneRot.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
			else if(this.touchMode === "two"){
				d = this.touchSetPos
				let pdx = Math.sqrt( 
					Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + 
					Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) 
				)
				let dx = Math.sqrt( Math.pow( this.touchPos.x, 2) + Math.pow( this.touchPos.y, 2) )
				d = Math.max(d - ( pdx - dx )/70 , 3.375)
				this.camIn.object3D.position.z	= d
			}
			else if(this.touchMode === "none"){}
		})

		this.scene.addEventListener('touchend', (e) => {
			if(!this.touchPress)	return
			// console.log(e)
			if(e.touches.length>0)	this.touchMode = "none"
			else {
				this.touchPress = false
				this.touchMode = undefined
			}
		})
	},
	
	hit(p) {
		// console.log(p)
		const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();
		pointer.x = ( p.x / this.scene.clientWidth ) * 2 - 1;
		pointer.y = - ( p.y / this.scene.clientHeight ) * 2 + 1;
		
		const Cam= this.el.components.camera.camera
		// console.log(Cam)
		raycaster.setFromCamera( pointer, Cam );
		
		const  targetEls = document.querySelectorAll('.cube, .sky')
		// console.log(targetEls)
		const  targetObj= [];
		for (var i = 0; i < targetEls.length; i++)	targetObj.push(targetEls[i].object3D)
		
		const intersects = raycaster.intersectObjects( targetObj);
		// for ( let i = 0; i < intersects.length; i ++ ) {
		// 		console.log(intersects[ i ].object.el)
		// }
		// console.log(intersects)
		// console.log(intersects[0].object.el.classList)
		if(intersects.length == 0) return false

		if(intersects[0].object.el.classList.value.indexOf("sky") != -1)
			return true

		return false
  },

})