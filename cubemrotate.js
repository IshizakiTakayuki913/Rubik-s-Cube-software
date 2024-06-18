 const cubemrotate = () => ({
	schema: {
		Rotation: {type: 'boolean', default: false},
		ray: { type: 'selector' },
	},		

	init() {
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		
		this.mousePress = false
		this.touchPress = false
		this.touchId= undefined

    
		this.faces_rad = {
			"U":-1, "D":1, "L":1, "R":-1, "B":1, "F":-1, "y":-1, "x":-1, "z":-1, 
		}

    this.tile = document.getElementById('tile')

		this.scene = document.getElementById('scene')

		this.scene.addEventListener('mousedown', (e) => {
			if(!this.data.Rotation) return
			if(e.target.tagName !== 'CANVAS') return
      if(this.mousePress || this.touchPress) return
      this.parts = this.hit({x:e.offsetX , y:e.offsetY},".cube, .sky", "cube")
			if(!this.parts) return
      this.search_parts()	
      this.mousePress = true
      // console.log(this.parts.object.el.parentElement.id)
			this.mousePos = {x:e.offsetX , y:e.offsetY}
		})

		this.scene.addEventListener('touchstart', (e) => {
			if(!this.data.Rotation) return
			if(e.target.tagName !== 'CANVAS') return
      if(this.mousePress || this.touchPress) return
      if(e.touches.length>1)  return
      this.parts = this.hit({x:e.touches[0].clientX , y:e.touches[0].clientY},".cube, .sky", "cube")
			if(!this.parts) return
      this.search_parts()	
      console.log(e)
      this.touchPress = true
      this.touchId = e.touches[0].identifier
      // console.log(this.parts.object.el.parentElement.id)
      // console.log(e)
			this.mousePos = {x:e.touches[0].clientX , y:e.touches[0].clientY}
		})
    
		document.addEventListener('mouseup', (e) => {
			// console.log(e.target)
			if(!this.mousePress)	return
			this.mousePress=false
        
      this.Decision_rotate()
		})
    
		this.scene.addEventListener('touchend', (e) => {
			if(!this.touchPress)	return
			if(e.changedTouches[0].identifier ==this.touchId){
        console.log("identifier touchend")
        this.touchId = undefined
        this.touchPress = false
        
        this.Decision_rotate()
      }
		})

		document.addEventListener('mousemove', (e) => {
			if(!this.data.Rotation) return
			if(e.target.tagName !== 'CANVAS') return
			if(!this.mousePress)	return
      
      this.tilePos = this.hit({x:e.offsetX , y:e.offsetY},".tile","tile")
      
      this.Progress_rotate()
		})
    
		this.scene.addEventListener('touchmove', (e) => {
			if(!this.data.Rotation) return
			if(!this.touchPress)	return
			if(e.changedTouches[0].identifier !==this.touchId) return
      // console.log("touchmove")
      
      this.tilePos = this.hit({x:e.changedTouches[0].clientX , y:e.changedTouches[0].clientY},".tile","tile")

      this.Progress_rotate()
		})
  },
	
	hit(p,sumName,hitName,mode = 0) {
		const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();
		pointer.x = ( p.x / this.scene.clientWidth ) * 2 - 1;
		pointer.y = - ( p.y / this.scene.clientHeight ) * 2 + 1;
		
		const Cam= this.el.components.camera.camera
		// console.log(Cam)
		raycaster.setFromCamera( pointer, Cam );
		
		const  targetEls = document.querySelectorAll(sumName)
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

		if(intersects[0].object.el.classList[1]===hitName)
			return intersects[0]

		// else if(mode == 1){
    //   for(let Int of intersects){
    //     if(Int.object.el.classList[1]===className)
    //       return Int
    //   }
    // }

		return false
  },

  search_parts(){
    const cubeTileMove = [
      ["y'","x'" ],
      ["y'","z'" ],
      ["y'","x"],     //Center normal
      ["y'","z"],
      ["z", "x"],
      ["z'","x"],
      
      ["L"],["B`"],
      ["R"],["B'"],
      ["R"],["F'"],
      ["L"],["F'"],

      ["B"],["U'"],
      ["R"],["U'"],
      ["F"],["U'"],     //Edge normal
      ["L"],["U'"],

      ["B"],["D'"],
      ["R"],["D'"],
      ["F"],["D'"],
      ["L"],["D'"],

      ["B","L"],
      ["U'","B'"],
      ["U'","L"],

      ["R","B"],
      ["U'","R'"],
      ["U'","B"],

      ["F","R"],     //Corner normal
      ["U'","F`"],
      ["U'","R"],

      ["L","F"],
      ["U'","L'"],
      ["U'","F"],
      

      ["L","B"],
      ["D'","L'"],
      ["D'","B"],

      ["B","R"],
      ["D'","B'"],
      ["D'","R"],

      ["R","F"],
      ["D'","R'"],
      ["D'","F"],

      ["F","L"],
      ["D'","F'"],
      ["D'","L"],
    ]

    // console.log("search_parts")

    const regex = /[^a-z]/g;
    const regex2 = /[^0-9]/g;
    const parts_type = this.parts.object.el.parentElement.id.replace(regex, "")
    const be = this.parts.object.el.parentElement.id.replace(regex2, "")
    if(!(parts_type === "edge" || parts_type === "center" || parts_type === "corner"))	return

    const pos = this.parts
    let face = 0

    let num = 0
    if(parts_type === "center"){
      num = be
      // console.log(`center num [${num}]`)
    }
    else if(parts_type === "edge"	){
      num = be*2 + 6
      face = pos.face.normal.y > 0.707 ? 0 : 1
      num += face
      
      // console.log(`edge num [${num}]`)
    }
    else if(parts_type === "corner"){
      num = be*3 + 30
      face = pos.face.normal.y > 0.707 ? 0 : (pos.face.normal.x > 0.707 ? 1 : 2)
      num += face
      // console.log(`corner num [${num}]`)
    }
    this.parts_type = parts_type
    this.parts_face = face
    this.moves = cubeTileMove[num]

    const prot = this.parts.object.el.object3D.rotation
    const np = this.set_position(pos.point, prot)

    // console.log(np)
    this.tile.object3D.position.copy(np)
    this.start_pos = np
    this.partsRot = prot
    
    let nrot = {x:0, y:0, z:0}
    if(parts_type === "center"){
    }
    else if(parts_type === "edge"	){
      if(face==0) nrot.x = -Math.PI / 2
    }
    else if(parts_type === "corner"){
      if(face==0) nrot.x = -Math.PI / 2
      else if(face==1) nrot.y = Math.PI / 2
    }
    this.tile.object3D.rotation.x=nrot.x
    this.tile.object3D.rotation.y=nrot.y
    this.tile.object3D.rotation.z=nrot.z


    this.tile.parentElement.object3D.rotation.copy(prot)

    this.new_move = undefined
    this.new_rad = undefined
    this.raycast_rotate_T = true
  },

  set_position(NP, PROT){

    const prot = PROT
    let np = NP
    nx = np.z, ny = np.x
    np.z = this.XX(-prot.y,nx, ny)
    np.x = this.YY(-prot.y,nx, ny)
    
    nx = np.y, ny = np.z
    np.y = this.XX(-prot.x,nx, ny)
    np.z = this.YY(-prot.x,nx, ny)
    
    nx = np.x, ny = np.y
    np.x = this.XX(-prot.z,nx, ny)
    np.y = this.YY(-prot.z,nx, ny)

    return np
  },

  Progress_rotate(){
    if(!this.tilePos) return
    const np = this.set_position(this.tilePos.point, this.partsRot)

    const pnp = this.start_pos

    let dist = {x:np.x - pnp.x, y:np.y - pnp.y, z:np.z - pnp.z}
    const parts_type = this.parts_type
    const parts_face = this.parts_face

    let nrot = {x:0, y:0, z:0}
    if(parts_type === "center"){
    }
    else if(parts_type === "edge"	){
      if(parts_face==0) nrot.x = -Math.PI / 2
    }
    else if(parts_type === "corner"){
      if(parts_face==0) nrot.x = -Math.PI / 2
      else if(parts_face==1) nrot.y = Math.PI / 2
    }

    dist = this.set_position(dist,nrot)
    // console.log(dist)
    
    let roteInde = -1
    let value = 0
    //  = (Math.abs(dist.x)>Math.abs(dist.y)?0:1)
    direi = 0.3

    if(Math.abs(dist.x) > direi){
      roteInde = 0
      value = dist.x
    }
    if(this.moves.length>1 && Math.abs(dist.y) > Math.abs(value) && Math.abs(dist.y) > direi){
      roteInde = 1
      value = dist.y
    }
    
    if(roteInde == -1)  return

    a = (value == Math.abs(value) ? -1 : 1 )
    // console.log(`value [${value}] direi [${direi* a}`)
    value += direi * a

    let raycast_rotate_T = true

    let faces_rad = this.faces_rad[this.moves[roteInde][0]]
    const RAD = Math.max(Math.min(value/1.5,Math.PI/2),-Math.PI/2)

    if(this.moves[roteInde].length>1) faces_rad *= -1

    if(this.raycast_rotate_T && this.new_move !== undefined && this.new_move != this.moves[roteInde]){
      // this.new_move
      // console.log()
      raycast_rotate(this.new_move, 0)
      // this.raycast_rotate_T = false
      // const Prad = this.new_rad
      // let Pfr = this.faces_rad[this.new_move[0]]
      // if(this.new_move.length>1) Pfr *= -1
      // const PMove_rad = Pfr * Prad * 180 / Math.PI
      // Compensation_anim(this.new_move,1000, PMove_rad, 0)
      // setTimeout(() => {
      //   this.raycast_rotate_T = true
      //   remove_animation(this.new_move)
      //   this.Progress_rotate()
      // },1010)
    }

    // this.new_rad = undefined
    // const vec = this.moves[roteInde].length>1?-1:1

    if(this.raycast_rotate_T)raycast_rotate(this.moves[roteInde], faces_rad * RAD)
    this.new_move = this.moves[roteInde]
    this.new_rad = RAD
  },

  Decision_rotate(){
    if(this.new_move !== undefined){
      const rad = this.new_rad
      let faces_rad = this.faces_rad[this.new_move[0]]
      if(this.new_move.length>1) faces_rad *= -1
      const Move_rad = faces_rad * rad * 180 / Math.PI

      if(Math.abs(rad) < 0.3){
        // raycast_rotate(this.new_move, 0)
        // console.log(`rad [${rad}] `)
        Compensation_anim(this.new_move,100, Move_rad, 0)
        return
      }

      // console.log(`rad [${rad}]`)
      let vec = rad>0?"":"'"
      if(this.new_move.length>1){
        if(rad>0) vec = "'"
        else      vec = ""
      }
      else{
        if(rad>0) vec = ""
        else      vec = "'"
      }



      // console.log(`this.new_move [${this.new_move}] solv [${this.new_move[0]+vec}]move [${this.new_move[0]}] vec [${vec}]`)

      if(this.new_move[0] > "Z"){
        scrambled_state = scrambled_state.hand_move(moves[this.new_move[0]+vec])
        color_data = color_re_set(this.new_move[0]+vec)
      }
      else{
        scrambled_state = scamble2state(scrambled_state,this.new_move[0]+vec)
      }
      one_rotate(scrambled_state, this.new_move[0]+vec)
      a = (Move_rad)>0?-90:90
      Compensation_anim(this.new_move,100, a + Move_rad, 0)

      
      const mode  = document.getElementById("scene").components["cube-mode"]
      mode.Ins_reset()
      // this.log.innerHTML = `moves [${move1}]<br>` + this.log.innerHTML
    }
  },

  XX (r,x,y) {return x*Math.cos(r)-y*Math.sin(r)},
  YY (r,x,y) {return x*Math.sin(r)+y*Math.cos(r)},
  // (){

  // }
})