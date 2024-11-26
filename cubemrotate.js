 const cubemrotate = () => ({
	schema: {
		Rotation: {type: 'boolean', default: false},
		ray: { type: 'selector' },
	},		

	init() {
		const camOut = document.getElementById("camOut")
		const camIn = document.getElementById("camIn")
		
		this.mousePress = false
		this.touchPress = false
		this.touchId= undefined

    
		this.faces_rad = {
			"U":-1, "D":1, "L":1, "R":-1, "B":1, "F":-1, "y":-1, "x":-1, "z":-1, 
		}

		this.scene = document.getElementById('scene')

    const tile_out = document.createElement('a-entity')
    const tile_in = document.createElement('a-plane')
    tile_out.id="tile-out"

    // const tile_box = document.createElement('a-box')
    // tile_box.id="cub-box"
    // tile_box.classList.add("clickable","cube")
    // tile_box.setAttribute("position","0 0 0")
    // tile_box.setAttribute("width","3.1")
    // tile_box.setAttribute("height","3.1")
    // tile_box.setAttribute("depth","3.1")
    // tile_box.setAttribute("material",{
    //    _visible: false, opacity:0.2, color: "#F00", side: 2 
    // })
    // document.getElementById("root").appendChild(tile_box)
    // tile_box.object3D.width=0.05
    // tile_box.object3D.height=0.05
    // tile_box.object3D.deep=4

    tile_in.id="tile"
    tile_in.setAttribute("width","50")
    tile_in.setAttribute("height","50")
    tile_in.setAttribute("material",{
       visible: false, //opacity:0.3, color: "#AAF", side: 2 
    })
    tile_in.classList.add("clickable","tile")
    
    tile_out.appendChild(tile_in)
    this.scene.appendChild(tile_out)

    this.tile = tile_in


		this.scene.addEventListener('mousedown', (e) => {
			if(!this.data.Rotation) return
			if(e.target.tagName !== 'CANVAS') return
      if(this.mousePress || this.touchPress) return
      this.parts = this.hit({x:e.offsetX , y:e.offsetY},".cube, .sky", "cube")
      // console.log(this.parts.point)
			if(!this.parts) return
      this.search_parts()	
      this.mousePress = true
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
      // console.log(e)
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
      //  console.log("identifier touchend")
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

		else if(intersects[0].object.el.classList[1]==hitName){
      // if(hitName=="cube"){
      //   text=["\n"]
      //   for(t of intersects){
      //       a=""
      //       a+=`id [${t.object.el.id}] `
      //       a+=`point [x:${Math.round(t.point.x*100)/100} y:${Math.round(t.point.y*100)/100} z:${Math.round(t.point.z*100)/100} ] `
      //       text.push(a)
      //   }
      //   // console.log(text.join(",\n"))
      // }
			return intersects[0]
    } 

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
      
      ["L"],["B'"],
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
      ["U'","F'"],
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
    const parts_rot = {
      co:[
        {x:0, y:180, z:0},
        {x:0, y:90, z:0},
        {x:0, y:0, z:0},
        {x:0, y:-90, z:0},
        {x:0, y:-90, z:180},
        {x:0, y:180, z:180},
        {x:0, y:90, z:180},
        {x:0, y:0, z:180},
      ],
      ce:[
        {x:0, y:180, z:0},
        {x:0, y:90, z:0},
        {x:0, y:0, z:0},
        {x:0, y:-90, z:0},
        {x:-90, y:0, z:0},
        {x:90, y:0, z:0},
      ],
      ed:[
        {x:0, y:-90, z:90},
        {x:0, y:90, z:-90},
        {x:0, y:90, z:90},
        {x:0, y:-90, z:-90},

        {x:0, y:180, z:0},
        {x:0, y:90, z:0},
        {x:0, y:0, z:0},
        {x:0, y:-90, z:0},
        
        {x:0, y:180, z:180},
        {x:0, y:90, z:180},
        {x:0, y:0, z:180},
        {x:0, y:-90, z:180},
      ],
    }
    const partsNamt = this.parts.object.parent.userData.name

  //  console.log(`search_part ${partsNamt} name ${this.parts.object.name}`)
  //  console.log(this.parts)


    const parts_type = partsNamt.slice(0,2)
    const be = parseInt(partsNamt.slice(2,4))
    const face = parseInt(this.parts.object.name.at(-1)) - 3
    if(!(parts_type === "ed" || parts_type === "ce" || parts_type === "co"))	return

    const pos = this.parts
    let num = 0
    
    text=`name [${this.parts.object.name}] parts_type [${parts_type}] be [${be}] face [${face}]\n`

    if(parts_type === "ce"){
      num = be
      text+=`center num [${num}] face [${face}]\n`
    }
    else if(parts_type === "ed"	){
      num = be*2 + 6
      num += face
      text+=`edge num [${num}] face [${face}]\n`
    }
    else if(parts_type === "co"){
      num = be*3 + 30
      num += face
      text+=`corner num [${num}] face [${face}]\n`
    }

    this.parts_type = parts_type
    this.parts_face = face
    this.moves = cubeTileMove[num]

    const prot = {
      x:parts_rot[parts_type][be].x*Math.PI/180,
      y:parts_rot[parts_type][be].y*Math.PI/180,
      z:parts_rot[parts_type][be].z*Math.PI/180,
    }
  //  console.log("set_position cube.posi")
    const np = this.set_position({...pos.point}, prot)

  //  console.log(prot)
  //  console.log(np)


    this.start_pos = np
    this.partsRot = prot
    
    let nrot = {x:0, y:0, z:0}
    if(parts_type === "ce"){
    }
    else if(parts_type === "ed"	){
      if(face==0) nrot.x = -90
    }
    else if(parts_type === "co"){
      if(face==0) nrot.x = -90
      else if(face==1) nrot.y = 90
    }
    this.tile.setAttribute("rotation", {...nrot})

    this.tile.parentElement.setAttribute("rotation", {...parts_rot[parts_type][be]})
    this.tile.parentElement.setAttribute("position", {...pos.point})

    // text+=`out\n`
    // text+=`  pos x[${this.tile.parentElement.object3D.position.x}] y[${this.tile.parentElement.object3D.position.y}] z[${this.tile.parentElement.object3D.position.z}]\n`
    // text+=`  rot x[${this.tile.parentElement.object3D.rotation.x}] y[${this.tile.parentElement.object3D.rotation.y}] z[${this.tile.parentElement.object3D.rotation.z}]\n`

    // text+=`in\n`
    // text+=`  pos x[${this.tile.object3D.position.x}] y[${this.tile.object3D.position.y}] z[${this.tile.object3D.position.z}]\n`
    // text+=`  rot x[${this.tile.object3D.rotation.x}] y[${this.tile.object3D.rotation.y}] z[${this.tile.object3D.rotation.z}]\n`
    
    // text+=`tile\n`
    // text+=`  rot x[${nrot.x}] y[${nrot.y}] z[${nrot.z}]\n`
    
  //  console.log(text)

    this.new_move = undefined
    this.new_rad = undefined
    this.raycast_rotate_T = true
  },

  set_position(NP, PROT){

    const prot = PROT
    let np = {...NP}
    nx = np.z, ny = np.x
    np.z = this.XX(-prot.y,nx, ny)
    np.x = this.YY(-prot.y,nx, ny)
    
    nx = np.y, ny = np.z
    np.y = this.XX(-prot.x,nx, ny)
    np.z = this.YY(-prot.x,nx, ny)
    
    nx = np.x, ny = np.y
    np.x = this.XX(-prot.z,nx, ny)
    np.y = this.YY(-prot.z,nx, ny)

  //  console.log(
    //   `point x ${Math.round(NP.x*100)/100} y ${Math.round(NP.y*100)/100} z ${Math.round(NP.z*100)/100}\n`,
    //   `rotat x ${Math.round(PROT.x*100)/100} y ${Math.round(PROT.y*100)/100} z ${Math.round(PROT.z*100)/100}\n`,
    //   `new p x ${Math.round(np.x*100)/100} y ${Math.round(np.y*100)/100} z ${Math.round(np.z*100)/100}`,
    // )
    return np
  },

  Progress_rotate(){
    if(!this.tilePos) return
    // console.log("set_position tile.posi")
    const np = this.set_position(this.tilePos.point, this.partsRot)

    const pnp = this.start_pos

    let dist = {x:np.x - pnp.x, y:np.y - pnp.y, z:np.z - pnp.z}
    const parts_type = this.parts_type
    const parts_face = this.parts_face

    // console.log(
    //   `GP x ${Math.round(np.x*100)/100} y ${Math.round(np.y*100)/100} z ${Math.round(np.z*100)/100}\n`,
    //   `SP x ${Math.round(pnp.x*100)/100} y ${Math.round(pnp.y*100)/100} z ${Math.round(pnp.z*100)/100}\n`,
    //   `-d x ${Math.round(dist.x*100)/100} y ${Math.round(dist.y*100)/100} z ${Math.round(dist.z*100)/100}`,
    // )

    // console.log(`type [${parts_type}] face [${parts_face}]`)

    let nrot = {x:0, y:0, z:0}
    if(parts_type === "n"){
    }
    else if(parts_type === "e"	){
      if(parts_face==0) nrot.x = -Math.PI / 2
    }
    else if(parts_type === "c"){
      if(parts_face==0) nrot.x = -Math.PI / 2
      else if(parts_face==1) nrot.y = Math.PI / 2
    }

    // console.log("set_position dist.posi")
    dist = this.set_position(dist,nrot)
    // console.log(dist)
    
    let roteInde = -1
    let value = 0
    //  = (Math.abs(dist.x)>Math.abs(dist.y)?0:1)
    direi = 0.2

    if(Math.abs(dist.x) > direi){
      roteInde = 0
      value = dist.x
    }
    if(this.moves.length>1 && Math.abs(dist.y) > Math.abs(value) && Math.abs(dist.y) > direi){
      roteInde = 1
      value = dist.y
    }
    if(roteInde == -1)  return

    let move = this.moves[roteInde]
    if(value < 0) move = move_reverse[move]
    value=Math.abs(value) - direi
    value = Math.max(Math.min(value/2.5,1),-1)

    // console.log(
    //   `  name [${this.moves[roteInde]}] value ${value}\n`,
    //   `N name [${move}] value ${Math.abs(value)}`,
    // )

    if(this.raycast_rotate_T && this.new_move !== undefined && this.new_move != move){
      // this.new_move
      // console.log()
      // raycast_rotate(this.new_move, 0)
      full_cube.removeAttribute("my-animation")
      full_cube.setAttribute("my-animation",{clip: move, frame: value})
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
    if(this.raycast_rotate_T && this.new_move == undefined){
      full_cube.removeAttribute("my-animation")
      full_cube.setAttribute("my-animation",{clip: move, frame: value})
    }

    this.new_rad = undefined
    // const vec = this.moves[roteInde].length>1?-1:1

    if(this.raycast_rotate_T){
      // raycast_rotate(move, value)
      full_cube.components["my-animation"].setFrame(value)
    //  console.log(`moves ${move} rad ${value}`)
    }
    this.new_move = move
    this.new_rad = value
  },

  Decision_rotate(){
    if(this.new_move !== undefined){
      const rad = this.new_rad
      const move = this.new_move

      // console.log(`\n ******** Decision_rotate rad ${rad}`)
      if(rad < 0.125){
        // console.log(`             d < 0.2`)
        // raycast_rotate(move, 0)
        full_cube.removeAttribute("my-animation")
        full_cube.setAttribute("my-animation",{clip: move, start: rad, end: 0, timeScale: 10})
        // Compensation_anim(move_reverse[move],100, 1 - rad)

        return
      }

      // console.log(`move [${move}] solv [${move}]move [${move[0]}] vec [${vec}]`)

      if(move[0] > "Z"){
        scrambled_state = scrambled_state.hand_move(moves[move])
        color_data = color_re_set(move)
      }
      else{
        scrambled_state = scamble2state(scrambled_state,move)
      }
      one_rotate(scrambled_state, move)
      full_cube.removeAttribute("my-animation")
      full_cube.setAttribute("my-animation",{
        clip: move_reverse[move], start: 1 - rad, end: 0, timeScale: 10})
      // raycast_rotate(move, 0)
      // Compensation_anim(move,100, rad)

      
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