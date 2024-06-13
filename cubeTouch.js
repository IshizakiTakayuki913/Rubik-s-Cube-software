const cubemode = () => ({
	schema: {
		one_sul_mode: {type: 'boolean', default: true},
		all_sul_mode: {type: 'boolean', default: false},
    btn_mode: {type: 'int', default: 0},
    solve_time: {type: 'int', default: -1},
		cube_mode: {type: 'string', default: "stay"},
		cube_modes: {type: 'array', default: 
			["stay", "sovle", "set"]
		},
    face_select: {type: 'boolean', default: false},
	},	

	init() {
		// const btn1 = document.getElementById("btn1")
		// const btn2 = document.getElementById("btn2")
		this.btn1 = document.getElementById("btn1")
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
    // console.log(ctx.width)
    ctx.lineWidth = w/10


    // ctx.fillStyle = "#F9A"
    // ctx.fillRect(0, 0, w,w)

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

    const rad=Math.PI/3,Rin=60,Rout=100,count=5
    function XX (r,x,y) {return x*Math.cos(r)-y*Math.sin(r)}
    function YY (r,x,y) {return x*Math.sin(r)+y*Math.cos(r)}

    let text = ``
    text += `M ${Rin} ${0} `
    for(let i=0;i<=count+1;i++)
      text += `L ${Rout*Math.cos(rad/(count+1)*i)} ${Rout*Math.sin(rad/(count+1)*i)} `
    for(let i=count+1;i>=0;i--)
      text += `L ${Rin*Math.cos(rad/(count+1)*i)} ${Rin*Math.sin(rad/(count+1)*i)} `
    text += `L ${Rin} ${0} Z`
    
    const menu = document.getElementById('color-menu')
    for(let i=0;i<6;i++){
      const out_clip = document.createElement('div')
      const clip = document.createElement('div')
      const color = set_color_data[i]
      // console.log(color)
      
      clip.classList.add('sector')
      clip.style.clipPath = `path('${text}')`
      clip.style.opacity = 0.6
      clip.style.translate = `50% 50%`
      clip.style.background = `rgb(${parseInt(color.r*255)},${parseInt(color.g*255)},${parseInt(color.b*255)})`
      
	    out_clip.style.position = "absolute"
      out_clip.style.translate = `-50% -50%`
      out_clip.style.transform = `rotate(${i*60}deg)`
      out_clip.id=`c${i}`
      out_clip.appendChild(clip)
      menu.appendChild(out_clip)


    }
    this.color_menu = document.getElementById('color-menu-screen')
  
    a=[],b=[]
    for(; a.length<12;)a.push([-1,-1])
    for(; b.length<8;)b.push([-1,-1,-1])
    this.cData={
      e: a,
      c: b,
      count: [8,8,8,8,8,8],
    }

    this.color_menu.addEventListener("click",(e)=>{
      if(this.data.cube_mode !== "set") return
      // if(e.target !== e.target) return
      // console.log(`menu color [${e.target.parentElement.id}]`)

      const f = this.face.parts.object3D.children[0].children[0].children
      let Check_ans = false
      if(e.target.classList.value === "sector"){
      // if(!(e.target.parentElement.id === "color-menu")){
        f[this.face.Findex].material.color = set_color_data[parseInt(e.target.parentElement.id[1])]
        // console.log(`type [${this.face.type[0]}] Pin [${[this.face.Pindex]}] Fin [${this.face.Findex}]`)
        // console.log(this.cData)
        this.cData[this.face.type[0]][this.face.Pindex][this.face.Findex] = parseInt(e.target.parentElement.id[1])
        this.cData.count[parseInt(e.target.parentElement.id[1])] -= 1
        // console.log(this.cData)
        Check_ans = this.Check_pos(this.face.type[0],this.face.Pindex)
      }

      this.color_menu.style.display = "none"
			const scene = document.getElementById('camera2').components["camera-view"]
			scene.mouse_ples = false
      // setTimeout(()=>{this.data.face_select = false},2000)
      this.data.face_select = false
      
      if(Check_ans === false) return
      scrambled_state = Check_ans
      color_set(scrambled_state)
      this.data.cube_mode="stay"
    })

		btn1.addEventListener('click', (e) => {
			if(this.data.cube_mode !== "stay")	return
			// document.getElementById('iframe').onload()
			this.Button(e)
		})

		btn2.addEventListener('click', (e) => {
      if(this.data.all_sul_mode) return
			if(this.data.cube_mode === "set") return
			this.data.cube_mode = "set"
			console.log(`mode Change set`)
      // cubeOpa(0.5)
      corner = document.getElementById("corner").children
      edge = document.getElementById("edge").children
      center = document.getElementById("center").children

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
      
      a=[],b=[]
      for(; a.length<12;)a.push([-1,-1])
      for(; b.length<8;)b.push([-1,-1,-1])
      this.cData={
        e: a,
        c: b,
        count: [8,8,8,8,8,8],
      }
      // console.log(this.cData)
		})
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

  Color_set(el){    
    // clientX 
    const regex = /[^a-z]/g;
    const regex2 = /[^0-9]/g;
    const parts_type = el.target.parentElement.id.replace(regex, "")
    const be = el.target.parentElement.id.replace(regex2, "")
    if(!(parts_type === "edge" || parts_type === "corner"))	return
    // parts_type === "center" || 

    this.data.face_select = true

    const rayCube = document.getElementById("touch-cube").components.raycaster
    // console.log(rayCube)

    const pos = rayCube.getIntersection(el.target)

    let num = 0
    if(parts_type === "edge"	)
      num = pos.face.normal.y > 0.707 ? 0 : 1
    else if(parts_type === "corner")
      num = pos.face.normal.y > 0.707 ? 0 : (pos.face.normal.x > 0.707 ? 1 : 2)

    // console.log(`Color_set type [${parts_type}] num [${be}]index [${num}]`)
    this.face = {parts: el.target, type: parts_type, Pindex: parseInt(be), Findex: num,}
    console.log(this.face)

    // console.log(el.detail)
    let mo_pos= {}
    const event = el.detail.mouseEvent !== undefined
    if(event) mo_pos = {x:el.detail.mouseEvent.clientX , y:el.detail.mouseEvent.clientY}
    else mo_pos =      {x:el.detail.touchEvent.changedTouches[0].clientX , y:el.detail.touchEvent.changedTouches[0].clientY}

    // console.log(`x:${mo_pos.x} y:${mo_pos.y}`)
    
    this.color_menu.children[0].style.left = `${mo_pos.x}px`
    this.color_menu.children[0].style.top = `${mo_pos.y}px`
    this.color_menu.style.display = "block"

  },

  Ins_Complete(){
    this.data.btn_mode = 1
    document.getElementById("ins-screen").style.display = "none"
    const icon = document.getElementById("icon")
    icon.classList.remove("rotate-ani")
  },

  Complete(){
		this.data.btn_mode = 0
		this.data.all_sul_mode = false
		
		this.btn1.children[0].innerHTML = 'Complete'
    const Lhand = document.getElementById("L-hand")
    const Rhand = document.getElementById("R-hand")
    Lhand.object3D.visible = false
    Rhand.object3D.visible = false
  },

  Ins_reset(){
    if(this.data.btn_mode == 1 && this.data.one_sul_mode){
      // console.log(this.NextMove)
      // console.log(`計算済み　リセット`)
      this.btn1.children[0].innerHTML = 'Solve'
      this.data.btn_mode = 0
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

	tick() {
		if(!this.data.one_sul_mode){
			motions()
			this.data.one_sul_mode = true
		}
	},
})

const DSA={
  "e": [
      [
          2,
          5
      ],
      [
          1,
          0
      ],
      [
          3,
          4
      ],
      [
          3,
          5
      ],
      [
          2,
          3
      ],
      [
          1,
          2
      ],
      [
          4,
          1
      ],
      [
          4,
          2
      ],
      [
          0,
          5
      ],
      [
          5,
          1
      ],
      [
          3,
          0
      ],
      [
          0,
          4
      ]
  ],
  "c": [
      [
          4,
          2,
          3
      ],
      [
          5,
          1,
          0
      ],
      [
          0,
          1,
          4
      ],
      [
          0,
          4,
          3
      ],
      [
          1,
          5,
          2
      ],
      [
          0,
          3,
          5
      ],
      [
          5,
          3,
          2
      ],
      [
          4,
          1,
          2
      ]
  ],
  "count": [
      0,
      0,
      0,
      0,
      0,
      0
  ]
}