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
    this.imgStyle = getRuleBySelector(".img-div-back")

    this.step_time_meter = undefined
    this.mode_direction = undefined

    this.anime_done = true

    this.rotImgs = undefined

    this.back_btn = document.querySelector('.back-div')
    this.next_btn = document.querySelector('.next-div')
    this.reverse_btn = document.querySelector('.reverse-div')
    this.play_btn = document.querySelector('.play-div')
    this.stop_btn = document.querySelector('.stop-div')
    this.execution_btn = document.querySelector('.execution-div')
    this.learning_btn = document.querySelector(`.learning-div`)
    this.stepList = document.querySelector(`.step-lists`)
    this.learning_btn = document.querySelector(`.learning-div`)
    
    this.next_btn.addEventListener("click",next_btn_func)
    this.back_btn.addEventListener("click",back_btn_func)
    this.stop_btn.addEventListener("click",stop_btn_func)
    this.play_btn.addEventListener("click",play_btn_func)
    this.reverse_btn.addEventListener("click",reverse_btn_func)
    this.execution_btn.addEventListener("click",execution_btn_func)
    this.learning_btn.addEventListener("click",learning_btn_func)
    this.stepList.addEventListener("click",stepList_func)
  }
  stepChange(newStep){
    console.log({newStep})

    // if(newStep == 15){
    //   // console.log("rote_re_start finish")
    //   return {skip: true, check: "over"}
    // } 
    // console.log("next_btn")
    this.stepCount = newStep

    this.step_scroll(this.stepCount)
    this.meterBar.style.maxWidth = "0%"
    
    const index = this.stepSkip[this.stepCount]
    if(index == -1){
      const _index = this.stepSkip.slice(this.stepCount).find((e)=>e>-1)
      if(_index == undefined)  this.frame_set(this.stepStartTime.at(-1)/1000)
      else  this.frame_set(this.stepStartTime[_index]/1000)

      this.frameObjSet(this.stepCount)
      this.learning_btn.style.display = "none"
      console.log(`rote_re_start skip newId:${_index}`)
      return {skip: true, }
    }

    this.rotateImgReset(index, 0)
    this.frame_set(this.stepStartTime[index]/1000)
    this.stopTime = this.stepStartTime[index]

    this.meter_set(index)
    this.frameObjSet(this.stepCount)
    
    this.learning_btn.style.display = "block"
  }
  rotImgReverse(value){
    const index = this.stepSkip[this.stepCount]
    // let value = this.step_time_meter.value

    this.rotateImgSet(index, 0)
    this.rotateImgSpeedSet(index, 0)
    
    const data = {
      step: this.rotImgIns({type:"step", value:index}),
      time: this.rotImgIns({type:"time", value:value})
    }
    // console.log(data)

    for(let i=data.step.id0; i<data.time.imgId; i++)  this.rotImgs[i].style.maxWidth = `${100}%`

    if(data.time.now){
      const percent = (value - data.time.rotTime.start)  / (data.time.rotTime.end - data.time.rotTime.start)
      // console.log(`動作中 perc:${percent}`)
      switch(data.time.imgType){
        case "Before":
          // console.log(`now Before ${100*percent}`)
          this.rotImgs[data.time.imgId].style.maxWidth = `${50*percent}%`
          break
        case "After":
          // console.log(`now After ${50*percent+50}`)
          this.rotImgs[data.time.imgId].style.maxWidth = `${50*percent+50}%`
          break
        case "no":
          // console.log(`now no ${100*percent}`)

          this.rotImgs[data.time.imgId].style.maxWidth = `${100*percent}%`
          break
      }
    }
    else{
      switch(data.time.imgType){
        case "Before":
          this.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
          break
        case "After":
          this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
          break
        case "no":
          this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
          break
      }
    }
    
    let rotdri = data.time.now
    let imgdur = (value - data.time.rotTime.end) / rote_speed

    console.log({
      start: value, end: this.stepStartTime[index], 
      id: data.time.rotId-1,
      next: value - data.time.rotTime.end,
      next2: imgdur,
    })

    if(!data.time.now && data.time.rotId == -1){   //  && data.time.rotId < data.step.id1
      // console.log("画像 -1 ステップ残 ")
      // let _imgdur = (this.cubeRotesTime[0] - value) / rote_speed
      // this.imgTimeOutId = setTimeout(rotateNext,100 + _imgdur) 
    }     
    else if(!data.time.now ){   // && data.time.rotId >= data.step.id0
      // console.log(`画像 動作完  ステップ残 ${imgdur}s後`)
      this.imgTimeOutId = setTimeout(rotateReverse,imgdur + 10)
    }
    else if(data.time.now){   //  && data.time.rotId >= data.step.id0
      const durSecond = 1 / rote_speed * (value - data.time.rotTime.start)  / (data.time.rotTime.end - data.time.rotTime.start)

      // console.log(`画像 動作中  ステップ残 ${durSecond}s`)

      setTimeout(() => {
        this.rotImgs[data.time.imgId].style.transition = `${durSecond}s linear`
      }, 5)

      setTimeout(() => {
        switch(data.time.imgType){
          case "Before":
            this.rotImgs[data.time.imgId].style.maxWidth = `${0}%`
            break
          case "After":
            this.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
            break
          case "no":
            this.rotImgs[data.time.imgId].style.maxWidth = `${0}%`
            break
        }
      },10)

      if(data.time.rotId >= 1){
        // console.log({value, nextStart: this.cubeRotesTime[data.time.rotId-1], nextScale: this.cubeRotesData[data.time.rotId-1].timeScale*1000})
        const nextrot = (value - this.cubeRotesTime[data.time.rotId-1] - this.cubeRotesData[data.time.rotId-1].timeScale*1000) / rote_speed
        // console.log(`次回まで ${nextrot}s`)
        this.imgTimeOutId = setTimeout(rotateReverse,10 + nextrot) 
      }
    }
  }
  rotImgPlay(value){
    const index = this.stepSkip[this.stepCount]
    // let value = this.step_time_meter.value

    this.rotateImgSet(index, 0)
    this.rotateImgSpeedSet(index, 0)
    
    let data = {
      step: this.rotImgIns({type:"step", value:index}),
      time: this.rotImgIns({type:"time", value:value})
    }
    console.log(JSON.parse(JSON.stringify(data)))

    if(data.time.imgId < data.step.id0){
      console.log(`例外処理`)
      data.time = this.rotImgIns({type:"time", value:this.cubeRotesTime[data.time.rotId+1]+1})
    }
    console.log(data)

    for(let i=data.step.id0; i<data.time.imgId; i++)  this.rotImgs[i].style.maxWidth = `${100}%`

    if(data.time.now){
      const percent = (value - data.time.rotTime.start)  / (data.time.rotTime.end - data.time.rotTime.start)
      console.log(`動作中 perc:${percent}`)
      switch(data.time.imgType){
        case "Before":
          // console.log(`now Before ${100*percent}`)
          this.rotImgs[data.time.imgId].style.maxWidth = `${50*percent}%`
          break
        case "After":
          // console.log(`now After ${50*percent+50}`)
          this.rotImgs[data.time.imgId].style.maxWidth = `${50*percent+50}%`
          break
        case "no":
          // console.log(`now no ${100*percent}`)

          this.rotImgs[data.time.imgId].style.maxWidth = `${100*percent}%`
          break
      }
    }
    else if(!data.time.now && data.time.rotId >= data.step.id0){
      switch(data.time.imgType){
        case "Before":
          this.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
          break
        case "After":
          this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
          break
        case "no":
          this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
          break
      }
    }
    
    let rotdri = data.time.now
    let imgdur = (this.cubeRotesTime[data.time.rotId+1] - value) / rote_speed

    console.log({
      start: value, end: this.stepStartTime[index+1], 
      id: data.time.rotId+1,
      next: this.cubeRotesTime[data.time.rotId+1] - value,
      next2: imgdur,
    })

    if(!data.time.now && data.time.rotId == -1){   //  && data.time.rotId < data.step.id1
      // console.log("画像 -1 ステップ残 ")
      let _imgdur = (this.cubeRotesTime[0] - value) / rote_speed
      this.imgTimeOutId = setTimeout(rotateNext,100 + _imgdur) 
    }     
    else if(!data.time.now && data.time.rotId < data.step.id1){   // 
      // console.log(`画像 動作完  ステップ残 ${imgdur}s後`)
      this.imgTimeOutId = setTimeout(rotateNext,imgdur + 10)
    }
    else if(data.time.now && data.time.rotId < data.step.id1){   // 
      const durSecond = 1 / rote_speed * (data.time.rotTime.end - value)  / (data.time.rotTime.end - data.time.rotTime.start)
      // console.log(`画像 動作中  ステップ残 ${durSecond}s`)

      setTimeout(() => {
        this.rotImgs[data.time.imgId].style.transition = `${durSecond}s linear`
      }, 5)

      setTimeout(() => {
        switch(data.time.imgType){
          case "Before":
            this.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
            break
          case "After":
            this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
            break
          case "no":
            this.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
            break
        }
      },10)
      this.imgTimeOutId = setTimeout(rotateNext,imgdur + 10) 
    }
  }
  rotateImgSet(step, dur){
    if(this.stepSkip.indexOf(step) == -1){
      // console.error(`step:${step}no step`)
      return
    }
    a=this.rotImgIns({type: "step", value: step})
    // console.log({a})
    for(let i=a.id0; i<a.id1; i++){
      this.rotImgs[i].style.maxWidth = `${dur}%`
    }
  }
  rotateImgReset(step, dur){
    if(this.stepSkip.indexOf(step) == -1){
      // console.error(`step:${step}no step`)
      return
    }
    a=this.rotImgIns({type: "step", value: step})
    // console.log({a})
    for(let i=a.id0; i<a.id1; i++){
      this.rotImgs[i].style.maxWidth = `${dur}%`
    }
  }
  rotateImgSpeedSet(step, speed = 0){
    // this.imgStyle.style.transition = `all ${1/speed}s linear`

    if(this.stepSkip.indexOf(step) == -1){
      // console.error(`step:${step}no step`)
      return
    }
    let value = "none linear"
    if(speed > 0)  value = `${1/speed}s linear`

    a=this.rotImgIns({type: "step", value: step})
    // console.log({a})
    for(let i=a.id0; i<a.id1; i++){
      this.rotImgs[i].style.transition = value
      // console.log(this.rotImgs[i].style.transition)
    }
    // if(this.stepSkip.indexOf(step) == -1){
    //   console.error(`step:${step}no step`)
    //   return
    // }
    // a=[this.rotImgIns({type: "step", value: step}),this.rotImgIns({type: "step", value: step+1})]
    // // console.log({a})
    // for(let i=a[0]; i<a[1]; i++){
    //   this.rotImgs[i].style.maxWidth = `${1/speed}s`
    // }
  }
  rotImgIns(data = {type: "step", value: -1}){
    switch(data.type){
      case "step":
        if(data.value < 0  || this.groupRotesCube.length < data.value)
          return {type: "step", check: false}

        let m = this.towRotes.filter((a) => a<this.groupRotesCube[data.value])
        if(this.groupRotesCube.length == data.value)  
          return {type: "step", check: true,
                  id: this.Rotes.length-this.towRotes.filter((a) => a<this.Rotes.length-1).length}
        
        if(this.groupRotesCube.length-1 == data.value)  
          return {type: "step", check: true,
                  id0: this.groupRotesCube[data.value] - this.towRotes.filter((a) => a<this.groupRotesCube[data.value]).length,
                  id1: this.Rotes.length-this.towRotes.filter((a) => a<this.Rotes.length-1).length}
        // imgId = index
        return {type: "step", check: true,
                id0: this.groupRotesCube[data.value] - this.towRotes.filter((a) => a<this.groupRotesCube[data.value]).length,
                id1: this.groupRotesCube[data.value+1] - this.towRotes.filter((a) => a<this.groupRotesCube[data.value+1]).length}

      case "time":
        let _index = this.cubeRotesTime.findLastIndex((x)=>x<data.value)

        if(_index == -1)
          return {type: "time", rotId:-1, imgId:-1, move:-1, rotTime:-1, now: false, imgType:-1}

        // console.log({value:data.value})
        let rotDur  = 1000 / this.cubeRotesData[_index].timeScale
        let rotTime = {start: this.cubeRotesTime[_index], end: this.cubeRotesTime[_index]+ rotDur}
        let move = this.Rotes[_index]
        let max = this.towRotes.filter((a) => a<_index)
        let imgId = _index - max.length
        let imgType = this.towRotes.indexOf(_index  ) != -1 ? "Before" :  
                   this.towRotes.indexOf(_index-1) != -1 ? "After"  : "no"
        // console.log({value:data.value, rotId:_index, imgId, move, rotTime, now: data.value <= rotTime.end, imgType})
        return {type: "time", rotId:_index, imgId, move, rotTime, now: data.value <= rotTime.end, imgType, value:data.value}

        // if(data.value < 0  || this.groupRotesCube.length < data.value)
        //   return undefined

        // max = this.towRotes.filter((a) => a<=this.groupRotesCube[data.value])
        // if(this.groupRotesCube.length == data.value)  
        //   return this.Rotes.length-this.towRotes.filter((a) => a<=this.Rotes.length-1).length

        // // imgId = index
        // return this.groupRotesCube[data.value] - max.length
    }
    // this.rotImgs
    // this.groupRotesCube
    // t=timeList
    // index = t.cubeRotesTime.findLastIndex((x)=>x<time)
    // move = t.Rotes[index]
    // const max = t.towRotes.filter((a) => a<=index)
    // imgId = index - max.length
    // half = max.at(-1) == index-1
    // console.log({id:index,time:t.cubeRotesTime[index], imgId, move, half})

  }

  ins(_Datas, _color_data, _Rotes, _RotPatterns, _Hnad_v = [0, 0]){
    // this.constructor()
    //  計算に必要なデータをまとめる
    this.Rotes = []
    this.Hnad_v = _Hnad_v

    this.sourceData = _Datas
    this.setData = _Datas.copy()
    this.sourceColor_data = _color_data
    this.setColor_data = [..._color_data]
    // console.log(_color_data)
    
    this.moveList=[]

    this.Datas = []
    this.colorData = []

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
          towRotes.push(roteCount-1)
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
    // console.log({stepSkip,inde: this.stepSkip})
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
    // this.colorData.push(this.setColor_data)

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

    // console.log({max,model})
    
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

    const _name = document.createElement("p")

    console.log(_RotPatterns)
    const Pattern = _RotPatterns
    for(let i=0;i<Pattern.length;i++){
      rotas[i].innerHTML = ''
      if(Pattern[i].length == 0){
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
      for(let s=0;s<Pattern[i].length;s++){
        if(Pattern[i][s].length>2){
          len += 1
          const D = imgDiv.cloneNode(), I=img.cloneNode()
          D.classList.remove("img-div")
          D.classList.add("frame-div")
          I.src=`./img/(.png`
          D.append(I)
          
          const PatternName = _name.cloneNode()
          let hit = undefined

          step.forEach((_n, I) => {
            _n[0].forEach((n, J) => {
              if(Pattern[i][s] == n){
                hit = [I, J]
              }
            })         
          })
          PatternName.textContent = `${"ABCDEFG"[hit[0]]}${hit[1]+1}`

          D.append(PatternName)
          rotas[i].append(D)
        }
        for(let j of Pattern[i][s].split(" ")){
          len += 1
          const D = imgDiv.cloneNode(true), I=img.cloneNode()
          I.src=`./img/${j}.png`
          D.append(I)
          rotas[i].append(D)
        }
        if(Pattern[i][s].length>2){
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
    // timeList.imgSpeed = getRuleBySelector(".img-div-back")

    this.rotImgs = document.querySelectorAll(".img-div-back")

    this.stepCount = 0
    this.stopTime = 0
    this.step_move = false

    this.stepChange(this.stepCount)
  }
  meter_set(index){
    this.step_time_meter = new metar({
      id: this.meterData.id,
      el: this.meterData.el,
      start: this.stepStartTime[index],
      end: this.stepStartTime[index+1],
      value: this.stepStartTime[index],
      dx: 10,
      constSet: true,
      callbackfunc: {func1: this, func2: "meter"},
      count_Disp: false,
    })
  }
  step_scroll(index){
    const _list = document.querySelector(".list")
    const hei = _list.children[index].offsetTop
    
    for(let i=0;i<16;i++){
      if(i == index)  continue
      const St = document.querySelectorAll(`.step${i}`)
      for(let s=0;s<St.length;s++)
        St[s].classList.remove("now-step")
    }

    const St = document.querySelectorAll(`.step${index}`)
    for(let i=0;i<St.length;i++)
      St[i].classList.add("now-step")

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
    // console.log({Datas, Rotes, Times, anim})
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
    let new_color = new Array(this.setColor_data.length)
    for(let i=0;i<this.setColor_data.length;i++){
      new_color[i] = this.setColor_data[color_modes[sulb][i]]
    }
    return new_color
  }
  color_set(sc_st, colorData){
    // console.log(`----- color_set ----`)
    const corner = this.model_corners
    const edge = this.model_edges
    const center = this.model_centers


    console.log({sc_st, colorData})

    for(let i=0;i<corner.length;i++){
      // console.log(corner[i])
      let F = corner[i].children
      for(let s=0;s<3;s++)
        F[s+1].material.color = set_color_data[colorData[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
    }

    for(let i=0;i<edge.length;i++){
      let F = edge[i].children
      for(let s=0;s<2;s++)
        F[s+1].material.color = set_color_data[colorData[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
    }

    for(let i=0;i<center.length;i++){
      let F = center[i].children
      F[1].material.color = set_color_data[colorData[color_cn[sc_st.c[i]][0]]]
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

    const index = this.stepSkip[this.stepCount]
    if(index == undefined || index == -1){
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


    const a = this.stepStartTime[index  ]/1000, b = this.stepStartTime[index+1]/1000, p = Data.value/1000

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
        e.removeFromParent()
      }
    })

    // 

    const baseframe = {"co": 0, "ed":1, "ce":2}
    // bone.ce[0].remove(this.frameObj[0])
    F.forEach((e)=>{
      const type = e.slice(0,2)
      const number = this.Datas.at(-1)[type=="ce"?"c":type[0]+"p"][parseInt(e.slice(-2))]
      // console.log({type, number})

      // .indexOf(parseInt(e.slice(-2)))
      const mdl = this.frameObj[baseframe[type]].clone()
      const rot = baseQua[type][number]
      mdl.quaternion.set(rot[0], rot[1], rot[2], rot[3])
      bone[type][number].add(mdl)
    })

  }
}

let timeList

function rotateNext(){
  const list = timeList
  // console.log(`time ${Date.now()%10000}`)
  const index = list.stepSkip[list.stepCount]
  const value = list.stopTime + (Date.now() - list.animation_start_time) * rote_speed// + 10

  let data = {
    step: list.rotImgIns({type:"step", value:index}),
    time: list.rotImgIns({type:"time", value:value})
  }

  if(!data.time.now && data.time.rotId){
    // console.log(`少し前でーす`)
    data.time = list.rotImgIns({type:"time", value:list.cubeRotesTime[data.time.rotId+1] + 1})
  }
  // console.log({index, value, data, })

  if(list.groupRotesCube[index+1] <= data.time.rotId){
    // console.log(`rotateNext ステップ終了`)
    return
  }

  const durSecond = 1 / rote_speed * (data.time.rotTime.end - value - 5)  / (data.time.rotTime.end - data.time.rotTime.start)
  // console.log(`画像 動作中  ステップ残 ${durSecond}s`)

  // list.rotateImgSpeedSet(data.time.imgId, durSecond)
  
  let imgdur = (list.cubeRotesTime[data.time.rotId+1] - value) / rote_speed
  list.rotImgs[data.time.imgId].style.transition = `${durSecond}s linear`


  setTimeout(() => {
    switch(data.time.imgType){
      case "Before":
        list.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
        break
      case "After":
        list.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
        break
      case "no":
        list.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
        break
    }
  },5) 

  if(list.groupRotesCube[index+1] <= data.time.rotId+1 || data.time.rotId+1 == list.Rotes.length ){
    // console.log(`後 ステップ終了前でーす`)
    return 
  }
    list.imgTimeOutId = setTimeout(rotateNext,imgdur) //-10
}
function rotateReverse(){
  const list = timeList
  // console.log(`time ${Date.now()%10000}`)
  const index = list.stepSkip[list.stepCount]
  const value = list.stopTime - (Date.now() - list.animation_start_time) * rote_speed// + 10

  let data = {
    step: list.rotImgIns({type:"step", value:index}),
    time: list.rotImgIns({type:"time", value:value})
  }

  // if(!data.time.now){
  //   console.log(`少し先でーす`)
  //   // data.time = list.rotImgIns({type:"time", value:list.cubeRotesTime[data.time.rotId] - 1})
  // }
  console.log({index, value, data})

  // if(list.groupRotesCube[index] > data.time.rotId){
  //   console.log(`rotateNext ステップ終了`)
  //   return
  // }

  const durSecond = 1 / rote_speed * (value - data.time.rotTime.start  + 5)  / (data.time.rotTime.end - data.time.rotTime.start)
  list.rotImgs[data.time.imgId].style.transition = `${durSecond}s linear`

  // list.rotateImgSpeedSet(data.time.imgId, durSecond)
  

  // console.log(`画像 動作中  ステップ残 ${durSecond}s`)

  setTimeout(() => {
    switch(data.time.imgType){
      case "Before":
        list.rotImgs[data.time.imgId].style.maxWidth = `${0}%`
        break
      case "After":
        list.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
        break
      case "no":
        list.rotImgs[data.time.imgId].style.maxWidth = `${0}%`
        break
    }
  },5) 

  if(data.time.rotId-1 < list.groupRotesCube[index]){
    // console.log(`後 ステップ終了前でーす`)
    return 
  }

  let imgdur = (value - list.cubeRotesTime[data.time.rotId-1] - list.cubeRotesData[data.time.rotId-1].timeScale * 1000) / rote_speed
  // console.log(`次の画像まで ${imgdur}`)
  list.imgTimeOutId = setTimeout(rotateReverse,imgdur) //-10
}
function next_btn_func(){
  const list = timeList
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move)  return

  
  if(list.stepCount == 15){
    // console.log("rote_re_start finish")
    return {skip: true, check: "over"}
  } 
  // console.log("next_btn")
  list.stepCount++

  timeList.stepChange(list.stepCount)
}
function back_btn_func(){
  const list = timeList
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move)  return

  
  if(list.stepCount == 0){
    // console.log("rote_re_start finish")
    return {skip: true, check: "over"}
  }
  // console.log("next_btn")
  list.stepCount--

  timeList.stepChange(list.stepCount)
}
function stop_btn_func(){
  const list = timeList
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(!list.step_move) return

  clearTimeout(list.timeOutId)
  clearTimeout(list.imgTimeOutId)

  const index = list.stepSkip[list.stepCount]
  let durtime =  (Date.now() - list.animation_start_time)
  let dur = list.mode_direction * Math.max(Date.now() - list.animation_start_time, 0) * rote_speed + list.stopTime
  list.rotateImgSpeedSet(index, 0)

  console.log({
    durtime: durtime,
    durtime_x_speed: (durtime * rote_speed),
    max: list.stepStartTime[index+1] - list.stepStartTime[index],
  })

  list.anime_done = true
  list.mode_direction = undefined
  list.step_time_meter.Update_Bar_And_Value({type: "value", value: dur})
  list.meterBar.classList.remove("meter-animating")
  list.remove_Animation()
  list.step_move = false

  
  const value = dur

  let data = {
    step: list.rotImgIns({type:"step", value:index}),
    time: list.rotImgIns({type:"time", value:value})
  }
  console.log(data)
  
  list.rotateImgSet(index, 0)
  list.rotateImgSpeedSet(index, 0)
  
  for(let i=data.step.id0; i<data.time.imgId; i++)  list.rotImgs[i].style.maxWidth = `${100}%`

  if(data.time.now){
    const percent = (value - data.time.rotTime.start)  / (data.time.rotTime.end - data.time.rotTime.start)
    // console.log(`動作中 perc:${percent}`)
    switch(data.time.imgType){
      case "Before":
        // console.log(`now Before ${100*percent}`)
        list.rotImgs[data.time.imgId].style.maxWidth = `${50*percent}%`
        break
      case "After":
        // console.log(`now After ${50*percent+50}`)
        list.rotImgs[data.time.imgId].style.maxWidth = `${50*percent+50}%`
        break
      case "no":
        // console.log(`now no ${100*percent}`)

        list.rotImgs[data.time.imgId].style.maxWidth = `${100*percent}%`
        break
    }
  }
  else{
    switch(data.time.imgType){
      case "Before":
        list.rotImgs[data.time.imgId].style.maxWidth = `${50}%`
        break
      case "After":
        list.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
        break
      case "no":
        list.rotImgs[data.time.imgId].style.maxWidth = `${100}%`
        break
    }
  }
}
function play_btn_func(){
  const list = timeList
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move) return

  const index = list.stepSkip[list.stepCount]

  if(index == -1){
    // console.log("rote_re_start skip")
    return {skip: true, }
  }
  let value = list.step_time_meter.value

  if(list.step_time_meter.value == list.step_time_meter.f1){
    value = list.step_time_meter.f0
    list.meterBar.style.maxWidth = "0%"
    list.rotateImgReset(index, 0)
  }

  list.rotImgPlay(value)

  list.anime_done = true
  list.mode_direction = 1
  list.animation_start_time = -1
  list.animStyle.style.transitionDuration = `${(list.stepStartTime[index+1] - value) / rote_speed}ms`

  list.step_move = true
  list.stopTime = value

  setTimeout(() => {
    list.meterBar.classList.add("meter-animating")
  }, 5)


  setTimeout(() => {
    list.animation(
      value/1000,
      list.stepStartTime[index+1]/1000, rote_speed)
    list.animation_start_time = Date.now()
    list.meterBar.style.maxWidth = "100%"
  }, 10)


  list.timeOutId = setTimeout(() => {
    list.step_move = false
    list.meterBar.classList.remove("meter-animating")
    list.step_time_meter.Update_Bar_And_Value({type: "value",value: list.step_time_meter.f1})
    list.rotateImgSpeedSet(index, 0)
  },
    (list.stepStartTime[index+1] - value) / rote_speed + 10
  )
}
function reverse_btn_func(){
  const list = timeList
  // console.log("settimeput 22")
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move) return

  const index = list.stepSkip[list.stepCount]

  if(index == -1){
    // console.log("rote_re_start skip")
    return {skip: true, }
  }
  let value = list.step_time_meter.value

  if(list.step_time_meter.value == list.step_time_meter.f0){

    value = list.step_time_meter.f1
    list.meterBar.style.maxWidth = "100%"
    list.rotateImgReset(index, 100)
  }

  list.rotImgReverse(value)

  list.anime_done = true
  list.mode_direction = -1
  list.animation_start_time = -1
  list.animStyle.style.transitionDuration = 
    `${(value - list.stepStartTime[index]) / rote_speed}ms`

  list.step_move = true
  list.stopTime = value


  setTimeout(() => {
    list.meterBar.classList.add("meter-animating")
    list.rotateImgSpeedSet(index, rote_speed)
  }, 5)

  // console.log({start: value, end: list.stepStartTime[index], dur: list.stepStartTime[index+1] - value})

  setTimeout(() => {
    list.animation(
      value/1000,
      list.stepStartTime[index]/1000, rote_speed)
    list.animation_start_time = Date.now()
    list.meterBar.style.maxWidth = "0%"
  }, 10)

  list.timeOutId = setTimeout(() => {
    // console.log("list.timeOutId")
    list.step_move = false
    list.meterBar.classList.remove("meter-animating")
    list.step_time_meter.Update_Bar_And_Value({type: "value",value: list.step_time_meter.f0})
  },
    (value - list.stepStartTime[index]) / rote_speed + 10
  )
}
function execution_btn_func(){
  const list = timeList
  // console.log("settimeput 22")
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move) return

  list.learning_btn.style.display = "none"

  list.next_btn.removeEventListener("click",next_btn_func)
  list.back_btn.removeEventListener("click",back_btn_func)
  list.stop_btn.removeEventListener("click",stop_btn_func)
  list.play_btn.removeEventListener("click",play_btn_func)
  list.reverse_btn.removeEventListener("click",reverse_btn_func)
  list.execution_btn.removeEventListener("click",execution_btn_func)
  list.learning_btn.removeEventListener("click",learning_btn_func)
  list.stepList.removeEventListener("click",stepList_func)
  
  list.full_cube.object3D.traverse((e)=>{
    if(e.type=="Group" && ( e.name=="fco" || e.name=="fce" || e.name=="fed")){
      e.removeFromParent()
    }
  })

  list.frame_set(0)

  list.full_cube.object3D.children[0].animations.pop()
  list.L_hand.object3D.children[0].animations.pop()
  list.R_hand.object3D.children[0].animations.pop()

  list.color_set(list.setData, list.setColor_data)
  list.sourceData = list.setData
  list.sourceColor_data = list.setColor_data
  
  console.log("解説　終了")
  mode.Complete()
}

function learning_btn_func(){
  const list = timeList
  // console.log("settimeput 22")
  const mode  = document.getElementById("scene").components["cube-mode"]
  console.log({s:0, cube_mode: mode.data.cube_mode})
  if(list.step_move) return
  if(mode.data.cube_mode != "Execution" && mode.data.cube_mode != "learning") return

  const index = list.stepSkip[list.stepCount]

  if(mode.data.cube_mode == "Execution"){
    list.frame_set(0)
    list.sourceData = list.setData.apply_move(list.Datas[list.groupRotesCube[index]])
    list.color_set(list.sourceData, list.setColor_data)

    list.full_cube.object3D.traverse((e)=>{
      if(e.type=="Group" && ( e.name=="fco" || e.name=="fce" || e.name=="fed")){
        e.removeFromParent()
      }
    })

    list.L_hand.object3D.visible = false
    list.R_hand.object3D.visible = false
    // this.color_set(sc_st, _colorData)

    list.learning_btn.querySelector("p").textContent = '解説モードへ'

    mode.Mode_set("learning")
    console.log("解説 => 学習")
    console.log({s:1, cube_mode: mode.data.cube_mode})
  }
  else if(mode.data.cube_mode == "learning"){
    mode.Mode_set("Execution")

    list.L_hand.object3D.visible = true
    list.R_hand.object3D.visible = true
    
    console.log({Datas:list.setData, setColor_data:list.setColor_data})
    list.color_set(list.setData, list.setColor_data)

    list.learning_btn.querySelector("p").textContent = '試行モードへ'

    list.stepChange(list.stepCount)

    console.log("学習 => 解説")
    console.log({s:2, cube_mode: mode.data.cube_mode})
  }

  // list.frame_set(0)

  // color_set(scrambled_state)
  
  // console.log("学習")
  // mode.Complete()
}

function stepList_func(e){
  const list = timeList
  const mode  = document.getElementById("scene").components["cube-mode"]
  if(mode.data.cube_mode !== "Execution")	return
  if(list.step_move) return

  let newStep = -1
  console.log(e.target.classList)
  if(list.step_move){
    console.log(`動作中`)
    return
  }

  if(e.target.classList.contains("step-lists")){
    console.log(`枠 return`)
    return
  }
  
  if(e.target.classList.contains("step-mode")){
    console.log(`step return`)
    if(parseInt(e.target.classList[1].slice(4)) == list.stepCount) return
    newStep = e.target.classList[1].slice(4)
  }

  else{
    console.log(`step in step return`)
    newStep = e.target.classList[0].slice(4)
  }

  list.stepChange(parseInt(newStep))
}