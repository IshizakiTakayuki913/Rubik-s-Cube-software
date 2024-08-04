class metar{
  constructor(id, el, f0, f1, value, constSet){
    this.id = id
    this.el = el
    this.meter_on = false
    this.f0 = f0
    this.f1 = f1
    this.value = value
    
    this.touch_id = undefined
    this.touch = false
    if(constSet) this.wheel_meter_updata({wheelDeltaY:0})

    this.el.addEventListener("mousedown", (e)=>{
      if(!e.currentTarget.classList[0]=="meter-out")  return
      if(this.meter_on) return
      // console.log("mousedown")
      this.meter_on=true
      this.meter_updata(e)
    })

    document.addEventListener("mouseup", (e)=>{
      if(!this.meter_on) return
      this.meter_on=false
    })

    document.addEventListener("mousemove", (e)=>{
      if(!e.currentTarget.tagName=="BODY")  return
      if(!this.meter_on) return
      this.meter_updata(e)
    })

    this.el.addEventListener("touchstart", (e)=>{
      console.log(e.touches[0])
      if(!e.touches[0].target.classList[1]==this.id)  return
      if(this.meter_on) return

      this.meter_on=true
      this.touch = true
      this.touch_id = e.touches[0].identifier

      if(!e.touches.length > 1){
        this.touch = false
        return
      }

      this.meter_updata({clientX:e.touches[0].clientX})
      
    })

    document.addEventListener("touchend", (e)=>{
      if(e.changedTouches[0].identifier == this.touch_id){
        console.log(`touch_id[${this.touch_id}] end[${e.changedTouches[0].identifier}]`)
        this.meter_on=false
        this.touch = false
        this.touch_id = undefined
      }
    })

    document.addEventListener("touchmove", (e)=>{
      if(!(this.meter_on &&  this.touch)) return 
      
      this.meter_updata({clientX:e.touches[0].clientX})
    })
    
    this.el.parentElement.addEventListener("wheel", (e)=>{
      if(this.meter_on) return
      this.wheel_meter_updata(e)
    })
  }
  
  meter_updata(e){
    const b=this.el.children[0]
    const maxW=this.el.offsetWidth - 17.6
    const X = e.clientX - this.el.getBoundingClientRect().left - 17.6/2
    b.style.width=`${Math.max(Math.min(X, maxW), 0)+24/3}px`

    const b0 = 0, b1 = maxW, bn = Math.max(Math.min(X, maxW), 0)
    
    const dx = (bn - b0) / (b1 - b0)
    const fx = Math.round(((this.f1 - this.f0) * dx + this.f0)*10)/10

    this.el.nextElementSibling.innerText=fx

    const mode  = document.getElementById("scene").components["cube-mode"]
    if(this.value != fx){
      this.value = fx
      mode.meter({id:this.id, value:this.value})
    }
    // console.log(`target [${e.target.classList}] current [${e.currentTarget.classList}]`)
    // console.log(`targetName [${e.target.classList.value}] offsetX [${e.clientX - this.el.getBoundingClientRect().left}] wid [${e.target.offsetWidth}] hei [${e.target.offsetHeight}]`)
    // console.log({a:b,b:Math.max(Math.min(X, maxW), 0)+24/3})
    // console.log({min:0, max:maxW, X, num:Math.max(Math.min(X, maxW), 0),fx})
  }
  
  wheel_meter_updata(e){
    const b=this.el.children[0]
    const wheel = Math.round(Math.max(Math.min(this.value - e.wheelDeltaY/600, this.f1), this.f0)*10)/10

    if(e.wheelDeltaY != 0 && this.value == wheel){
      console.log("wheel_meter_updata 同じ")
      return
    }
    this.el.nextElementSibling.innerText=wheel
    this.value = wheel

    const percent = (wheel-this.f0) / (this.f1 - this.f0)
    const maxW=(this.el.offsetWidth - 17.6) * percent

    b.style.width=`${maxW + 24/3}px`

    const mode  = document.getElementById("scene").components["cube-mode"]
    mode.meter({id:this.id, value:this.value})
    // console.log({wheel, maxW, offsetWidth:this.el.offsetWidth, percent, maxW})
    // console.log({min:0, max:maxW, X, num:Math.max(Math.min(X, maxW), 0),fx})
  }
}