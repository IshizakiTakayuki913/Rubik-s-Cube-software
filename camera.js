
const camera = () => ({
	schema: {
		Viewpoint: {type: 'boolean', default: false},
		ray: { type: 'selector' },
	},		


	init() {
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		
		this.mousePress = false
		this.touchPress = false
		this.touchMode = undefined

		this.scene = document.getElementById('scene')

		this.scene.addEventListener('mousedown', (e) => {
			if(!this.data.Viewpoint) return
			if(e.target.tagName !== 'CANVAS') return
			if(!this.hit({x:e.offsetX , y:e.offsetY})) return	
			this.mousePress = true
			
			if(this.touchPress || this.touchMode !== undefined){
				this.touchPress =false
				this.touchMode = undefined
				console.log("touchPres")
			}

			this.mousePos = {x:e.offsetX , y:e.offsetY}
			this.sceneRot = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y}
		})
		
		document.addEventListener('mousemove', (e) => {
			if(!this.data.Viewpoint) return
			if(!this.mousePress)	return
			
			let dx = {x:e.offsetX - this.mousePos.x, y:e.offsetY - this.mousePos.y}
			camera.object3D.rotation.y = (this.sceneRot.y - dx.x/150) % (2*Math.PI)
			camera.object3D.rotation.x = Math.max(Math.min(this.sceneRot.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
		})
		
		document.addEventListener('mouseup', (e) => {
			// console.log(e.target)
			if(!this.mousePress)	return
			this.mousePress=false
		})

		this.scene.addEventListener('wheel', (e) => {
			if(e.target.tagName !== 'CANVAS') return
			d = camera2.object3D.position.z
			d += e.deltaY/200
			d = Math.max(d,4)
			camera2.object3D.position.z = d
		})

		this.scene.addEventListener('touchstart', (e) => {
			if(!this.data.Viewpoint) return
			if(e.target.tagName !== 'CANVAS') return
			// console.log(e.touches[0])
			if(e.touches.length>0 && !this.hit({x:e.touches[0].clientX , y:e.touches[0].clientY})) return	

			this.touchPress = true

			if(this.mousePress){
				this.mousePress =false
				console.log("mousePres")
			}

			if(this.touchMode === "none"){}
			else if(e.touches.length == 1){
				this.touchMode = "oun"
				this.touchPos = {x:e.touches[0].clientX , y:e.touches[0].clientY}
				this.sceneRot = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y}
			}
			else if(e.touches.length == 2){
				this.touchMode = "two"
				this.touchPos = {x:e.touches[1].clientX - e.touches[0].clientX , y:e.touches[1].clientY - e.touches[0].clientY}
				this.touchSetPos = camera2.object3D.position.z
			}
		})
		
		this.scene.addEventListener('touchmove', (e) => {
			if(!this.data.Viewpoint) return
			if(!this.touchPress)	return

			if(this.touchMode === "oun"){
				let dx = {x:e.touches[0].clientX - this.touchPos.x, y:e.touches[0].clientY - this.touchPos.y}
				camera.object3D.rotation.y = (this.sceneRot.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.sceneRot.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
			else if(this.touchMode === "two"){
				d = this.touchSetPos
				let pdx = Math.sqrt( Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) )
				let dx = Math.sqrt( Math.pow( this.touchPos.x, 2) + Math.pow( this.touchPos.y, 2) )
				d = Math.max(d - ( pdx - dx )/70 , 0)
				camera2.object3D.position.z	= d
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

		if(intersects[0].object.el.classList[1]==="sky")
			return true

		return false
  },

})