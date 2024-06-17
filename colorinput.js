const colorinput = () => ({
	schema: {
		Colorset: {type: 'boolean', default: false},
		ray: { type: 'selector' },
	},		

	init() {
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		
		this.mousePress = false
		this.touchPress = false
		this.touchId= undefined
    this.choiceColor = undefined

		this.scene = document.getElementById('scene')

    this.menu = document.getElementById('color-menu')
    colors = ["#1617ff","#ff1616","#15d832","#d88015","#ececec","#e9f121"]
    menu = this.menu.children
    for(let i=0; i<menu.length; i++)  menu[i].style.backgroundColor = colors[i]

    this.color_menu = document.getElementById('color-menu-screen')

		this.scene.addEventListener('mousedown', (e) => {
			if(!this.data.Colorset) return
			if(e.target.tagName !== 'CANVAS') return
      if(this.touchPress) return
      //this.mousePress || 
      this.parts = this.hit({x:e.offsetX , y:e.offsetY},".cube", "cube")
			if(!this.parts) return
      // this.mousePress = true
      this.Color_set(this.parts)
		})

		this.scene.addEventListener('touchstart', (e) => {
			if(!this.data.Colorset) return
			if(e.target.tagName !== 'CANVAS') return
      if(this.mousePress || this.touchPress) return
      if(e.touches.length>1)  return
      this.parts = this.hit({x:e.touches[0].clientX , y:e.touches[0].clientY},".cube", "cube")
			if(!this.parts) return
      this.touchPress = true
      this.touchId = e.touches[0].identifier
      this.Color_set(this.parts)
		})
    
		this.scene.addEventListener('touchend', (e) => {
			if(!this.touchPress)	return
			if(e.changedTouches[0].identifier ==this.touchId){
        this.touchId = undefined
        this.touchPress = false
      }
		})

    this.menu.addEventListener("click",(e) => {
      if(e.target.classList[0] != "menu-colors") return
      const id = parseInt(e.target.classList[1][1])
      console.log(id)
      if(this.choiceColor != id){
        if(this.choiceColor !== undefined)
          this.menu.children[this.choiceColor].classList.remove("choice-color")
        this.menu.children[id].classList.add("choice-color")
        this.choiceColor = id
      }
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

  Check_pos(type = undefined, index = undefined){
    const CTS={
      e: [275, 550, 1100, 2185, 240, 3840],
      c: [51, 102, 204, 153, 15, 240]
    }

    let D = this.cData
      
    function num(type, pos){
      let a = (2 ** 12) -1
      for(let n of pos)	a &= CTS[type][n]
      return ((Math.log2(a)<0)?-1:Math.log2(a))
    }
    let check = []
    for(let t of ["e","c"]){
      // console.log(t)
      for(let y of D[t]){
        check.push(num(t,y))
      }
    }

    let sum_c = 1
    for(let i of check) sum_c *= (i+1)
    // console.log(`sum_c [${sum_c>0}] [${check.join(',')}]`)
    if(sum_c == 0) {return false}
    
		let cp = check.slice(12)
		let co = []
    for(let i of D.c)
      co.push(i[0]>3?0:(i[1]>3?1:2))

		let ep = check.slice(0,12)
		let eo = []
    for(let i of D.e)
      eo.push((i[0]>3)?0:((i[1]>3)?1:((i[0]%2==0)?0:1)))

    let solved_state = new State(cp, co, ep, eo)
    console.log(solved_state)
    return solved_state
  },

  Color_set(parts){
    if(this.choiceColor == undefined){
      console.log("no Color")
      return
    }
    
    const choice_parts = parts.object.el.parentElement.id
    const regex = /[^a-z]/g;
    const regex2 = /[^0-9]/g;
    const parts_type = choice_parts.replace(regex, "")
    const be = choice_parts.replace(regex2, "")
    if(!(parts_type === "edge" || parts_type === "corner"))	return

    const pos = parts

    let num = 0
    if(parts_type === "edge"	)
      num = pos.face.normal.y > 0.707 ? 0 : 1
    else if(parts_type === "corner")
      num = pos.face.normal.y > 0.707 ? 0 : (pos.face.normal.x > 0.707 ? 1 : 2)

    console.log(`Color_set type [${parts_type}] num [${be}]index [${num}]`)
    face = {parts: parts.object.el, type: parts_type, Pindex: parseInt(be), Findex: num}
    console.log(face)

    
    const f = face.parts.object3D.children[0].children[0].children
    let Check_ans = false
    f[face.Findex].material.color = set_color_data[this.choiceColor]
    // console.log(`type [${face.type[0]}] Pin [${[face.Pindex]}] Fin [${face.Findex}]`)
    // console.log(this.cData)
    this.cData[face.type[0]][face.Pindex][face.Findex] = this.choiceColor
    this.cData.count[this.choiceColor] -= 1
    console.log(this.cData)
    Check_ans = this.Check_pos(face.type[0],face.Pindex)
    
    if(Check_ans === false) return

    // this.data.cube_mode="stay"
    const mode  = document.getElementById("scene").components["cube-mode"]
    mode.Color_completion(Check_ans)
    this.menu.style.display = "none"
  },

  Intiset(){
    this.menu.style.display = "flex"

    a=[],b=[]
    for(; a.length<12;)a.push([-1,-1])
    for(; b.length<8;)b.push([-1,-1,-1])
    this.cData={
      e: a,
      c: b,
      count: [8,8,8,8,8,8],
    }
    
    corner = document.getElementById("corner").children
    edge = document.getElementById("edge").children

    const gray = {r:0.5,g:0.5,b:0.5}
  
    for(let i=0;i<corner.length;i++){
      let F = corner[i].children[0].object3D.children[0].children[0].children
      for(let s=0;s<3;s++)
        F[s].material.color = gray
    }
  
    for(let i=0;i<edge.length;i++){
      let F = edge[i].children[0].object3D.children[0].children[0].children
      for(let s=0;s<2;s++)
        F[s].material.color = gray
    }
  },

  XX (r,x,y) {return x*Math.cos(r)-y*Math.sin(r)},
  YY (r,x,y) {return x*Math.sin(r)+y*Math.cos(r)},
})