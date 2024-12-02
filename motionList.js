class motionList{
  constructor(
    full_cube, model_centers, model_corners, model_edges,
    bone_centers, bone_corners, bone_edges, L_hand, R_hand,
    bone_L_hand, bone_R_hand, bone_name_model, frameObj
  ){
    // console.log({model_centers, bone_centers})

    this.full_cube = full_cube
    this.model_centers = model_centers
    this.model_corners = model_corners
    this.model_edges = model_edges
    this.bone_centers = bone_centers
    this.bone_corners = bone_corners
    this.bone_edges = bone_edges
    this.L_hand = L_hand
    this.R_hand = R_hand
    this.bone_L_hand = bone_L_hand
    this.bone_R_hand = bone_R_hand
    this.bone_name_model = bone_name_model
    this.frameObj = frameObj

    this.mew_motion = true
    this.animation_start_time = undefined
    
    const a=document.getElementsByClassName("meter-out")
    this.meterData = {id: a[0].classList[1], el: a[0],}

    this.meterBar = document.querySelector('.time-meter-animation')

    this.animStyle = getRuleBySelector(".meter-animating")

    this.step_time_meter = undefined
    this.mode_direction = undefined

    this.anime_done = true


    this.back_btn = document.querySelector('.back-div')
    this.next_btn = document.querySelector('.next-div')
    this.reverse_btn = document.querySelector('.reverse-div')
    this.play_btn = document.querySelector('.play-div')
    this.stop_btn = document.querySelector('.stop-div')
    this.execution_btn = document.querySelector('.execution-div')


    this.next_btn.addEventListener("click",(e) => {
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      if(this.step_move)  return

      
      if(this.stepCount == 15){
        console.log("rote_re_start finish")
        return {skip: true, check: "over"}
      } 
      console.log("next_btn")
      this.stepCount++

      this.step_scroll(this.stepCount)
      

      this.meterBar.style.maxWidth = "0%"
      

      const index = this.stepSkip[this.stepCount]
      if(index == -1){
        console.log("rote_re_start skip")
        return {skip: true, }
      }
      this.frame_set(this.stepStartTime[index]/1000)
      this.stopTime = this.stepStartTime[index]

      this.meter_set(index)
      this.frameObjSet(index)

      // this.animStyle.style.transitionDuration = 
      //   `${(this.stepStartTime[intdex+1] - this.stepStartTime[intdex]) / rote_speed}ms`

      // this.step_move = true
      // this.animation_start_time = -1
      
      // setTimeout(() => {
      //   this.meterBar.classList.add("meter-animating")
      // }, 50)

      // setTimeout(() => {
      //   this.animation(
      //     this.stepStartTime[intdex  ]/1000,
      //     this.stepStartTime[intdex+1]/1000, rote_speed)
      //   this.meterBar.style.maxWidth = "100%"

      //   this.animation_start_time = Date.now()
      // }, 100)
            
      // this.timeOutId = setTimeout(() => {
      //   // const mode  = document.getElementById("scene").components["cube-mode"]
      //   // mode.step_completion()

      //   this.step_move = false
      //   this.meterBar.classList.remove("meter-animating")
      //   this.step_time_meter.Update_Bar_And_Value({type: "value",value: this.step_time_meter.f1})
      // },
      //   Math.abs(this.stepStartTime[intdex+1] - this.stepStartTime[intdex]) / rote_speed + 100
      // )
    })

    this.back_btn.addEventListener("click",(e) => {
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      if(this.step_move)  return

      
      if(this.stepCount == 0){
        console.log("rote_re_start finish")
        return {skip: true, check: "over"}
      }
      console.log("next_btn")
      this.stepCount--

      this.step_scroll(this.stepCount)

      this.meterBar.style.maxWidth = "0%"
      

      const index = this.stepSkip[this.stepCount]
      if(index == -1){
        console.log("rote_re_start skip")
        return {skip: true, }
      }
      this.frame_set(this.stepStartTime[index]/1000)
      this.stopTime = this.stepStartTime[index]

      this.meter_set(index)
      this.frameObjSet(index)
    })

    this.stop_btn.addEventListener("click",(e) => {
      // console.log("settimeput 22")
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      if(!this.step_move) return

      clearTimeout(this.timeOutId)

      const intdex = this.stepSkip[this.stepCount]
      let durtime =  (Date.now() - this.animation_start_time)
      let dur = this.mode_direction * Math.max(Date.now() - this.animation_start_time, 0) * rote_speed + this.stopTime


      console.log({
        durtime: durtime,
        durtime_x_speed: (durtime * rote_speed),
        max: this.stepStartTime[intdex+1] - this.stepStartTime[intdex],
      })

      this.anime_done = true
      this.mode_direction = undefined
      this.step_time_meter.Update_Bar_And_Value({type: "value", value: dur})
      this.meterBar.classList.remove("meter-animating")
      this.remove_Animation()
      this.step_move = false
    })

    this.play_btn.addEventListener("click",(e) => {
      // console.log("settimeput 22")
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      if(this.step_move) return

      const intdex = this.stepSkip[this.stepCount]

      if(intdex == -1){
        console.log("rote_re_start skip")
        return {skip: true, }
      }
      let value = this.step_time_meter.value

      if(this.step_time_meter.value == this.step_time_meter.f1){
        value = this.step_time_meter.f0
        this.meterBar.style.maxWidth = "0%"
      }
      this.anime_done = true
      this.mode_direction = 1
      this.animation_start_time = -1
      this.animStyle.style.transitionDuration = 
        `${(this.stepStartTime[intdex+1] - value) / rote_speed}ms`

      this.step_move = true
      this.stopTime = value

      setTimeout(() => {
        this.meterBar.classList.add("meter-animating")
      }, 50)

      console.log({start: value, end: this.stepStartTime[intdex+1], dur: this.stepStartTime[intdex+1] - value})

      setTimeout(() => {
        this.animation(
          value/1000,
          this.stepStartTime[intdex+1]/1000, rote_speed)
        this.animation_start_time = Date.now()
        this.meterBar.style.maxWidth = "100%"
      }, 100)

      this.timeOutId = setTimeout(() => {
        console.log("this.timeOutId")
        this.step_move = false
        this.meterBar.classList.remove("meter-animating")
        this.step_time_meter.Update_Bar_And_Value({type: "value",value: this.step_time_meter.f1})
      },
        (this.stepStartTime[intdex+1] - value) / rote_speed + 100
      )
    })

    this.reverse_btn.addEventListener("click",(e) => {
      // console.log("settimeput 22")
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      if(this.step_move) return

      const intdex = this.stepSkip[this.stepCount]

      if(intdex == -1){
        console.log("rote_re_start skip")
        return {skip: true, }
      }
      let value = this.step_time_meter.value

      if(this.step_time_meter.value == this.step_time_meter.f0){

        value = this.step_time_meter.f1
        this.meterBar.style.maxWidth = "100%"
      }

      this.anime_done = true
      this.mode_direction = -1
      this.animation_start_time = -1
      this.animStyle.style.transitionDuration = 
        `${(value - this.stepStartTime[intdex]) / rote_speed}ms`

      this.step_move = true
      this.stopTime = value

      setTimeout(() => {
        this.meterBar.classList.add("meter-animating")
      }, 50)

      // console.log({start: value, end: this.stepStartTime[intdex], dur: this.stepStartTime[intdex+1] - value})

      setTimeout(() => {
        this.animation(
          value/1000,
          this.stepStartTime[intdex]/1000, rote_speed)
        this.animation_start_time = Date.now()
        this.meterBar.style.maxWidth = "0%"
      }, 100)

      this.timeOutId = setTimeout(() => {
        console.log("this.timeOutId")
        this.step_move = false
        this.meterBar.classList.remove("meter-animating")
        this.step_time_meter.Update_Bar_And_Value({type: "value",value: this.step_time_meter.f0})
      },
        (value - this.stepStartTime[intdex]) / rote_speed + 100
      )
    })

    this.execution_btn.addEventListener("click",(e) => {
      // console.log("settimeput 22")
      const mode  = document.getElementById("scene").components["cube-mode"]
      if(mode.data.cube_mode !== "Execution")	return
      console.log("解説　終了")
      mode.Complete()
    })
  }
  ins(_Datas, _Rotes, _color_data, _Hnad_v = [0, 0]){
    // this.constructor()
    //  計算に必要なデータをまとめる
    this.Rotes = []
    this.Hnad_v = _Hnad_v
    
    this.moveList=[]

    this.Datas = []

    this.cubeRotesTime = []
    this.cubeRotesData = []

    this.LhandRotesTime = []
    this.LhandRotesData = []
    this.LstartIndex = []
    this.LcubeIndex = []

    this.RhandRotesTime = []
    this.RhandRotesData = []
    this.RstartIndex = []
    this.RcubeIndex = []
    
    this.colorData = []
    this.color_data = _color_data

    let towRotes = [], groupRotes = [], stepSkip = []
    // this.stepCount = undefined
    // this.stepSkip = undefined
    let _R = _Rotes
    
    let roteCount = 0

    // console.log(JSON.parse(JSON.stringify(_R)))

    _R = _R.map(step => {
      if(step[0] == ''){
        stepSkip.push(-1)
        return step
      }
      stepSkip.push(roteCount)
      groupRotes.push(roteCount)

      step = step.map(Rote => {
        roteCount ++
        if(Rote[1] == "2"){
          towRotes.push(roteCount)
          roteCount ++
          return [Rote[0], Rote[0]]
        }
        return Rote
      })

      step = step.flat(Infinity)


      return step
    })


    _R = _R.filter((e) => e[0].length > 0).flat(Infinity)

    this.stepSkip = []
    let stepCount = -1
    for(let i=0;i<stepSkip.length;i++){
      this.stepSkip.push(stepSkip[i] != -1 ? ++stepCount : -1)
    }
    console.log({stepSkip,inde: this.stepSkip})
    this.towRotes = towRotes
    this.groupRotesCube = groupRotes
    this.Rotes = _R

    this.set_timeList(this.Rotes)

    this.stepStartTime = []
    this.groupRotesLhand = []
    this.groupRotesRhand = []

    let tnkTime = 0
    this.moveList.forEach((m, index) => {
      if(stepSkip.indexOf(index) != -1)  this.stepStartTime.push(tnkTime)
      if(this.groupRotesCube.indexOf(index) != -1){
        // console.log(`index ${index}`)
        if(this.groupRotesLhand.length == 0 || this.groupRotesLhand.at(-1) < this.LhandRotesData.length)
          this.groupRotesLhand.push(this.LhandRotesData.length)
        if(this.groupRotesRhand.length == 0 || this.groupRotesRhand.at(-1) < this.RhandRotesData.length)
          this.groupRotesRhand.push(this.RhandRotesData.length)
      }

      if(m.moveMode != 1){
        // console.log(m)
        m.L.move_schedule.forEach((m2) => {
          this.LhandRotesTime.push(tnkTime + m2.time)
          this.LhandRotesData.push({clip: m2.clip,  timeScale:  m2.timeScale, })
        })
      }
      if(m.moveMode > 0){
        // console.log(m)
        m.R.move_schedule.forEach((m2) => {
          this.RhandRotesTime.push(tnkTime + m2.time)
          this.RhandRotesData.push({clip: m2.clip,  timeScale:  m2.timeScale, })
        })
      }

      this.cubeRotesTime.push(tnkTime  + m[m.moveMode==0?"L":"R"].sovle_time)
      this.cubeRotesData .push({
        clip: this.Rotes[index],
        timeScale:  m[m.moveMode==0?"L":"R"].move_schedule[m[m.moveMode==0?"L":"R"].roteIndex].timeScale,
      })
      
      tnkTime += m.time
    })

    this.groupRotesLhand.push(this.LhandRotesData.length)
    this.groupRotesRhand.push(this.RhandRotesData.length)
    this.stepStartTime.push(tnkTime)

    // console.log(this.stepStartTime)

    let hi = this.LstartIndex
    let ci = this.LcubeIndex
    let handi = 0
    this.cubeRotesTime.forEach((d, i) => {
      if(d > this.LhandRotesTime[handi]){
          hi.push(handi)
          ci.push(i - 1)
      }
      for(;this.LhandRotesTime[handi]<d;handi++);
    })

    hi = this.RstartIndex
    ci = this.RcubeIndex
    handi = 0
    this.cubeRotesTime.forEach((d, i) => {
      if(d > this.RhandRotesTime[handi]){
          hi.push(handi)
          ci.push(i - 1)
      }
      for(;this.RhandRotesTime[handi]<d;handi++);
    })

    this.Datas = []
    this.Datas.push(
        new State(	
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5],
      )
    )
    // this.colorData = []
    // this.colorData.push(this.color_data)

    this.frameRotesData = []
    _R.forEach((r) => {
      let scmbl = scamble2state(this.Datas.at(-1), r)
      this.Datas.push(scmbl)
    })

    // console.log(this.frameRotesData)

    tnkTime += 1000 / this.cubeRotesData.at(-1).timeScale
    // console.log(`tnkTime [${tnkTime}]`)


    this.mew_motion = false

    this.cube_Full_Animation_Make(this.Datas, this.cubeRotesData, this.cubeRotesTime)

    this.full_motion_set("L-hand", this.LhandRotesData, this.LhandRotesTime)
    this.full_motion_set("R-hand", this.RhandRotesData, this.RhandRotesTime)
    // this.full_motion_set(
    //   "cube", this.cubeRotesData, this.cubeRotesTime)

  
    const model = [
      [this.LhandRotesTime, this.LhandRotesData, this.L_hand],
      [this.RhandRotesTime, this.RhandRotesData, this.R_hand],
      [this.cubeRotesTime,  this.cubeRotesData,  this.full_cube],
    ]
    
    let last_time = []
    for(let i=0;i<model.length;i++){
      last_time.push(model[i][0].at(-1) + this.lastTimeGet(model[i][2], model[i][1])*1000)
    }
    
    const max = last_time.reduce((a, b) => a<b?b:a, 0)
    this.stepStartTime.push(max)

    console.log({max,model})
    
    for(let j=0;j<model.length;j++){
      if(last_time[j] == max) continue
      
      const model2 = model[j][2]
      const full = model2.object3D.children[0].animations.find((e) => e.name == "fullanimation")
      
      // console.log({model2})
      full.duration = max
      
      for(let i=0;i<full.tracks.length;i++){
          full.tracks[i].times.push(max)
          full.tracks[i].values = full.tracks[i].values
              .concat(full.tracks[i].values.slice(full.tracks[i].name.split(".")
                                                  .at(-1)[0]=="q"?-4:-3))
      }
    
    }

    this.stepCount = 0
    this.stopTime = 0
    this.step_move = false

    this.meter_set(0)
    
    this.step_scroll(0)
  }
  meter_set(intdex){
    this.step_time_meter = new metar({
      id: this.meterData.id,
      el: this.meterData.el,
      start: this.stepStartTime[intdex],
      end: this.stepStartTime[intdex+1],
      value: this.stepStartTime[intdex],
      dx: 10,
      constSet: true,
      callbackfunc: {func1: this, func2: "meter"},
      count_Disp: false,
    })
  }
  step_scroll(intdex){
    const _list = document.querySelector(".list")
    const hei = _list.children[intdex].offsetTop
    // const St = document.querySelectorAll(`.step${stepCount}`)
    // for(let i=0;i<St.length;i++)
    //   St[i].classList.add("now-step")

    _list.scrollTo({
      top: hei - _list.clientHeight/2,
      left: 0,
      behavior: "smooth",
    })
  }
  cube_Full_Animation_Make(Datas, Rotes, Times){
    const fa = this.full_cube.object3D.children[0].animations
    const anim = JSON.parse(JSON.stringify(fa.find((e) => e.name == "start")))
    
    const moves_ce = [
      [4],
      [1],
      [3],
      [2],
      [5],
      [0],
      [0,1,2,3,4,5],
      [0,1,2,3,4,5],
      [0,1,2,3,4,5],
      [0,1,2,4,5],
      [0,2,3,4,5],
      [0,1,2,3,4],
      [0,1,2,3,5],
      [1,2,3,4,5],
      [0,1,3,4,5],
    ]
    const moves_ed = [
      [4,5,6,7],
      [1,2,5,9],
      [0,3,7,11],
      [2,3,6,10],
      [8,9,10,11],
      [0,1,4,8],
      [0,1,2,3,4,5,6,7,8,9,10,11],
      [0,1,2,3,4,5,6,7,8,9,10,11],
      [0,1,2,3,4,5,6,7,8,9,10,11],
      [1,2,4,5,6,8,9,10],
      [0,3,4,6,7,8,10,11],
      [0,1,2,3,4,5,6,7],
      [0,1,2,3,8,9,10,11],
      [2,3,5,6,7,9,10,11],
      [0,1,4,5,7,8,9,11],
    ]
    const moves_co = [
      [0,1,2,3],
      [1,2,5,6],
      [0,3,4,7],
      [2,3,6,7],
      [4,5,6,7],
      [0,1,4,5],
      [0,1,2,3,4,5,6,7],
      [0,1,2,3,4,5,6,7],
      [0,1,2,3,4,5,6,7],
      [1,2,5,6],
      [0,3,4,7],
      [0,1,2,3],
      [4,5,6,7],
      [2,3,6,7],
      [0,1,4,5],
    ]
    const faces =    ['U', 'R', 'L', 'F', 'D', 'B', 'x', 'y', 'z', 'r', 'l', 'u', 'd', 'f', 'b']
    const facesXYZ = [  1,   0,   0,   2,   1,   2,   0,   1,   2,   0,   0,   1,   1,   2,   2]
    const facesVec = [ -1,  -1,   1,  -1,   1,   1,  -1,  -1,  -1,  -1,   1,  -1,   1,  -1,   1]

    const bone_ce = this.bone_centers
    const bone_ed = this.bone_corners
    const bone_co = this.bone_edges

    function boneIndex(type, index){
      return [0,6,18].at(type) + index
    }

    function animationAdd(clip, Vector3, vec, time){
      const boneAni = anim.tracks.find((e) => e.name == clip)
      const quaternion = new THREE.Quaternion(
        boneAni.values.at(-4),
        boneAni.values.at(-3),
        boneAni.values.at(-2),
        boneAni.values.at(-1),
      )

      const data = [0,0,0]
      data[Vector3] = 1

      const target = new THREE.Quaternion()
      const axis = new THREE.Vector3(data[0], data[1], data[2]).normalize()
      target.setFromAxisAngle(axis, vec)
      quaternion.premultiply(target)

      if(boneAni.times.at(-1) < time[0]){
        boneAni.times.push(time[0])
        boneAni.values.push(boneAni.values.at(-4))
        boneAni.values.push(boneAni.values.at(-4))
        boneAni.values.push(boneAni.values.at(-4))
        boneAni.values.push(boneAni.values.at(-4))
      }
      
      boneAni.times.push(time[1])
      boneAni.values.push(quaternion.x)
      boneAni.values.push(quaternion.y)
      boneAni.values.push(quaternion.z)
      boneAni.values.push(quaternion.w)
    }

    for(let i=0;i<Rotes.length;i++){  //Rotes.length
      const clip = Rotes[i].clip
      const faceIndex = faces.indexOf(clip[0])
      const vec = Math.PI/2 * facesVec[faceIndex] * (clip.length==1?1:-1)
      const time = [
        Times[i]/1000, 
        Times[i]/1000 + 1/Rotes[i].timeScale
      ]

      moves_ce[faceIndex].forEach((j) => {
        animationAdd(`ce${("00"+Datas[i].c[j]).slice(-2)}.quaternion`,
                      facesXYZ[faceIndex], vec, time)
      })
      moves_ed[faceIndex].forEach((j) => {
        animationAdd(`ed${("00"+Datas[i].ep[j]).slice(-2)}.quaternion`,
                      facesXYZ[faceIndex], vec, time)
      })
      moves_co[faceIndex].forEach((j) => {
        animationAdd(`co${("00"+Datas[i].cp[j]).slice(-2)}.quaternion`,
                      facesXYZ[faceIndex], vec, time)
      })
    }

    const lastTime = Times.at(-1)/1000 + 1/Rotes.at(-1).timeScale

    anim.name = "fullanimation"
    anim.duration = lastTime

    anim.tracks.forEach((e) => {
      if(e.times.at(-1) < lastTime){
        e.times.push(lastTime)
        if(e.type == "vector"){
          e.values.push(e.values.at(-3))
          e.values.push(e.values.at(-3))
          e.values.push(e.values.at(-3))
        }
        else{
          e.values.push(e.values.at(-4))
          e.values.push(e.values.at(-4))
          e.values.push(e.values.at(-4))
          e.values.push(e.values.at(-4))
        }
      }
    })

    fa.push(anim)
    // console.log(fa)
    console.log({Datas, Rotes, Times, anim})
  }
  one_hand_move(sulb, speed, hdvec, influence, Su){
    const Pre_movement2 = {
      "B.1":	["",".f"],
      "D.1":	["",".f"],
      "F'.1":	["",".f"],
      "F'.2":	[".b","",".f"],
      "L.1":	[""],
      "L'.1":	[""],
      "U'.1":	["",".f"],
      "y.1":	[".b",""],
      "y'.1":	[""],
    }
    const Change = [
      {name:"Change.1", int:-1},
      {name:"Change.2", int: 1},
    ]
    let time = 0,sovle_time = 0
    let move_schedule = []
      
    let data = {
      time: -1,
      sovle_time: -1,
      move_schedule: [],
      handIndex: -1,
      roteIndex: -1,
    }
      
    if(Su === undefined){
      return data
    }
  
    let index = hdvec[sulb]-this.Hnad_v[influence]
    let vec_count = this.Hnad_v[influence]
  
    if(Su[0] === 'L')	vec_count+=1
  
    index = Change.find((u) => u.int === index)
  
    
    if(index !== undefined){
      move_schedule.push({
        clip: index.name,
        timeScale: speed,
        time : time,
        hand: true,
        rote: false,
      })
      time += parseInt(1000/speed)
      vec_count += 1
          data.handIndex=0
    }
    this.Hnad_v [influence] = vec_count % 2
  
    for(let i=0; i<Pre_movement2[Su].length; i++){
      let  da = {
        clip: `${Su + Pre_movement2[Su][i]}`,
        timeScale: speed,
        time : time,
        hand: false,
        rote: false,
      }
      if(Pre_movement2[Su][i] == ""){
        da.rote = true
        sovle_time = time
      }
      move_schedule.push(da)
      time+=parseInt(1000/speed)
          data.roteIndex=move_schedule.length-1
    }
      data.move_schedule = move_schedule
      data.sovle_time = sovle_time
      data.time = time
    return data
  }
  one_motion(sulb,speed,step){
    let data1 = {moveMode:-1, time:-1}
    
    const Lhands = {
      "U'"  :"U'.1" ,
      "D"   :"D.1"  ,
      "L"   :"L.1"  ,
      "L'"  :"L'.1" ,
      "B"   :"B.1"  ,
      "F'"  :"F'.2" ,
      "y"		:"y.1"	,
      "y'"	:"y'.1"	,
      "x'"	:"y'.1"	,
      "x"		:"y'.1"	,
      "l"		:"L.1"	,
      "l'"  :"L'.1"	,
    }
    const Lhandv = {
      "U'"  :0 ,
      "D"   :0 ,
      "L"   :0 ,
      "L'"  :1 ,
      "B"   :1 ,
      "F'"  :0 ,
      "y"		:0 ,
      "y'"	:0 ,
      "x'"	:0 ,
      "x"		:0 ,
      "l"		:0 ,
      "l'"	:1 ,
    }
    const Rhands = {
      "U"   :"U'.1"	,
      "D'"  :"D.1" 	,
      "R"   :"L'.1"	,
      "R'"  :"L.1"	,
      "B'"  :"B.1"	,
      "F"   :"F'.1"	,
      "y" 	:"y'.1"	,
      "y'"	:"y.1"	,
      "x'"	:"L.1"	,
      "x"		:"L'.1"	,
      "r"		:"L'.1"	,
      "r'"  :"L.1"	,
    }
    const Rhandv = {
      "U"   :0 ,
      "D'"  :0 ,
      "R"   :1 ,
      "R'"  :0 ,
      "B'"  :1 ,
      "F"   :1 ,
      "y"	  :0 ,
      "y'"	:0 ,
      "x"		:1 ,
      "x'"	:0 ,
      "r"		:1 ,
      "r'"  :0 ,
    }
                                       
    let Rtime = this.one_hand_move(sulb, speed, Rhandv, 1, Rhands[sulb])
    let Ltime = this.one_hand_move(sulb, speed, Lhandv, 0, Lhands[sulb])
  
    if(Rtime.sovle_time == -1 && Ltime.sovle_time == -1)
      return data1
    else if(Ltime.sovle_time != -1 && Rtime.sovle_time == -1){
      data1.L = Ltime
      data1.time = Ltime.time
      data1.moveMode = 0
      return data1
    }
    else if(Rtime.sovle_time != -1 && Ltime.sovle_time == -1){
      data1.R = Rtime
      data1.time = Rtime.time
      data1.moveMode = 1
      return data1
    }
    
    if(Rtime.handIndex != -1 && Ltime.handIndex != -1 &&
      Rtime.move_schedule[Rtime.handIndex].clip == Ltime.move_schedule[Ltime.handIndex].clip){
  
      const dis = 1000 / Rtime.move_schedule[Rtime.handIndex].timeScale
      for(let i=Rtime.handIndex+1;i<Rtime.move_schedule.length;i++)
        Rtime.move_schedule[i].time += dis
      Rtime.time += dis
      Rtime.sovle_time += dis
          
      for(let i=Ltime.handIndex;i<Ltime.move_schedule.length;i++)
        Ltime.move_schedule[i].time += dis
      Ltime.time += dis
      Ltime.sovle_time += dis
    }
    else if(Rtime.handIndex != -1 && Rtime.move_schedule[Rtime.handIndex].clip){
      const dis = 1000 / Rtime.move_schedule[Rtime.handIndex].timeScale
      for(let i=0;i<Ltime.move_schedule.length;i++)
        Ltime.move_schedule[i].time += dis
      Ltime.time += dis
      Ltime.sovle_time += dis
    }
    else if(Ltime.handIndex != -1 && Rtime.move_schedule[Rtime.handIndex].clip){
      const dis = 1000 / Ltime.move_schedule[Ltime.handIndex].timeScale
      for(let i=0;i<Rtime.move_schedule.length;i++)
        Rtime.move_schedule[i].time += dis
      Rtime.time += dis
      Rtime.sovle_time += dis
    }
  
    if(Rtime.sovle_time != -1 && Ltime.sovle_time != -1 &&
      Rtime.sovle_time != Ltime.sovle_time){
      const dis = Rtime.sovle_time - Ltime.sovle_time
      if(dis > 0){
        for(let i=Ltime.roteIndex;i<Ltime.move_schedule.length;i++)
          Ltime.move_schedule[i].time += dis
        Ltime.time += dis
        Ltime.sovle_time += dis
      }
      else{
        for(let i=Rtime.roteIndex;i<Rtime.move_schedule.length;i++)
          Rtime.move_schedule[i].time -= dis
        Rtime.time -= dis
        Rtime.sovle_time -= dis
      }
    }
      
    data1.L = Ltime
    data1.R = Rtime
    data1.time = Math.max(Ltime.time, Rtime.time)
    data1.moveMode = 2

    // console.log(JSON.parse(JSON.stringify({L:Ltime, R:Rtime})))
    // console.log({L:Ltime, R:Rtime})

    return data1
  } 
  set_timeList(_Rotes){
    for(let i=0;i<_Rotes.length;i++){
      let a= this.one_motion(_Rotes[i], 1, 0)
      // console.log(a)
      this.moveList.push(a)
    }
    // console.log(this.moveList)
    // let sum = this.moveList.reduce((a, c) => a + c.time, 0)
    // console.log(`sum time ${sum}`)
  }
  color_re_set(sulb){
    let new_color = new Array(this.color_data.length)
    for(let i=0;i<this.color_data.length;i++){
      new_color[i] = this.color_data[color_modes[sulb][i]]
    }
    return new_color
  }
  color_set(sc_st, _colorData){
    // console.log(`----- color_set ----`)
    const corner = this.model_corners
    const edge = this.model_edges
    const center = this.model_centers

    const colorData = _colorData

    // console.log(sc_st)

    for(let i=0;i<corner.length;i++){
      // console.log(corner[i])
      let F = corner[i].children
      for(let s=0;s<3;s++)
        F[s].material.color = set_color_data[colorData[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
    }

    for(let i=0;i<edge.length;i++){
      let F = edge[i].children
      for(let s=0;s<2;s++)
        F[s].material.color = set_color_data[colorData[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
    }

    for(let i=0;i<center.length;i++){
      let F = center[i].children
      F[0].material.color = set_color_data[colorData[color_cn[sc_st.c[i]][0]]]
    }
  }
  timelist_push(){
    return this
  }
  motion_time_set(index, roteData, roteTime, fa) {
    const a = JSON.parse(JSON.stringify(fa.find((e) => e.name == roteData[index].clip)))
    
    let stime = roteTime[index] / 1000
        
    for(let i=0;i<a.tracks.length;i++){
        for(let s=0;s<a.tracks[i].times.length;s++){
            a.tracks[i].times[s] += stime
        }
    }
  
    return a
  }
  full_motion_set(name, roteData, roteTime) {
    const r = document.getElementById(name)
    const fa = r.object3D.children[0].animations
    
    const full = this.motion_time_set(0,roteData, roteTime,fa)
    const dis = 0.01
  
    if(full.tracks[0].times[0] != 0){
        for(let i=0;i<full.tracks.length;i++){
    full.tracks[i].times.unshift(0)
    full.tracks[i].values = full.tracks[i].values.slice(0, full.tracks[i].name.split(".").at(-1)[0]=="q"?4:3).concat(full.tracks[i].values)
        }
    }
    
    for(let j=1;j<roteData.length;j++){
        const a = this.motion_time_set(j,roteData, roteTime, fa)
        for(let i=0;i<full.tracks.length;i++){
            if(a.tracks[i].times[0] - full.tracks[i].times.at(-1) > dis){
                // console.log({dis})
                full.tracks[i].times.push(a.tracks[i].times[0] - 0.001)
                full.tracks[i].values =
                    full.tracks[i].values.concat(
                        full.tracks[i].values.slice(full.tracks[i].name.split(".").at(-1)[0]=="q"?-4:-3))
            }
            full.tracks[i].times = full.tracks[i].times.concat(a.tracks[i].times)
            full.tracks[i].values = full.tracks[i].values.concat(a.tracks[i].values)
        }
    }
    
    full.name = "fullanimation"
    full.duration = (fa.find((e) => e.name == roteData.at(-1).clip).duration * 1000 + roteTime.at(-1)) / 1000    
    fa.push(full)
    // console.log(full)
  }
  lastTimeGet(model, roteData) {
    const fa = model.object3D.children[0].animations
    return fa.find((e) => e.name == roteData.at(-1).clip).duration  
  }
  frame_set(a){
    const data = {
      clip: "fullanimation" ,
      frame: a,
    }

    this.L_hand.removeAttribute("my-animation")
    this.L_hand.setAttribute("my-animation",data)

    this.R_hand.removeAttribute("my-animation")
    this.R_hand.setAttribute("my-animation",data)

    this.full_cube.removeAttribute("my-animation")
    this.full_cube.setAttribute("my-animation",data)
  }
  frame(a){
    this.L_hand.components["my-animation"].setFrame(a)
    this.R_hand.components["my-animation"].setFrame(a)
    this.full_cube.components["my-animation"].setFrame(a)
  }
  animation(a, b, c){
    const data = {
      clip: "fullanimation" ,
      start: a,
      end: b,
      timeScale: c,
    }

    this.L_hand.removeAttribute("my-animation")
    this.L_hand.setAttribute("my-animation",data)

    this.R_hand.removeAttribute("my-animation")
    this.R_hand.setAttribute("my-animation",data)

    this.full_cube.removeAttribute("my-animation")
    this.full_cube.setAttribute("my-animation",data)
  }
  remove_Animation(){
    this.L_hand.removeAttribute("my-animation")
    this.R_hand.removeAttribute("my-animation")
    this.full_cube.removeAttribute("my-animation")
  }
  meter(Data){
    const mode  = document.getElementById("scene").components["cube-mode"]
    if(mode.data.cube_mode !== "Execution")	return

    const intdex = this.stepSkip[this.stepCount]
    if(intdex == undefined || intdex == -1){
      // console.log("現在のステップはスキップ")  
      return
    }


    if(this.step_move){
      // console.log("アニメーション中")  
      clearTimeout(this.timeOutId)
      this.remove_Animation()
      this.step_move = false    
      this.meterBar.classList.remove("meter-animating")
      // return
    } 


    const a = this.stepStartTime[intdex  ]/1000, b = this.stepStartTime[intdex+1]/1000, p = Data.value/1000

    // console.log({a,b,p,value})

    if(this.anime_done){
      this.frame_set(p)
      this.anime_done = false
      return
    }

    this.frame(p)
  }
  frameObjSet(index){
    const f = [
      ["ed10"], ["ed09"], ["ed08"], ["ed11"],
      ["co06"], ["co05"], ["co04"], ["co07"],
      ["ed02"], ["ed01"], ["ed00"], ["ed03"],
      ["ed04","ed05","ed06","ed07"],
      ["co00","co01","co02","co03"],
      ["ed04","ed05","ed06","ed07"],
      ["co00","co01","co02","co03"],
      ["co00","co01","co02","co03","co04","co05","co06","co07"],
      ["ce00","ce01","ce02","ce03","ce04","ce05"],
      ["ed00","ed01","ed02","ed03","ed04","ed05","ed06","ed07","ed08","ed09","ed10","ed11"],
    ]

    const F = f[index]

    const bone = {
      "ce": this.bone_centers,
      "co": this.bone_corners,
      "ed": this.bone_edges,
    }
    
    const baseQua = {
      "co": [
        [0,0,0,0],
        [0,-0.7071067811865476,0,0.7071067811865476],
        [0,1,0,0],
        [0,0.7071067811865476,0,0.7071067811865476],
        [0.7071067811865476,0,0.7071067811865475,0],
        [0,0,1,0],
        [0.7071067811865476,0,-0.7071067811865475,0],
        [1,0,0,0]
      ],
      "ce": [
        [0,0,0,1],
        [0,-0.7071067811865476,0,0.7071067811865476],
        [0,1,0,0],
        [0, 0.7071067811865476,0,0.7071067811865476],
        [0.7071067811865476,0,0,0.7071067811865476],
        [-0.7071067811865476,0,0,0.7071067811865476],
      ],
      "ed": [
        [0,0,0,1],
        [0,0,1,0],
        [0,1,0,0],
        [1,0,0,0],
        [0.5,-0.5,0.5,0.5],
        [-0,0.7071067811865476,-0.7071067811865475,0],
        [0.5,0.5,-0.5,0.5],
        [0.7071067811865475,0,0,0.7071067811865476],
        [-0.5,-0.5,-0.5,0.5],
        [0,0.7071067811865475,0.7071067811865476,0],
        [-0.5,0.5,0.5,0.5],
        [-0.7071067811865475,0,0,0.7071067811865476],
      ]
    }

    this.full_cube.object3D.traverse((e)=>{
      if(e.type=="Group" && ( e.name=="fco" || e.name=="fce" || e.name=="fed")){
        // console.log(e)
        // this.full_cube.object3D.remove(e)
        e.removeFromParent()
      }
    })

    // 

    const baseframe = {"co": 0, "ed":1, "ce":2}
    // bone.ce[0].remove(this.frameObj[0])
    F.forEach((e)=>{
      const type = e.slice(0,2)
      const number = this.Datas.at(-1)[type=="ce"?"c":type[0]+"p"][parseInt(e.slice(-2))]
      console.log({type, number})

      // .indexOf(parseInt(e.slice(-2)))
      const mdl = this.frameObj[baseframe[type]].clone()
      const rot = baseQua[type][number]
      mdl.quaternion.set(rot[0], rot[1], rot[2], rot[3])
      bone[type][number].add(mdl)
    })

  }
}

let timeList
