class motionList{
  constructor(){
    this.Rotes = []
    this.Hnad_v = [0,0]
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

    this.L_time_index = -1
    this.R_time_index = -1
    this.Cube_time_index = -1
    
    this.colorData = []
    this.color_data = [0,1,2,3,4,5]

    this.frameCubeData = []

    const root = document.getElementById('root')
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
  
      const dis = Rtime.move_schedule[Rtime.handIndex].timeScale * 1000
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
      const dis = Rtime.move_schedule[Rtime.handIndex].timeScale * 1000
      for(let i=0;i<Ltime.move_schedule.length;i++)
        Ltime.move_schedule[i].time += dis
      Ltime.time += dis
      Ltime.sovle_time += dis
    }
    else if(Ltime.handIndex != -1 && Rtime.move_schedule[Rtime.handIndex].clip){
      const dis = Ltime.move_schedule[Ltime.handIndex].timeScale * 1000
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
    return data1
      
      // console.log(JSON.parse(JSON.stringify({L:Ltime, R:Rtime})))
      // console.log({L:Ltime, R:Rtime})
    // Lhand.setAttribute('animation-mixer', {
    // 	clip: s.clip,
    // 	loop: 'once',
    // 	timeScale: s.timeScale,
    // 	clampWhenFinished: true,
    // })
  } 
  frame_rotate(sulb, scrambled_state, step, time, anime = false){
    let data = {
      rote: false,
      type: undefined,
      innerVec: undefined,
      aniData: {},
    }

    // let hand_xyz = this.hand_xyz
    // let frame_pos = this.frame_pos

    let text = "\n\n"
    // text+=`hand_xyz [${hand_xyz.length==0?"None":hand_xyz.join(',')}]\n`
    
    if(step>=12)	return data

    const moves_face_c = [
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
     
    const moves_face_e = [
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
    
    const moves_face_cn = [
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

    const rote = {
      ce: ["0 180 0","0 90 0","0 0 0","0 -90 0","-90 0 0","90 0 0"],
      e:  [
        "0 -90 90","0 90 -90","0 90 90","0 -90 -90","0 180 0","0 90 0",
        "0 0 0","0 -90 0","0 180 180","0 90 180","0 0 180","0 -90 180"
        ],
      c: [
        "0 180 0","0 90 0","0 0 0","0 270 0",
        "0 270 180","0 180 180","0 90 180","0 0 180"
        ],
    }

    const parts__Angle = [
      10,10,10,10,  6,6,6,6,  2,2,2,2,
    ]

    const type = (4 <= step && step < 8)?"c":"e"
    const typeName = type=="c"?"corner":"edge"
    const ss = scrambled_state
    let new_ang = parts__Angle[step]

    text+=`ang ${new_ang} `
    // for(let han of hand_xyz){		new_ang = moves[han][`${type}p`].indexOf(new_ang);		text+=`-> ${new_ang} `;	}
    text+='\n'
    
    // if(sulb != undefined && sulb[0]>"a"){
    //   if(hand_xyz.length > 0 && hand_xyz.at(-1)[0] == sulb[0] && hand_xyz.at(-1) != sulb )			hand_xyz.pop()
    //   else			hand_xyz.push(sulb)
    // }

    const pos = ss[`${type}p`].indexOf(new_ang)

    data.innerVec = rote[type][pos]
    data.type = typeName
    data.frameParts = pos
  
  
  //  console.log({sulb})
    const index = faces.indexOf(sulb[0])
    const mode_parts = type=="c"?moves_face_c:moves_face_e
    // console.log(mode_parts)
    // console.log(mode_parts[index])
    const mode = mode_parts[index].indexOf(pos)
  
    text += `sulb [${sulb}]  type [${type}]  mode [${mode!=-1?mode:"None"}]  pos [${pos}] rote [${rote[type][pos]}]\n`
    // text += `[${.join(',')}]\n`
    text += `index [${index}]\n`
    text += `mode_parts[index] [${mode_parts[index].join(',')}]\n`
    text += `indexOf [${mode_parts[index].indexOf(pos)}]\n`
  
    if(mode==-1){
      text += `--------- NO rotation ---------\n\n`
    //  console.log(text)
      return data
    }
  
    data.rote = true
    
    const rad = sulb[1]
    const size = (rad=='\'')?-1:((rad=='2')?2:1)
    text+=	`anime [${anime}]  rot [rotation.${vec.charAt(index)}]  to [${faces_rad[index] * 90 * size}]`
  
    const next_pos = moves[sulb][`${type}p`].indexOf(pos)
    // data.frameParts_next = next_pos
  
  //  console.log(text+"\n\n")
      // frame.setAttribute('animation', )
    data.aniData = {
      property: 'rotation.'+vec.charAt(index),
      dur: time,
      from: 0,
      to: faces_rad[index] * 90 * size,
      easing: 'linear',
    }
    
    return data
    //   setTimeout(() => {
    //     pointM([typeName,pos],false)
    //     pointM([typeName,next_pos],true)
    //   },time)
    // }
  }
  set_timeList(_Rotes){
    for(let i=0;i<_Rotes.length;i++){
      let a= this.one_motion(_Rotes[i],1,0)
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
  pointM(p,T = true){
    // console{p, T})
    if(p[0]=="")	return
    // console.log(p)
    const A = p[0]=="corner"?model_corners:(p[0]=="center"?model_centers:model_edges)
    const P = A[p[1]].children
    // document.getElementById(p).children[0].object3D.children[0].children[0].children
    // console.log(`pointM name [${p}] ${T}`)
    if(T){
      for(let i=0;i<P.length-1;i++){
        P[i].material.side=0
        P[i].material.depthTest=false
        P[i].renderOrder=3
      }
    }
    else{
      for(let i=0;i<P.length-1;i++){
        P[i].material.side=2
        P[i].material.depthTest=true
        P[i].renderOrder=0
      }
    }
  }
  ins(_Datas, _Rotes){
    let towRotes = [], groupRotes = [0]
    let _R = _Rotes
 
    for(let lindex=0;lindex<_R.length;lindex++){
      for(let rindex=0;rindex<_R[lindex].length;rindex++){
        let dx = 0
        if(_R[lindex][rindex].length > 1 && _R[lindex][rindex][1] == "2"){
          towRotes.push([lindex,rindex+dx])
          dx += 1
          _R[lindex][rindex] = [_R[lindex][rindex][0],_R[lindex][rindex][0]]
        }
      }
      _R[lindex] = _R[lindex].flat(Infinity)
      groupRotes.push(groupRotes.at(-1) + _R[lindex].length)
    }

    let _nR = JSON.parse(JSON.stringify(_R))
  //  console.log(_nR)

    _R = _R.filter((line) => line[0] != "")

    _R = _R.flat(Infinity)
    // console.log(_R)
  //  console.log(groupRotes)
    // console.log(towRotes)
    this.groupRotesCube = groupRotes

    this.Rotes = _R

    this.set_timeList(this.Rotes)

    this.groupRotesLhand = []
    this.groupRotesRhand = []

    let tnkTime = 0
    this.moveList.forEach((m, index) => {
      if(this.groupRotesCube.indexOf(index) != -1){
        // console.log(`index ${index}`)
        this.groupRotesLhand.push(this.LhandRotesData.length)
        this.groupRotesRhand.push(this.RhandRotesData.length)
      }

      if(m.moveMode != 1){
        m.L.move_schedule.forEach((m2) => {
          this.LhandRotesTime.push(tnkTime + m2.time)
          this.LhandRotesData.push({clip: m2.clip,  timeScale:  m2.timeScale, })
        })
      }
      if(m.moveMode > 0){
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

    // console.log(this.groupRotesLhand)

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
    this.Datas.push(_Datas)
    
    this.color_data = [0,1,2,3,4,5]
    this.colorData = []
    this.colorData.push(this.color_data)
    
    // this.hand_xyz = []

    // this.frame_pos = ["",""]

  //  console.log(_nR)

    this.frameRotesData = []
    for(let lindex=0;lindex<_nR.length;lindex++){
    //  console.log({rindexMax , rotes: _nR[lindex], len: _nR[lindex].length + rindexMax})
      for(let rindex=0;rindex<_nR[lindex].length;rindex++){
      //  console.log(` index: [${rindex}]`)
        // console.log(_nR[lindex][rindex])
        this.frameRotesData.push(this.frame_rotate(_nR[lindex][rindex], this.Datas.at(-1), lindex, 0))
        let scmbl = undefined
        if(_nR[lindex][rindex] > "Z"){
          this.color_data = this.color_re_set(_nR[lindex][rindex])
          scmbl = this.Datas.at(-1).hand_move(moves[_nR[lindex][rindex]])
        }
        else{
          scmbl = scamble2state(this.Datas.at(-1), _nR[lindex][rindex])
        }

        this.Datas.push(scmbl)
        this.colorData.push(this.color_data)
      }
      if(lindex == 12)  this.frameRotesData.at(-_nR[lindex].length).Previous = true //
    }
  //  console.log(this.frameRotesData)

    tnkTime += 1000 / this.cubeRotesData.at(-1).timeScale
  //  console.log(`tnkTime [${tnkTime}]`)
  }
  color_set(sc_st, _colorData){
    // console.log(`----- color_set ----`)
    const corner = model_corners
    const edge = model_edges
    const center = model_centers

    const colorData = _colorData

    // console.log(sc_st)

    for(let i=0;i<corner.length;i++){
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
  rote_start(){
    this.L_time_index = -1
    this.R_time_index = -1
    this.Cube_time_index = -1

    L_hand.addEventListener("animation-start",(e)=>{
      this.L_time_index += 1
      const Lti = this.L_time_index
      const data = {...this.LhandRotesData[Lti]}
      data.loop = 'once'
      data.clampWhenFinished = true

      L_hand.removeAttribute('animation-mixer')
      L_hand.setAttribute('animation-mixer', data)
    })
    L_hand.addEventListener("animation-finished",(e)=>{
      const Lti = this.L_time_index
      if(Lti == this.LhandRotesData.length-1){
      //  console.log("L_hand アニメーション　終了")
        return
      }

      const index = this.LstartIndex.indexOf(Lti + 1)
      if(index != -1){
      //  console.log(`L_hand 区切りのアニメーション`)
        return
      }
      
      if(this.groupRotesLhand.indexOf(Lti + 1) != -1){
      //  console.log(`L_hand 区切りのアニメーション`)
        return
      } 

      let handL = this.LhandRotesTime[Lti+1]
      handL -= this.LhandRotesTime[Lti]
      handL -= this.LhandRotesData[Lti].timeScale * 1000
      
      setTimeout(()=>{
        L_hand.dispatchEvent(new Event( "animation-start"))
      },handL)
    })

    R_hand.addEventListener("animation-start",(e)=>{
      this.R_time_index += 1
      const Rti = this.R_time_index
      const data = {...this.RhandRotesData[Rti]}
      data.loop = 'once'
      data.clampWhenFinished = true

      R_hand.removeAttribute('animation-mixer')
      R_hand.setAttribute('animation-mixer', data)
    })
    R_hand.addEventListener("animation-finished",(e)=>{
      const Rti = this.R_time_index
      if(Rti == this.RhandRotesData.length-1){
      //  console.log("R_hand アニメーション　終了")
        return
      }

      const index = this.RstartIndex.indexOf(Rti + 1)
      if(index != -1){  //  && this.RcubeIndex[index] != -1
        // console.log(`R_hand 区切りのアニメーション`)
        return
      }

      //  console.log(`Rti [${Rti}] gRRh [${this.groupRotesRhand.indexOf(Rti + 1)}]`)
      if(this.groupRotesRhand.indexOf(Rti + 1) != -1){
      //  console.log(`R_hand 区切りのアニメーション`)
        return
      } 

      let handR = this.RhandRotesTime[Rti+1]
      handR -= this.RhandRotesTime[Rti]
      handR -= this.RhandRotesData[Rti].timeScale * 1000
      
      setTimeout(()=>{
        R_hand.dispatchEvent(new Event( "animation-start"))
      },handR)
    })

    full_cube.addEventListener("animation-finished",(e)=>{
      const Cti = this.Cube_time_index
      if(Cti == this.cubeRotesData.length-1){
      //  console.log("full_cube アニメーション　終了")
        return
      }
      if(this.groupRotesCube.slice(1).indexOf(Cti+1) != -1){
      //  console.log("ステップ　アニメーション　終了")
        return
      }

      let full_c = this.cubeRotesTime[Cti+1]
      full_c -= this.cubeRotesTime[Cti]
      full_c -= this.cubeRotesData[Cti].timeScale * 1000
      
      setTimeout(()=>{
        full_cube.dispatchEvent(new Event( "animation-start"))
      },full_c)
    })
    full_cube.addEventListener("animation-start",(e)=>{
      this.color_set(this.Datas[this.Cube_time_index+1], this.colorData[this.Cube_time_index+1])

      this.Cube_time_index += 1
      const Cti = this.Cube_time_index

      const data = {...this.cubeRotesData[Cti]}
      data.loop = 'once'
      data.clampWhenFinished = true
      full_cube.removeAttribute('animation-mixer')
      full_cube.setAttribute('animation-mixer', data)

      const fdata = {...this.frameRotesData[Cti]}
      // console.log(fdata)
      if(fdata.type != undefined){
        frameObj[fdata.type=="corner"?"edge":"corner"].out.object3D.visible = false
        
        frameObj[fdata.type].in.setAttribute("rotation", fdata.innerVec)
        frameObj[fdata.type].out.removeAttribute('animation')
        frameObj[fdata.type].out.setAttribute('rotation',"0 0 0")
        frameObj[fdata.type].out.object3D.visible = true

        // console.log({fdata})
        this.pointM([fdata.type, fdata.frameParts], true)

        let pdata = this.frameRotesData.slice(0, Cti).findLast((e) => e.rote)
        // console.log({data: this.frameRotesData.slice(0, Cti), pdata})
        if(pdata != undefined){
          // const pdata = this.frameRotesData[pindex]
          // console.log({type: pdata.type, frameParts: pdata.frameParts})
          this.pointM([pdata.type, pdata.frameParts], false)
        }

        if(fdata.rote){
          fdata.aniData.dur = 1000 / data.timeScale
          frameObj[fdata.type].out.setAttribute('animation', fdata.aniData) 
        }
      }

      if(Object.hasOwn(fdata, "Previous")){
      // console.log(`----------\n Previous \n----------`)
        let pdata = this.frameRotesData.slice(0, Cti).findLast((e) => e.rote)
        frameObj[pdata.type].out.object3D.visible = false
        this.pointM([pdata.type, pdata.frameParts], false)
      }

      const Lti = this.L_time_index + 1
      const Lindex = this.LstartIndex.indexOf(Lti)
      if(Lindex != -1 && this.LcubeIndex[Lindex] == Cti){
        let handL = this.LhandRotesTime[Lti]
        handL -= this.cubeRotesTime[Cti]
      
        setTimeout(()=>{
          L_hand.dispatchEvent(new Event( "animation-start"))
        },handL)
      }

      const Rti = this.R_time_index + 1
      const Rindex = this.RstartIndex.indexOf(Rti)
      if(Rindex != -1 && this.RcubeIndex[Rindex] == Cti){
        let handR = this.RhandRotesTime[Rti]
        handR -= this.cubeRotesTime[Cti]
      
        setTimeout(()=>{
          R_hand.dispatchEvent(new Event( "animation-start"))
        },handR)
      }
    })

    if(this.LcubeIndex[0] == -1){
      setTimeout(()=>{
        L_hand.dispatchEvent(new Event("animation-start"))
      },this.LhandRotesTime[0])
    }

    if(this.RcubeIndex[0] == -1){
      setTimeout(()=>{
        R_hand.dispatchEvent(new Event("animation-start"))
      },this.RhandRotesTime[0])
    }
    
    setTimeout(()=>{
      full_cube.dispatchEvent(new Event("animation-start"))
    },this.cubeRotesTime[0])
  }
  rote_re_start(){
    let text = ""

    const Cti = this.Cube_time_index + 1

    const Lti = this.L_time_index + 1
    const Lindex = this.LstartIndex.indexOf(Lti)

    const Rti = this.R_time_index + 1
    const Rindex = this.RstartIndex.indexOf(Rti)

    let handC = this.cubeRotesTime[Cti]
    handC -= Math.min(
      this.cubeRotesTime[Cti],
      this.LhandRotesTime[Lti],
      this.RhandRotesTime[Rti]
    )

    // text += JSON.stringify({
    //   cRT: this.cubeRotesTime[Cti], LhRT: this.LhandRotesTime[Lti], RhRT: this.RhandRotesTime[Rti]
    // }) + "\n"
    // text += JSON.stringify({
    //   Cti, Lti, Lindex, Rti, Rindex, handC
    // })

    setTimeout(()=>{
      full_cube.dispatchEvent(new Event("animation-start"))
    },handC)

    if(Lindex == -1 && this.LstartIndex.findIndex((e) => e > Lti) < Cti){
      let handL = handC
      handL -= (this.cubeRotesTime[Cti] - this.LhandRotesTime[Lti])
      // text += `\n{handL: ${handL}}`
      setTimeout(()=>{
        L_hand.dispatchEvent(new Event("animation-start"))
      },handL)
    }

    if(Rindex == -1 && this.RstartIndex.findIndex((e) => e > Rti) < Cti){
      let handR = handC
      handR -= (this.cubeRotesTime[Cti] - this.RhandRotesTime[Rti])
      // text += `\n{handR: ${handR}}`
      setTimeout(()=>{
        R_hand.dispatchEvent(new Event("animation-start"))
      },handR)
    }
    // console.log(text)
  }
}
const timeList = new motionList()


    // this.el.addEventListener("mousedown", (e)=>{
    //   if(!e.currentTarget.classList[0]=="meter-out")  return
    //   if(this.meter_on) return
    //   // console.log("mousedown")
    //   this.meter_on=true
    //   this.meter_updata(e)
    // })