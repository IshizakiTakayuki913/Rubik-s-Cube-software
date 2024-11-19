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
    // this.color_set(sc_st)
    

  }
  ins(_Datas, _Rotes, _color_data, _Hnad_v = [0, 0]){
    // this.constructor()

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
    

    this.L_time_index = -1
    this.R_time_index = -1
    this.Cube_time_index = -1
    
    this.stepAnimationEnd = 0
    
    this.colorData = []
    this.color_data = _color_data

    let towRotes = [], groupRotes = [0], stepSkip = []
    let _R = _Rotes
    
    let roteCount = 0

    stepSkip = _R.map((e) => e[0].length > 0)

    // console.log(_R)
    _R = _R.filter((e) => e[0].length > 0)
    // console.log(_R)

    for(let lindex=0;lindex<_R.length;lindex++){
      for(let rindex=0;rindex<_R[lindex].length;rindex++){
        // let dx = 0
        if(_R[lindex][rindex].length > 1 && _R[lindex][rindex][1] == "2"){
          towRotes.push(roteCount)
          // dx += 1
          _R[lindex][rindex] = [_R[lindex][rindex][0],_R[lindex][rindex][0]]
          roteCount ++
        }
        roteCount ++
      }
      _R[lindex] = _R[lindex].flat(Infinity)
      // console.log(_R[lindex])
      if(_R[lindex][0].length > 0)
        groupRotes.push(groupRotes.at(-1) + _R[lindex].length)
    }

    let _nR = JSON.parse(JSON.stringify(_R))
    // console.log(_nR)

    _R = _R.filter((line) => line[0] != "")

    _R = _R.flat(Infinity)

    this.towRotes = towRotes
    this.stepSkip = stepSkip
    

    this.groupRotesCube = groupRotes

    this.Rotes = _R

    this.set_timeList(this.Rotes)

    this.groupRotesLhand = []
    this.groupRotesRhand = []

    let tnkTime = 0
    this.moveList.forEach((m, index) => {
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
    this.Datas.push(
        new State(	
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5],
      )
    )

    this.colorData = []
    this.colorData.push(this.color_data)
    
    // this.hand_xyz = []

    // this.frame_pos = ["",""]

    // console.log(_nR)

    this.frameRotesData = []
    for(let lindex=0;lindex<_nR.length;lindex++){
      // console.log({rindexMax , rotes: _nR[lindex], len: _nR[lindex].length + rindexMax})
      for(let rindex=0;rindex<_nR[lindex].length;rindex++){
        // console.log(` index: [${rindex}]`)
        // console.log(_nR[lindex][rindex])
        this.frameRotesData.push(this.frame_rotate(_nR[lindex][rindex], this.Datas.at(-1), lindex, 0))
        let scmbl = undefined
        // if(_nR[lindex][rindex] > "Z"){
        //   this.color_data = this.color_re_set(_nR[lindex][rindex])
        //   scmbl = this.Datas.at(-1).hand_move(moves[_nR[lindex][rindex]])
        // }
        // else{
          scmbl = scamble2state(this.Datas.at(-1), _nR[lindex][rindex])
        // }

        this.Datas.push(scmbl)
        this.colorData.push(this.color_data)
      }
      if(lindex == 12)  this.frameRotesData.at(-_nR[lindex].length).Previous = true //
    }
    // console.log(this.frameRotesData)

    tnkTime += 1000 / this.cubeRotesData.at(-1).timeScale
    // console.log(`tnkTime [${tnkTime}]`)

    this.L_time_index = -1
    this.R_time_index = -1
    this.Cube_time_index = -1

    this.mew_motion = false

    this.cube_Full_Animation_Make(this.Datas, this.cubeRotesData, this.cubeRotesTime)

    this.full_motion_set(
      "L-hand", this.LhandRotesData, this.LhandRotesTime)
    this.full_motion_set(
      "R-hand", this.RhandRotesData, this.RhandRotesTime)
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
    
    for(let j=0;j<model.length;j++){
      if(last_time[j] == max) continue
      
      const model = model[j][2]
      const full = model.object3D.children[0].animations.find((e) => e.name == "fullanimation")
      
      full.duration = max
      
      for(let i=0;i<full.tracks.length;i++){
          full.tracks[i].times.push(max)
          full.tracks[i].values = full.tracks[i].values
              .concat(full.tracks[i].values.slice(full.tracks[i].name.split(".")
                                                  .at(-1)[0]=="q"?-4:-3))
      }
    
    }

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
  
    const faces = ['U', 'R', 'L', 'F', 'D', 'B', 'x', 'y', 'z', 'r', 'l', 'u', 'd', 'f', 'b']
  
    // console.log({sulb})
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
      // console.log(text)
      return data
    }
  
    data.rote = true
    
    const rad = sulb[1]
    const size = (rad=='\'')?-1:((rad=='2')?2:1)
    const vec	= 'yxxzyzxyzxxyyzz'
    text+=	`anime [${anime}]  rot [rotation.${vec.charAt(index)}]  to [${faces_rad[index] * 90 * size}]`
  
    const next_pos = moves[sulb][`${type}p`].indexOf(pos)
    // data.frameParts_next = next_pos
  
    // console.log(text+"\n\n")
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
  pointM(p,T = true){
    // console.log({p, T})
    if(p[0]=="")	return
    // console.log(p)
    const A = p[0]=="corner"?this.model_corners:(p[0]=="center"?this.model_centers:this.model_edges)
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
  animation_re_set(){
    this.mew_motion = true
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
    console.log(full)
  }
  lastTimeGet(model, roteData) {
    const fa = model.object3D.children[0].animations
    return fa.find((e) => e.name == roteData.at(-1).clip).duration  
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
}

let timeList