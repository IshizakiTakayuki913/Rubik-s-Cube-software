const cubemode = () => ({
	schema: {
		Execution_move: {type: 'boolean', default: false},
		all_sul_mode: {type: 'boolean', default: false},
    btn_mode: {type: 'int', default: 0},
    solve_time: {type: 'int', default: -1},
		cube_mode: {type: 'string', default: "Free"},
		cube_modes: {default: 
			{
        "Free":         0,
        "Calculation":  1,
        "Execution":    2,
        "Input":        3,
        "learning":     4,
        "Viewpoint":    0,
        "Rotation":     1,
        "Colorset":     2,
      }
		},
		mode_list: {default: 
			[
        [ true,  true, false],
        [false, false, false],
        [ true, false, false],
        [ true, false,  true],
        [ true,  true, false],
      ]
		},
    Viewpoint: {type: 'boolean', default: false},
    Rotation: {type: 'boolean', default: false},
    Colorset: {type: 'boolean', default: false},
    face_select: {type: 'boolean', default: false},
    step_move:  {type: 'boolean', default: false},
	},	

	init() {
    // center.children[2].children[0].removeAttribute("gltf-model")
    // center.children[2].children[0].setAttribute("gltf-model","#model_frame_edge")

    this.load_end = true

    const canvas = document.createElement("canvas")
    canvas.id="icon"
    canvas.style.width = "40vmin"
    canvas.style.height = "40vmin"
    canvas.classList.add("load-icon")

    const ctx = canvas.getContext("2d")
    canvas.width = 300
    canvas.height = 300
    const w = 300
    ctx.lineWidth = w/10
    let fanwisegradient = ctx.createConicGradient(-0.2, w/2, w/2);
    fanwisegradient.addColorStop(0,   '#000');
    fanwisegradient.addColorStop(0.3, '#000');
    fanwisegradient.addColorStop(0.6, '#fff');
    fanwisegradient.addColorStop(0.8, '#CCCCCC00');
    ctx.strokeStyle = fanwisegradient;
    ctx.lineCap = "round";
    ctx.beginPath()
    ctx.arc(w/2, w/2, w/2-ctx.lineWidth/2, 0, 1.6*Math.PI)
    ctx.stroke()
    document.getElementsByTagName("body")[0].append(canvas)
    this.icon = canvas


    const iframe = document.getElementById('iframe')
    iframe.width = 100
    iframe.height = 100


    const map = document.getElementsByClassName('sulves-map')[0]
    const list = document.createElement('div')
    const line = document.createElement('div')
    const rotas = document.createElement('div')

    list.classList.add("list")
    line.classList.add("line")
    rotas.classList.add("rotas")
    
    line.append(rotas)

    for(let i=0;i<16;i++)
      list.append(line.cloneNode(true))

    map.append(list)

    
    // next.classList.add('next-step')
    // map.append(next)

    
    // const pointer = document.createElement('div')
    // pointer.classList.add("pointer")
    // pointer.id="pointer"
    // list.append(pointer)

    this.color_set_buttont = document.getElementsByClassName("color-set-buttont")[0]
    this.calculation_set_buttont = document.getElementsByClassName("calculation_set_buttont")[0]

    const folderTile = document.getElementsByClassName("folder-tile")
    // console.log(folderTile)
    for(let i=0; i<folderTile.length; i++){
      folderTile[i].addEventListener("click", (e) => {
        // console.log(folderTile[i].parentElement)
        if(folderTile[i].parentElement.classList.value.includes("clause-folder")){
          folderTile[i].parentElement.classList.remove('clause-folder')
          
        }
        else{
          folderTile[i].parentElement.classList.add('clause-folder')

        }
      })
    }
    
		this.calculation_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode == "Free"){
        this.Mode_set("Calculation")
        this.Calculation()
      }
      else if(this.data.cube_mode == "Execution"){
        execution_btn_func()
      }
		})

		this.color_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free") return
      this.Mode_set("Input")
      const Colorset  = document.getElementById("camIn").components["color-set"]
      Colorset.Intiset()
			// console.log(`mode Change Input`)
		})

    
    a=document.getElementsByClassName("meter-out")
    
    this.rote_speed_metar = new metar({
      id: a[1].classList[1],
      el: a[1],
      start: 0.2,
      end: 10,
      value: 4,
      dx: 0.2,
      constSet: true,
      callbackfunc: {func1: this, func2: "meter"},
      count_Disp: a[1].nextElementSibling,
    })

    this.hnd_opacity_metar = new metar({
      id: a[2].classList[1],
      el: a[2],
      start: 0,
      end: 1,
      value: 1,
      dx: 0.1,
      constSet: false,
      callbackfunc: {func1: this, func2: "meter"},
      count_Disp: a[2].nextElementSibling,
    })
    
    this.Mode_set("Free")
	},

  step_completion(){
    console.log(`cube mode step_completion`)
    this.data.step_move = false

    if(this.now_step == 15){
      console.log(`cubemode 全て完成`)
      this.Complete()
    }
  },

  meter(data){
    // console.log(`meter`)
    // console.log(data)
    switch(data.id){
      case "spped-meter":
        rote_speed = data.value
        break 

      case "hand-opacity-meter":
        // console.log("asdasdasd")
        const Lhand = document.getElementById('L-hand')
        const Rhand = document.getElementById('R-hand')

        // console.log(Lhand)
        Lhand.object3D.traverse( (child) => {
          if(child.type == "SkinnedMesh") {
            // child.material.transparent = true
            child.material.opacity = data.value
          }
        })
        Rhand.object3D.traverse( (child) => {
          if(child.type == "SkinnedMesh") {
            // child.material.transparent = true
            child.material.opacity = data.value
          }
        })
        break 
        
      case "time-meter":

        break

    }
  },
    		
  Mode_set(Nmode){
    // console.error(`Nmode: ${Nmode}`)

    this.data.cube_mode = Nmode
    const Viewpoint = document.getElementById("camIn").components["camera-view"]
    const Rotation  = document.getElementById("camIn").components["cube-rotate"]
    const Colorset  = document.getElementById("camIn").components["color-set"]
    const presskey  = document.getElementById("scene").components["press-key-board"]
    

    Viewpoint.data.Viewpoint = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Viewpoint"]]
    Rotation.data.Rotation   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Rotation"]]
    Colorset.data.Colorset   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Colorset"]]
    presskey.data.Rotation   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Rotation"]]

    // console.log(`Viewpoint [${Viewpoint.data.Viewpoint}] Rotation [${Rotation.data.Rotation}] Colorset [${Colorset.data.Colorset}]`)
  },

  Ins_Complete(){
    this.icon.style.display = "none"
    this.icon.classList.remove("rotate-ani")
    
    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = true
    Rhand.object3D.visible = true

    
    this.now_step = -1
    this.Mode_set("Execution")
  },

  Complete(){
    
		// this.btn1.children[0].innerHTML = 'Complete'
    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = false
    Rhand.object3D.visible = false

    this.Mode_set("Free")
  },

  Ins_reset(){
      // console.log(this.NextMove)
      // console.log(`計算済み　リセット`)
      this.Mode_set("Free")
  },

  Calculation(){
    this.icon.classList.add("rotate-ani")
    this.icon.style.display = "block"

    setTimeout(() =>{BBB()},100)
  },

  hand_move(moves){
    // console.log(`debug hand_move`)
    
    sum_solution2 = [moves.split(" ")]

    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = true
    Rhand.object3D.visible = true

    // this.btn1.children[0].innerHTML = 'moveing'
  },

  Color_completion(Check_ans){
    this.color_solve = Check_ans
    scrambled_state = Check_ans
    // color_set(scrambled_state)
    // one_rotate()
    // set_color_data[color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
    this.Mode_set("Free")
  },
  modeleData(
    _full_cube, _model_centers, _model_corners, _model_edges,
    _bone_centers, _bone_corners, _bone_edges,
    _L_hand, _R_hand,
    _bone_L_hand, _bone_R_hand, 
    _bone_name_model, _frameObj
  ){
    console.log(`cube mode modeleData`)

    full_cube = _full_cube
    model_centers = _model_centers
    model_corners = _model_corners
    model_edges = _model_edges
    bone_centers = _bone_centers
    bone_corners = _bone_corners
    bone_edges = _bone_edges
    L_hand = _L_hand
    R_hand = _R_hand
    bone_L_hand = _bone_L_hand
    bone_R_hand = _bone_R_hand, 
    bone_name_model = _bone_name_model
    frameObj = _frameObj


    timeList = new motionList(
      _full_cube, _model_centers, _model_corners, _model_edges,
      _bone_centers, _bone_corners, _bone_edges,
      _L_hand, _R_hand,
      _bone_L_hand, _bone_R_hand, 
      _bone_name_model, _frameObj
    )

    color_set(scrambled_state)
    this.load_end = false
  },
  timeLise_push(){
    if(this.load_end) return undefined
    console.log("frameCube timeLise_push")
    return timeList
  },
})