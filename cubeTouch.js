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
    step_move:  {type: 'boolean', default: false},
	},	

	init() {
    // const icon = document.getElementById('ins-screen')
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

    
    const next = document.createElement('div')
    next.classList.add('next-step')
    map.append(next)

    
    // const pointer = document.createElement('div')
    // pointer.classList.add("pointer")
    // pointer.id="pointer"
    // list.append(pointer)

    this.next_step_buttont = next
    this.color_set_buttont = document.getElementsByClassName("color-set-buttont")[0]
    this.calculation_set_buttont = document.getElementsByClassName("calculation_set_buttont")[0]

    const folderTile = document.getElementsByClassName("folder-tile")
    console.log(folderTile)
    for(let i=0; i<folderTile.length; i++){
      folderTile[i].addEventListener("click", (e) => {
        // console.log(folderTile[i].parentElement)
        if(folderTile[i].parentElement.classList.value.includes("clause-folder"))
          folderTile[i].parentElement.classList.remove('clause-folder')
        else
          folderTile[i].parentElement.classList.add('clause-folder')
      })
    }

    this.next_step_buttont.addEventListener("click",(e) => {
      console.log("next_step_buttont")
			if(this.data.cube_mode !== "Execution")	return
      if(this.data.Execution_move)  return
      if(this.data.step_move) return

      const _list = document.getElementsByClassName("list")[0]

      this.now_step += 1
      hei = _list.children[this.now_step].offsetTop
      // console.log(_list.children[this.now_step])
      // console.log(_list.children[this.now_step].offsetTop)
      _list.scrollTo({
        top: hei - _list.clientHeight/2,
        left: 0,
        behavior: "smooth",
      })
      // const P = document.getElementById('pointer')
      // P.style.top = `${hei}px`
      
      this.data.step_move = true
      setTimeout(() => {this.data.Execution_move = true},400)
    })
    
		this.calculation_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free")	return
      this.Mode_set("Calculation")
			this.Button(e)
		})

		this.color_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free") return
      this.Mode_set("Input")
      const Colorset  = document.getElementById("camera2").components["color-set"]
      Colorset.Intiset()
			// console.log(`mode Change Input`)
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

    // console.log(`Viewpoint [${Viewpoint.data.Viewpoint}] Rotation [${Rotation.data.Rotation}] Colorset [${Colorset.data.Colorset}]`)
  },

  Ins_Complete(sum_solution){

    // for(sum of sum_solution)
    //   console.log(sum)
  
    const rotas = document.getElementsByClassName('rotas')
  
    const imgDiv = document.createElement('div')
    imgDiv.classList.add("img-div")
    const imgW = Math.ceil(Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight)*0.07)
    imgDiv.style.width = imgW
    imgDiv.style.height = imgW

    const img = document.createElement('img')
    img.classList.add('rotate-img')

    const line = document.getElementsByClassName('line')[0]
    const lineCount = parseInt(line.clientWidth / imgW)

    for(let i=0;i<sum_solution.length;i++){
      rotas[i].innerHTML = ''
      if(sum_solution[i].length == 0){
        continue
      }
      
      for(s=0;s<sum_solution[i].length;s++){
        const D = imgDiv.cloneNode(), I=img.cloneNode()
        I.src=`./img/${sum_solution[i][s]}.png`
        D.append(I)
        rotas[i].append(D)
      }      
      // console.log(`sum_solution [${sum_solution[i].length}]  lineCount [${lineCount}]`)
      rotas[i].style.width = `${Math.min(sum_solution[i].length, lineCount) * imgW}px`
      rotas[i].parentElement.style.height = `${Math.ceil(sum_solution[i].length / lineCount) * imgW}px`

    }

  
    sum_solution2 = sum_solution

    setTimeout(()=>{
      this.icon.style.display = "none"
      this.icon.classList.remove("rotate-ani")
      
      const Lhand = document.getElementById("L-hand")
      const Rhand = document.getElementById("R-hand")
      Lhand.object3D.visible = true
      Rhand.object3D.visible = true

      // this.data.Execution_move = true
      
      this.now_step = -1
      this.Mode_set("Execution")
    },100)
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
      console.log(`計算済み　リセット`)
      this.Mode_set("Free")
  },

  Button(e){
    this.icon.classList.add("rotate-ani")
    this.icon.style.display = "block"

    setTimeout(() =>{BBB()},2000)

    // else if(this.data.btn_mode === 1)	{
    //   // this.btn1.classList.add("un-pointer-events")
    //   solve_preview = true
    //   // this.btn1.children[0].innerHTML = 'moveing'
    //   this.data.one_sul_mode = false
    //   this.data.all_sul_mode = true
      
    //   const Lhand = document.getElementById("L-hand")
    //   const Rhand = document.getElementById("R-hand")
    //   Lhand.object3D.visible = true
    //   Rhand.object3D.visible = true

    //   this.Mode_set("Execution")
    //   // btn_mode = -1
    // }
    // else if(this.data.btn_mode === 0)	{
    //   console.log('Calculating')
    //   this.data.btn_mode = -1

    //   this.icon.style.display = "block"
    //   this.icon.classList.add("rotate-ani")

    //   this.Mode_set("Calculation")

    //   setTimeout(() =>{BBB()},20000)
    // }
    // console.log(e)
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

	tick() {
    if(this.data.Execution_move){
			motions()
			this.data.Execution_move = false
    }
	},
})