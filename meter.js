class metar{
  constructor(data = {}){
    // id,el, f0, f1, value, constSet, callbackfunc, num = undefined,
    this.id = data.id
    this.el = data.el
    this.meter_on = false
    this.f0 = data.start
    this.f1 = data.end
    this.value = data.value
    this.dx = data.dx || Math.abs(data.end - data.start) / 10
    this.count_Disp = data.count_Disp
    this.callbackfunc = data.callbackfunc
    
    
    this.touch_id = undefined
    this.touch = false
    // if(data.constSet) 
      this.Update_Value_From_Bar()

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
      // console.log(e.touches[0])
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
        // console.log(`touch_id[${this.touch_id}] end[${e.changedTouches[0].identifier}]`)
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
    const maxW=this.el.offsetWidth
    const X = e.clientX - this.el.getBoundingClientRect().left
    b.style.maxWidth=`${Math.max(Math.min(X, maxW), 0)}px`

    const b0 = 0, b1 = maxW, bn = Math.max(Math.min(X, maxW), 0)
    
    const dx = (bn - b0) / (b1 - b0)
    const fx = Math.round(((this.f1 - this.f0) * dx + this.f0)/this.dx)*this.dx

    if(this.count_Disp != false)  this.count_Disp.innerText=fx.toString().slice(0,3)

    // const mode  = document.getElementById("scene").components["cube-mode"]
    if(this.value != fx){
      this.value = fx
      // this.callbackfunc({id:this.id, value:this.value})
      this.callbackfunc.func1[this.callbackfunc.func2]({id:this.id, value:this.value})
    }
    // console.log(`target [${e.target.classList}] current [${e.currentTarget.classList}]`)
    // console.log(`targetName [${e.target.classList.value}] offsetX [${e.clientX - this.el.getBoundingClientRect().left}] wid [${e.target.offsetWidth}] hei [${e.target.offsetHeight}]`)
    // console.log({a:b,b:Math.max(Math.min(X, maxW), 0)+24/3})
    // console.log({min:0, max:maxW, X, num:Math.max(Math.min(X, maxW), 0),fx})
  }
  
  wheel_meter_updata(e){
    const b=this.el.children[0]
    const mi = Math.min(this.f0, this.f1), ma = Math.max(this.f0, this.f1)

    const wheel = Math.round(Math.max(Math.min(this.value - (e.wheelDeltaY>0?this.dx:-this.dx), ma), mi)/this.dx)*this.dx

    if(e.wheelDeltaY != 0 && this.value == wheel){
      console.log("wheel_meter_updata 同じ")
      return
    }
    if(this.count_Disp != false)  this.count_Disp.innerText=wheel.toString().slice(0,3)
    this.value = wheel


    const percent = (wheel-this.f0) / (this.f1 - this.f0)
    const maxW=(this.el.offsetWidth) * percent

    b.style.maxWidth=`${maxW}px`

    this.callbackfunc.func1[this.callbackfunc.func2]({id:this.id, value:this.value})
    // console.log({wheel, maxW, offsetWidth:this.el.offsetWidth, percent, maxW})
    // console.log({min:0, max:maxW, X, num:Math.max(Math.min(X, maxW), 0),fx})
  }

  Update_Bar_From_Value(){
    const B=this.el.children[0]
    const wid = parseInt(B.style.maxWidth.slice(0,-2))
    const wid2 = wid

    const maxW=this.el.offsetWidth
    // const X = e.clientX - this.el.getBoundingClientRect().left - 17.6/2

    const b0 = 0, b1 = maxW, bn = wid2
    
    const dx = (bn - b0) / (b1 - b0)
    const fx = Math.round(((this.f1 - this.f0) * dx + this.f0)/this.dx)*this.dx

    this.value = fx

    this.callbackfunc.func1[this.callbackfunc.func2]({id: this.id, value: fx})
    // console.log({maxW, wid, fx})
  }

  Update_Value_From_Bar(){
    const maxW=this.el.offsetWidth
    const b0 = 0, b1 = maxW
    let fx = this.value
    fx = (fx - this.f0) / (this.f1 - this.f0)
    let dw = fx * maxW

    const B=this.el.children[0]
    B.style.maxWidth=`${dw}px`
    // console.log({maxW, fx, dw})
  }
  
  Update_Bar_And_Value(data = {}){
    switch(data.type){
      case "value":
        this.value = data.value
        this.Update_Value_From_Bar()
        break;
      case "bar":
        console.log(data)
        const B=this.el.children[0], p = data.value
        B.style.maxWidth = `${p*100}%`
        this.value = this.f1*p - this.f0*p + this.f0
        break;
      case undefined:
        break;
    }
  }
}
