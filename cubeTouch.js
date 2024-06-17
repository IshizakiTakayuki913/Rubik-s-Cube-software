const cubemode = () => ({
	schema: {
		one_sul_mode: {type: 'boolean', default: true},
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
        "Viewpoint":    0,
        "Rotation":     1,
        "Colorset":     2,
      }
		},
		mode_list: {default: 
			[
        [true,  true,   false],
        [false, false,  false],
        [true,  false,  false],
        [true,  false,  true],
      ]
		},
    Viewpoint: {type: 'boolean', default: false},
    Rotation: {type: 'boolean', default: false},
    Colorset: {type: 'boolean', default: false},
    face_select: {type: 'boolean', default: false},
	},	

	init() {
		this.btn1 = document.getElementById("btn1")
		this.btn2 = document.getElementById("btn2")
  
    const icon = document.getElementById('ins-screen')
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

    icon.appendChild(canvas)


		this.btn1.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free")	return
      
			// if(this.data.cube_mode !== "Calculation")	return
			this.Button(e)
		})

		this.btn2.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free") return
      this.Mode_set("Input")
      const Colorset  = document.getElementById("camera2").components["color-set"]
      Colorset.Intiset()
			console.log(`mode Change Input`)
		})
    
    this.Mode_set("Free")
	},

  Mode_set(Nmode){
    this.data.cube_mode = Nmode
    const Viewpoint = document.getElementById("camera2").components["camera-view"]
    const Rotation  = document.getElementById("camera2").components["cube-rotate"]
    const Colorset  = document.getElementById("camera2").components["color-set"]

    Viewpoint.data.Viewpoint = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Viewpoint"]]
    Rotation.data.Rotation   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Rotation"]]
    Colorset.data.Colorset   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Colorset"]]

    console.log(`Viewpoint [${Viewpoint.data.Viewpoint}] Rotation [${Rotation.data.Rotation}] Colorset [${Colorset.data.Colorset}]`)
  },

  Ins_Complete(){
    this.data.btn_mode = 1
    document.getElementById("ins-screen").style.display = "none"
    const icon = document.getElementById("icon")
    icon.classList.remove("rotate-ani")
    
    this.Mode_set("Free")
  },

  Complete(){
		this.data.btn_mode = 0
		this.data.all_sul_mode = false
		
		this.btn1.children[0].innerHTML = 'Complete'
    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = false
    Rhand.object3D.visible = false
    
    this.Mode_set("Free")
  },

  Ins_reset(){
    if(this.data.btn_mode == 1 && this.data.one_sul_mode){
      // console.log(this.NextMove)
      console.log(`計算済み　リセット`)
      this.btn1.children[0].innerHTML = 'Solve'
      this.data.btn_mode = 0
      this.Mode_set("Free")
    }
  },

  Button(e){
    if(this.data.all_sul_mode)	return

    if(this.data.btn_mode < 0)	return
    else if(this.data.btn_mode === 1)	{
      // this.btn1.classList.add("un-pointer-events")
      solve_preview = true
      this.btn1.children[0].innerHTML = 'moveing'
      this.data.one_sul_mode = false
      this.data.all_sul_mode = true
      
      const Lhand = document.getElementById("L-hand")
      const Rhand = document.getElementById("R-hand")
      Lhand.object3D.visible = true
      Rhand.object3D.visible = true

      this.Mode_set("Execution")
      // btn_mode = -1
    }
    else if(this.data.btn_mode === 0)	{
      console.log('Calculating')
      this.btn1.children[0].innerHTML = 'Calculating'
      // this.btn1.classList.add("un-pointer-events")
      this.data.btn_mode = -1

      document.getElementById("ins-screen").style.display = "block"

      const icon = document.getElementById("icon")
      icon.classList.add("rotate-ani")

      this.Mode_set("Calculation")

      setTimeout(() =>{BBB()},100)
    }
    // console.log(e)
  },

  hand_move(moves){
    // console.log(`debug hand_move`)

    if(this.data.all_sul_mode)	return
    if(this.data.btn_mode < 0)	return
    
    sum_solution2 = [moves.split(" ")]
    solve_preview = false
    this.data.btn_mode = 1

    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = true
    Rhand.object3D.visible = true

    this.btn1.children[0].innerHTML = 'moveing'
    this.data.one_sul_mode = false
    this.data.all_sul_mode = true
    
  },

  Color_completion(Check_ans){
    this.color_solve = Check_ans
    scrambled_state = Check_ans
    // color_set(scrambled_state)
    this.Mode_set("Free")
  },

	tick() {
		if(!this.data.one_sul_mode){
			motions()
			this.data.one_sul_mode = true
		}
	},
})
