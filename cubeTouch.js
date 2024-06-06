const cubemode = () => ({
	schema: {
		one_sul_mode: {type: 'boolean', default: true},
		all_sul_mode: {type: 'boolean', default: false},
    btn_mode: {type: 'int', default: 0},
    coa: {type: 'int', default: 120},
    solve_time: {type: 'int', default: -1},
	},	

	init() {
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
      setTimeout(() =>{BBB()},1650)
      
    }
    // console.log(e)
  },

	tick() {
		if(!this.data.one_sul_mode){
			motions()
			this.data.one_sul_mode = true
		}
	},
})