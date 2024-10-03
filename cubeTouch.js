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
    // center.children[2].children[0].removeAttribute("gltf-model")
    // center.children[2].children[0].setAttribute("gltf-model","#model_frame_edge")

    this.Rotation_Angle = {
      e: [
        [-30,-160],
        [-30,160],
        [-30,40],
        [-30,-40],
        
        [-30,160],
        [-30,40],
        [-30,40],
        [-30,-40],
        
        [30,160],
        [30,40],
        [30,40],
        [30,-40],
      ],
      
      c: [
        [-30,-160],
        [-30,160],
        [-30,40],
        [-30,-40],
        
        [30,-160],
        [30,160],
        [30,40],
        [30,-40],  
      ]
    }

    this.parts__Angle = [
      10,10,10,10,  6,6,6,6,  2,2,2,2,
    ]

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

    
    const next = document.querySelector('.next-step-div')
    // next.classList.add('next-step')
    // map.append(next)

    
    // const pointer = document.createElement('div')
    // pointer.classList.add("pointer")
    // pointer.id="pointer"
    // list.append(pointer)

    this.next_step_buttont = next
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

    this.next_step_buttont.addEventListener("click",(e) => {
			if(this.data.cube_mode !== "Execution")	return
      if(this.data.Execution_move)  return
      if(this.data.step_move) return
      if(this.now_step == 15){
        console.log(`next_step_buttont 既に完成している`)
        return
      }

      const _list = document.querySelector(".list")

      this.now_step += 1
      
      hei = _list.children[this.now_step].offsetTop

      St = document.querySelectorAll(`.step${this.now_step}`)
      for(let i=0;i<St.length;i++)
        St[i].classList.add("now-step")

      _list.scrollTo({
        top: hei - _list.clientHeight/2,
        left: 0,
        behavior: "smooth",
      })
      
      console.log(`\n\n [${this.now_step}] ステップ`)
      if(!timeList.stepSkip[this.now_step]){
        console.log(`スキップ [${this.now_step}]`)
        return
      }

      this.data.step_move = true

      timeList.rote_re_start()

      // console.log("")
      // hand_xyz.length=0
      // Angle_xyz.length = 0

      
      // if(this.now_step==12){
      //   pointM(frame_pos, false)
      //   typeName = frame_pos[0]=="corner"?"corner":"edge"
      //   type = frame_pos[0]=="corner"?"frame_corner":"frame_edge"
      //   const frame=document.getElementById(`frame_${typeName}`)
      //   const Pframe=document.getElementById(`frame`)

      //   if(Pframe.classList.value.includes(typeName)){
      //   	frame.setAttribute("visible",false)
      //   	Pframe.classList.remove(typeName)
      //   }
      // }
      // if(this.now_step<12){
      //   pointM(frame_pos, false)
      //   frame_rotate(undefined, this.now_step, 500, false)
      //   // Angle_move(undefined, this.now_step,500)
      // }

      // console.log("/////  sum_solution2[0].length==0")
      // console.log(sum_solution2)
      // if(sum_solution2[0].length==0 || sum_solution2[0].length==1 && sum_solution2[0]=="")  {
      //   // console.log("/////  sum_solution2[0].length==0")
      //   sum_solution2.shift()
      //   if(sum_solution2.length == 0){
      //     movementCount = -1
      //     move180 = false
      //     this.Complete()
      //   }
      // }
      // else{
      //   setTimeout(() => {
      //     this.data.Execution_move = true
      //   },100)
      // }
    })
    
		this.calculation_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free")	return
      this.Mode_set("Calculation")
			this.Calculation()
		})

		this.color_set_buttont.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "Free") return
      this.Mode_set("Input")
      const Colorset  = document.getElementById("camera2").components["color-set"]
      Colorset.Intiset()
			// console.log(`mode Change Input`)
		})

    
    a=document.getElementsByClassName("meter-out")
    
    rote_speed_metar = new metar(a[0].classList[1], a[0], 0.2, 10, 4, true)
    // console.log({rote_speed_metar})
    hnd_opacity_metar = new metar(a[1].classList[1], a[1], 0.1, 1, 1, false)
    // console.log({rote_speed_metar})
    
    this.Mode_set("Free")
	},

  step_completion(){
    // console.log(`cube mode step_completion`)
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

    }
  },
    		
  Mode_set(Nmode){
    this.data.cube_mode = Nmode
    const Viewpoint = document.getElementById("camera2").components["camera-view"]
    const Rotation  = document.getElementById("camera2").components["cube-rotate"]
    const Colorset  = document.getElementById("camera2").components["color-set"]
    const presskey  = document.getElementById("scene").components["press-key-board"]
    

    Viewpoint.data.Viewpoint = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Viewpoint"]]
    Rotation.data.Rotation   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Rotation"]]
    Colorset.data.Colorset   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Colorset"]]
    presskey.data.Rotation   = this.data.mode_list[this.data.cube_modes[this.data.cube_mode]][this.data.cube_modes["Rotation"]]

    // console.log(`Viewpoint [${Viewpoint.data.Viewpoint}] Rotation [${Rotation.data.Rotation}] Colorset [${Colorset.data.Colorset}]`)
  },

  Ins_Complete(Sol){
    const imgW = Math.ceil(Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight)*0.07)

    const rotas = document.getElementsByClassName('rotas')
  
    const imgDiv = document.createElement('div')
    imgDiv.classList.add("img-div")
    imgDiv.style.width = imgW
    imgDiv.style.height = imgW

    const pimgDiv = document.createElement('div')
    pimgDiv.classList.add("img-div-back")
    imgDiv.append(pimgDiv)

    const img = document.createElement('img')
    img.classList.add('rotate-img')

    const line = document.getElementsByClassName('line')[0]
    const lineCount = parseInt(line.clientWidth / imgW)

    for(let i=0;i<Sol.length;i++){
      rotas[i].innerHTML = ''
      if(Sol[i].length == 0){
        const D = imgDiv.cloneNode(), I=img.cloneNode()
        // D.classList.remove("img-div")
        I.src=`./img/skip.png`
        I.style.width = `${3 * imgW}px`
        rotas[i].parentElement.style.height = `${imgW}px`
        // D.append(I)
        rotas[i].append(I)
        continue
      }
      let len = 0
      for(s=0;s<Sol[i].length;s++){
        if(Sol[i][s].length>2){
          len += 1
          const D = imgDiv.cloneNode(), I=img.cloneNode()
          D.classList.remove("img-div")
          I.src=`./img/(.png`
          D.append(I)
          rotas[i].append(D)
        }
        for(j of Sol[i][s].split(" ")){
          len += 1
          const D = imgDiv.cloneNode(true), I=img.cloneNode()
          I.src=`./img/${j}.png`
          D.append(I)
          rotas[i].append(D)
        }
        if(Sol[i][s].length>2){
          len += 1
          const D = imgDiv.cloneNode(), I=img.cloneNode()
          D.classList.remove("img-div")
          I.src=`./img/).png`
          D.append(I)
          rotas[i].append(D)
        }
      }      
      // console.log(`sum_solution [${sum_solution[i].length}]  lineCount [${lineCount}]`)
      rotas[i].style.width = `${Math.min(len, lineCount) * imgW}px`
      rotas[i].parentElement.style.height = `${Math.ceil(len / lineCount) * imgW}px`

    }

    
    timeList.imgSpeed = getRuleBySelector(".img-div-back")
    console.log(timeList.imgSpeed)

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
    timeList.animation_re_set()
    
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

	// tick() {
  //   if(this.data.Execution_move){
	// 		motions()
	// 		this.data.Execution_move = false
  //   }
	// },
})