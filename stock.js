function pict() {
  const a= document.getElementById('scene')
  const s = a.components.screenshot
  const a_aspect = a.clientWidth / a.clientHeight
  const s_aspect = s.data.width / s.data.height
  let n_w =  s.data.width, n_h = s.data.height
  if(a_aspect < s_aspect) n_w = n_h * a_aspect
  else  n_h = n_w / a_aspect

  console.log(`a [${a_aspect}] s [${s_aspect}] n [${n_w/n_h}]`)
  s.data.width = parseInt(n_w)
  s.data.height = parseInt(n_h)
  console.log(s.data)
  s.capture('perspective')
}

function objopacty(ojb, op1 = 0.5, op2 = undefined) {
  const F = ojb.object3D.children[0].children[0].children
  for(let s=0;s<F.length;s++){
      F[s].material.opacity = op1
      F[s].material.transparent = true
  }
}
function cubeOpa(op1,op2=undefined) {
  const cn = document.getElementById('center').children
  for(let i=0;i<cn.length;i++)
      objopacty(cn[i].children[0], op1,op2)
      
  const c = document.getElementById('corner').children
  for(let i=0;i<c.length;i++)
      objopacty(c[i].children[0], op1,op2)
      
  const e = document.getElementById('edge').children
  for(let i=0;i<e.length;i++)
      objopacty(e[i].children[0], op1,op2)
}
let solved_state = new State(
  [2,0,0,1,0,0,0,0],
  [1,3,0,2,4,5,6,7],
  [1,1,1,1,0,0,0,0,0,0,0,0],
  [7,5,0,6,2,3,4,1,8,9,10,11],
  [0,1,2,3,4,5],
)

function bit(D){
  let c = D
  for(;c.length<6;)	c = '9' + c
  let a = parseInt(c)
  let b = 0
  for(let i=5;i>=0;i--){
    let c = a%10
    if(c == i) {
      b++
      a = parseInt(a/10)
      console.log(`c ${c} a ${a}`)
    }
    b = b << 1
  }
  b= b >> 1

  console.log(b)
  console.log(b.toString(2))
}

function bit2(D){
  let d = D
  for(;d.length<12;)	d = 'F' + d
  // console.log(`d ${d}`)
  let a = d
  let b = 0

  for(let i=11;i>=0;i--){
    let c = a[a.length-1]
    // console.log(`c ${c} to ${i.toString(16)}`)
    if(c == i.toString(16)) {
      b++
      a = a.substring(0,a.length-1)
      // console.log(`c ${c} a ${a}`)
    }
    b = b << 1
  }
  b= b >> 1

  // console.log(b)
  // console.log(b.toString(2))
  return b
}

const data = [
  "0148",
  "1259",
  "236a",
  "037b",
  "4567",
  "89ab",
]

const data2 = [
  "0145",
  "1256",
  "2367",
  "0348",
  "0123",
  "4567",
]
let tnk = [[],[]]
for(let a of data) tnk[0].push(bit2(a))
for(let a of data2) tnk[1].push(bit2(a))
  
  
function num(type, pos){
  const CTS={
    e: [275, 550, 1100, 2185, 240, 3840],
    c: [51, 102, 204, 153, 15, 240]
  }
  let a = (2 ** 12) -1
  for(let n of pos)	a &= CTS[type][n]
  return ((Math.log2(a)<0)?-1:Math.log2(a))
}

console.log(num("c",[2,0,4]))

function hit(px,py) {
    
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = ( px / window.innerWidth ) * 2 - 1;
  pointer.y = - ( py / window.innerHeight ) * 2 + 1;
  
  const Cam= camIn.components.camera.camera
  
  
  raycaster.setFromCamera( pointer, Cam );
  
  
  const  targetEls = document.querySelectorAll('.clickable')
  const  targetObj= [];
  for (var i = 0; i < targetEls.length; i++) {
    targetObj.push(targetEls[i].object3D);
  }
  
  const intersects = raycaster.intersectObjects( targetObj);
  return intersects
  }
  

const intersects =hit(175,250)
for ( let i = 0; i < intersects.length; i ++ ) {
    console.log(intersects[ i ].object.el)
}

// const rad=Math.PI/3,Rin=60,Rout=100,count=5
// function XX (r,x,y) {return x*Math.cos(r)-y*Math.sin(r)}
// function YY (r,x,y) {return x*Math.sin(r)+y*Math.cos(r)}

// let text = ``
// text += `M ${Rin} ${0} `
// for(let i=0;i<=count+1;i++)
//   text += `L ${Rout*Math.cos(rad/(count+1)*i)} ${Rout*Math.sin(rad/(count+1)*i)} `
// for(let i=count+1;i>=0;i--)
//   text += `L ${Rin*Math.cos(rad/(count+1)*i)} ${Rin*Math.sin(rad/(count+1)*i)} `
// text += `L ${Rin} ${0} Z`

// const menu = document.getElementById('color-menu')
// for(let i=0;i<6;i++){
//   const out_clip = document.createElement('div')
//   const clip = document.createElement('div')
//   const color = set_color_data[i]
//   // console.log(color)
  
//   clip.classList.add('sector')
//   clip.style.clipPath = `path('${text}')`
//   clip.style.opacity = 0.6
//   clip.style.translate = `50% 50%`
//   clip.style.background = `rgb(${parseInt(color.r*255)},${parseInt(color.g*255)},${parseInt(color.b*255)})`
  
//   out_clip.style.position = "absolute"
//   out_clip.style.translate = `-50% -50%`
//   out_clip.style.transform = `rotate(${i*60}deg)`
//   out_clip.id=`c${i}`
//   out_clip.appendChild(clip)
//   menu.appendChild(out_clip)
// }


// <div id="color-menu-screen" class="color-menu-screen">
// <div id="color-menu" class="color-menu">
//   <div class="color-menu-center"></div>
// </div>
// </div>


    // const icon = document.getElementById('ins-screen')
    
    // <a-entity id="center" position="0 0 0">
    //   <a-entity id="center0" position="0 0 0">
    //     <a-entity
    //       rotation="0 180 0"
    //       mixin="m_ce m_normal"
    //       class="clickable cube">
    //     </a-entity>
    //   </a-entity>

    // const center = document.createElement('a-entity')
    // center.id="center"
    // const center_in = document.createElement('a-entity')
    // const center_in_in = document.createElement('a-entity')
    // center_in_in.components["gltf-model"]="#model_center"
    // console.log(center_in_in)
    // for(let i=0;i<6;i++){
    //   const cin = center_in.cloneNode(true)
    //   const cinin = center_in_in.cloneNode(true)
    //   cin.id=`center${i}`
    //   cin.appendChild(cinin)
    //   center.appendChild(cin)
    // }
    // document.getElementById('root').appendChild(center)
    

    
// function motions(){

// 	if(move180){
// 		movementCount -= 1
// 		move180 = false
// 	}

// 	if(sum_solution2[0][0][1] == '2'){
// 		const S2 = sum_solution2[0].shift()
// 		sum_solution2[0].unshift(S2[0], S2[0])
// 		move180 = true
// 	}

// 	let time_tank = 0
// 	time_tank += one_motion(sum_solution2[0][0], rote_speed, 16 - sum_solution2.length)
// 	time_tank += 10
// 	sum_solution2[0].shift()


// 	movementCount+=1
// 	if(solve_preview){
// 		const solveDiv = document.getElementsByClassName("img-div")
// 		solveDiv[movementCount].classList.add('now-move')
// 	}

// 	const scene = document.getElementById('scene').components["cube-mode"]
// 	if(sum_solution2[0].length > 0){
// 		setTimeout(() => {
// 			scene.data.Execution_move =true
// 		},time_tank)
// 	}
// 	else {
// 		setTimeout(() => {
// 			typeName = frame_pos[0]=="corner"?"corner":"edge"
// 			type = frame_pos[0]=="corner"?"frame_corner":"frame_edge"
// 			const frame=document.getElementById(`frame_${typeName}`)
// 			const Pframe=document.getElementById(`frame`)
			
// 			// console.log(`frame_pos ${frame_pos} [${Pframe.classList.value.includes(typeName)}]`)
// 			// if(Pframe.classList.value.includes(typeName)){
// 			// 	// console.log(`--------Change--------    ${typeName}`)

// 			// 	frame.setAttribute("visible",false)
// 			// 	// document.getElementById(type).setAttribute("visible",false)
// 			// 	Pframe.classList.remove(typeName)
// 			// 	// Pframe.classList.add(typeName)
// 			// }
			
// 			// pointM(frame_pos, false)
// 			// Angle_move(undefined, -1,500)
// 		},time_tank)

// 		setTimeout(() => {
// 			scene.data.step_move = false
// 		},time_tank)
// 	}
// 	if(sum_solution2.length == 1 && sum_solution2[0].length == 0){
// 		movementCount = -1
// 		move180 = false
		
// 		scene.Complete()
// 	}
	
// 	if(sum_solution2.length > 0 && sum_solution2[0].length == 0) sum_solution2.shift()
// }

// function one_motion(sulb,speed,step){
// 	// const speed=1000.0/S
// 	const Lhand = document.getElementById("L-hand")
// 	const Rhand = document.getElementById("R-hand")

// 	let Rtime = one_hand_move(sulb, speed, Rhand, Rhandv, 1, Rhands[sulb])
// 	let Ltime = one_hand_move(sulb, speed, Lhand, Lhandv, 0, Lhands[sulb])

// 	let sum_time = Math.max(Rtime.time,Ltime.time)
// 	let som_sovle_time = Math.max(Rtime.sovle_time,Ltime.sovle_time)
// 	// console.log(`R time [${Rtime.time}]  sovle_time [${Rtime.sovle_time}]\n`+
// 	// 						`L time [${Ltime.time}]  sovle_time [${Ltime.sovle_time}]\n`+
// 	// 						`sum time [${sum_time}]  sovle_time [${som_sovle_time}]`)

// 	// console.log(Rtime.move_schedule)
// 	// console.log(Ltime.move_schedule)

// 	if(Rtime.sovle_time != -1 && Ltime.sovle_time != -1 && Rtime.sovle_time != Ltime.sovle_time){
// 		const dis = Rtime.sovle_time - Ltime.sovle_time
// 		if(dis > 0){
// 			for(let A of Ltime.move_schedule)	A.time += dis
// 		}
// 		else{
// 			for(let A of Rtime.move_schedule)	A.time -= dis
// 		}
// 	}


// 	if(Rtime.move_schedule != undefined){
// 		// console.log(`Rtime.move_schedule`)
// 		for(let s of Rtime.move_schedule){
// 			setTimeout(() => {
// 				Rhand.removeAttribute('animation-mixer')
// 				Rhand.setAttribute('animation-mixer', {
// 					clip: s.clip,
// 					loop: 'once',
// 					timeScale: s.timeScale,
// 					clampWhenFinished: true,
// 				})
// 			},s.time)
// 		}
// 	}

// 	if(Ltime.move_schedule != undefined){
// 		// console.log(`Ltime.move_schedule`)
// 		for(let s of Ltime.move_schedule){
// 			setTimeout(() => {
// 				Lhand.removeAttribute('animation-mixer')
// 				Lhand.setAttribute('animation-mixer', {
// 					clip: s.clip,
// 					loop: 'once',
// 					timeScale: s.timeScale,
// 					clampWhenFinished: true,
// 				})
// 			},s.time)
// 		}
// 	}
	
// 	setTimeout(() => {
// 		Angle_move(sulb, step, parseInt(1000/speed))
// 		frame_rotate(sulb, step, parseInt(1000/speed), true)
// 		rotate(sulb, parseInt(1000/speed))
// 	}, som_sovle_time)
// 	return sum_time
// }

// const hand_xyz = []
// let frame_pos = ["",""]

// function frame_rotate(sulb = undefined, step, time, anime = false){
// 	let text = "\n\n"
// 	text+=`hand_xyz [${hand_xyz.length==0?"None":hand_xyz.join(',')}]\n`
// 	if(step>=12)	return 
// 	const rote = {
// 		ce: ["0 180 0","0 90 0","0 0 0","0 -90 0","-90 0 0","90 0 0"],
// 		e:  [
// 			"0 -90 90","0 90 -90","0 90 90","0 -90 -90","0 180 0","0 90 0",
// 			"0 0 0","0 -90 0","0 180 180","0 90 180","0 0 180","0 -90 180"
// 			],
// 		c: [
// 			"0 180 0","0 90 0","0 0 0","0 270 0",
// 			"0 270 180","0 180 180","0 90 180","0 0 180"
// 			],
// 	}

// 	parts__Angle = [
// 		10,10,10,10,  6,6,6,6,  2,2,2,2,
// 	]

// 	const type = (4 <= step && step < 8)?"c":"e"
// 	const typeName = type=="c"?"corner":"edge"
// 	const ss = scrambled_state
// 	let new_ang = parts__Angle[step]

// 	text+=`ang ${new_ang} `
// 	for(han of hand_xyz){		new_ang = moves[han][`${type}p`].indexOf(new_ang);		text+=`-> ${new_ang} `;	}
// 	text+='\n'
	
// 	if(sulb != undefined && sulb[0]>"a"){
// 		if(hand_xyz.length > 0 && hand_xyz.at(-1)[0] == sulb[0] && hand_xyz.at(-1) != sulb )			hand_xyz.pop()
// 		else			hand_xyz.push(sulb)
// 	}

// 	const pos = ss[`${type}p`].indexOf(new_ang)

// 	const frame=document.getElementById(`frame_${typeName}`)
// 	const Pframe=document.getElementById(`frame`)
	
// 	if(!Pframe.classList.value.includes(typeName)){
// 		// console.log(`--------Change--------    ${typeName}`)

// 		frame.setAttribute("visible",true)
// 		document.getElementById(type!="c"?"frame_corner":"frame_edge").setAttribute("visible",false)
// 		Pframe.classList.remove(type!="c"?"corner":"edge")
// 		Pframe.classList.add(typeName)
// 	}

// 	frame.children[0].setAttribute("rotation",rote[type][pos])
// 	frame.removeAttribute('animation')
// 	frame.setAttribute('rotation', {x:0,y:0,z:0})

// 	if(sulb == undefined){
// 		pointM([typeName,pos])
// 		text += `--------- undefined NO ${typeName}${pos} ---------\n\n`
// 		// console.log(text)
// 		return
// 	}


// 	const index = faces.indexOf(sulb[0])
// 	const mode_parts = type=="c"?moves_face_c:moves_face_e
// 	const mode = mode_parts[index].indexOf(pos)

// 	text += `sulb [${sulb}]  type [${type}]  mode [${mode!=-1?mode:"None"}]  pos [${pos}] rote [${rote[type][pos]}]\n`
// 	// text += `[${.join(',')}]\n`
// 	text += `index [${index}]\n`
// 	text += `mode_parts[index] [${mode_parts[index].join(',')}]\n`
// 	text += `indexOf [${mode_parts[index].indexOf(pos)}]\n`

// 	if(mode==-1){
// 		text += `--------- NO rotation ---------\n\n`
// 		// console.log(text)
// 		return
// 	}

	
// 	const rad = sulb[1]
// 	const size = (rad=='\'')?-1:((rad=='2')?2:1)
// 	text+=	`anime [${anime}]  rot [rotation.${vec.charAt(index)}]  to [${faces_rad[index] * 90 * size}]`

// 	next_pos = moves[sulb][`${type}p`].indexOf(pos)
// 	frame_pos = [typeName, next_pos]

// 	// console.log(text+"\n\n")
// 	if(anime){
// 		frame.setAttribute('animation', {
// 			property: 'rotation.'+vec.charAt(index),
// 			dur: time,
// 			from: 0,
// 			to: faces_rad[index] * 90 * size,
// 			easing: 'linear',
// 		})
		
// 		setTimeout(() => {
// 			pointM([typeName,pos],false)
// 			pointM([typeName,next_pos],true)
// 		},time)
// 	}
// }

// function pointM(p,T = true){
// 	if(p[0]=="")	return
// 	// console.log(p)
// 	const A = p[0]=="corner"?model_corners:(p[0]=="center"?model_centers:model_edges)
// 	const P = A[p[1]].children
// 	// document.getElementById(p).children[0].object3D.children[0].children[0].children
// 	// console.log(`pointM name [${p}] ${T}`)
// 	if(T){
// 		for(let i=0;i<P.length-1;i++){
// 			P[i].material.side=0
// 			P[i].material.depthTest=false
// 			P[i].renderOrder=3
// 		}
// 	}
// 	else{
// 		for(let i=0;i<P.length-1;i++){
// 			P[i].material.side=2
// 			P[i].material.depthTest=true
// 			P[i].renderOrder=0
// 		}
// 	}
// }

// const Angle_xyz = []
// let Angle_pos = ""

// function Angle_move(sulb = undefined, step, time){
// 	return
// 	let text = "\n\n"
// 	text+=`hand_xyz [${hand_xyz.length==0?"None":hand_xyz.join(',')}]\n`
// 	if(step>=12)	return 

// 	Rotation_Angle = {
// 		e: [
// 			[-30,-160],
// 			[-30,160],
// 			[-30,40],
// 			[-30,-40],
			
// 			[-30,160],
// 			[-30,40],
// 			[-30,40],
// 			[-30,-40],
			
// 			[30,160],
// 			[30,40],
// 			[30,40],
// 			[30,-40],
// 		],
		
// 		c: [
// 			[-30,-160],
// 			[-30,160],
// 			[-30,40],
// 			[-30,-40],
			
// 			[30,-160],
// 			[30,160],
// 			[30,40],
// 			[30,-40],  
// 		]
// 	}

// 	parts__Angle = [
// 		10,10,10,10,  6,6,6,6,  2,2,2,2,
// 	]


// 	const type = (4 <= step && step < 8)?"c":"e"
// 	let ss = scrambled_state
	
// 	let new_ang = parts__Angle[step]
	
// 	text+=`ang ${new_ang} `
// 	for(han of Angle_xyz){
// 		new_ang = moves[han][`${type}p`].indexOf(new_ang)
// 		text+=`-> ${new_ang} `
// 	}
// 	text+='\n'
	
	
// 	if(sulb != undefined && sulb[0]>"a"){
// 		if(Angle_xyz.length > 0 && Angle_xyz.at(-1)[0] == sulb[0] && Angle_xyz.at(-1) != sulb )			Angle_xyz.pop()
// 		else			Angle_xyz.push(sulb)
// 	}
	
// 	let pos = ss[`${type}p`].indexOf(new_ang)
// 	if(sulb != undefined) pos = moves[sulb][`${type}p`].indexOf(pos)

// 	let ro  = this.Rotation_Angle[type][pos]

// 	if(sulb !== undefined)	ss = scamble2state(ss,sulb)

// 	if(step == -1)	ro = this.Rotation_Angle.c[2]

// 	text += `sulb [${sulb}]  type [${type}]  pos [${pos}] rote [${ro}]\n`
// 	text += `parts__Angle [${parts__Angle[step]}] new_ang [${new_ang}]\n`

// 	const camOut = document.getElementById('camera')
// 	let by = (camOut.getAttribute("rotation").y+360)%360
// 	let ay = (ro[1]+360)%360
	
// 	text += `[${by}] [${ay}]`

// 	camOut.setAttribute('animation', {
// 		property: 'rotation',
// 		dur: time,
// 		// from: 0,
// 		to: {x:ro[0], y:ro[1], z:0},
// 		easing: 'linear',
// 	})
	
// 	//console.log(text+"\n\n")
// }

// function one_hand_move(sulb, speed, hand, hdvec, influence, Su){
// 	let time = 0,sovle_time = 0
// 	let move_schedule = []
// 	if(Su === undefined){
// 		return {time: -1, sovle_time: -1}
// 	}

// 	let index = hdvec[sulb]-h_v[influence]
// 	let vec_count = h_v[influence]

// 	if(Su[0] === 'L')	vec_count+=1

// 	index = Change.find((u) => u.int === index)
	
// 	if(index !== undefined){
// 		move_schedule.push({
// 			clip: index.name,
// 			timeScale: speed,
// 			time : time
// 		})
// 		time += parseInt(1000/speed)
// 		vec_count += 1
// 	}
// 	h_v[influence] = vec_count % 2

// 	for(let i=0; i<Pre_movement2[Su].length; i++){
// 		move_schedule.push({
// 			clip: `${Su + Pre_movement2[Su][i]}`,
// 			timeScale: speed,
// 			time : time
// 		})
// 		if(Pre_movement2[Su][i] == ""){
// 			sovle_time = time
// 		}
// 		time+=parseInt(1000/speed)
// 	}
// 	return {time,sovle_time,move_schedule}
// }

// function raycast_rotate(rote, rad) {
// 		// if(rad>Math.PI-0.00001)	return
// 		time = Math.min(Math.floor(rad/(Math.PI/2)*23),23)
// 		rote_name = [
// 			"B",			"B'",			"big",			"D",			"D'",
// 			"F",			"F'",			"Idole",			"L",			"L'",
// 			"R",			"R'",			"spring",			"U",			"U'",
// 			"x",			"x'",			"y",			"y'",			"z",			"z'"
// 	]
// 		animations = cube.object3D.children[0].animations[rote_name.indexOf(rote)]
// 		for(ani of animations.tracks){
// 				if(ani.times.length <= 2) continue
// 				names = ani.name.split(".")
// 				bone = names[0]
// 				// type = names[1]
// 				bone_name_model[bone].quaternion.set(
// 						ani.values[time*4],
// 						ani.values[time*4+1],
// 						ani.values[time*4+2],
// 						ani.values[time*4+3]
// 				)
// 		}
// }

// function hand_raycast_rotate(rote, frame, bone) {
// 	// if(rad>Math.PI-0.00001)	return
// 	// time = Math.min(Math.floor(rad/(Math.PI/2)*23),23)
// 	rote_name = [
// 		"B'.1", "B'.1.b", "B'.1.f", 'B.1', 'B.1.f', 
// 		'Change.1', 'Change.2', "D'.1", "D'.1.b",
// 		"D'.1.f", 'D.1', 'D.1.f', "F'.1", "F'.1.f",
// 		"F'.2", "F'.2.b", "F'.2.f", 'F.1', 'F.1.b',
// 		'F.1.f', 'Idole', "L'.1", "L'.1.f", 'L.1',
// 		'L.1.f', "U'.1", "U'.1.f", 'U.1', 'U.1.b',
// 		'U.1.f', 'U.2', 'U.2.b', 'U.2.f', "y'.1",
// 		"y'.1.b", 'y.1', 'y.1.b'
// 	]
// 	animations = L_hand.object3D.children[0].animations[rote_name.indexOf(rote)]
// 	for(ani of animations.tracks){
// 			if(ani.times.length <= 2) continue
// 			names = ani.name.split(".")
// 			index = names[0]
// 			type = names[1][0]=="p"?3:4
// 			bone[index][names[1]].set(
// 					ani.values[frame*type],
// 					ani.values[frame*type+1],
// 					ani.values[frame*type+2],
// 					ani.values[frame*type+3]
// 			)
// 	}
// }



// function remove_animation(roate){
// 	const index = faces.indexOf(roate[0])
// 	corner = document.getElementById("corner").children
// 	edge = document.getElementById("edge").children
// 	center = document.getElementById("center").children

// 	for(let i of moves_face_c[index]){
// 		corner[i].setAttribute('rotation', {x:0,y:0,z:0})
// 		corner[i].removeAttribute('animation')
// 	}

// 	for(let i of moves_face_e[index]){
// 		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
// 		edge[i].removeAttribute('animation')
// 	}

// 	for(let i of moves_face_cn[index]){
// 		center[i].setAttribute('rotation', {x:0,y:0,z:0})
// 		center[i].removeAttribute('animation')
// 	}
// }


// console.hash = function(obj) {
//   this.length = Object.keys(obj).length;
//   this.count = 0;
//   this.outText = "{\n";
//   /**
//   * @param {hash} obj 処理対象のオブジェクト
//   * @param {number} times 処理中オブジェクトの階層
//   */
//   this.format = function(obj,times){
//     var i = 0;
//     var _objlength = Object.keys(obj).length;
//     for(key in obj){
//       i++;
//       //階層分のタブを追加
//       var tabs = "";
//       for(var j = 0; j < times+1; j++){
//         tabs += "\t";
//       }
//       this.outText += tabs + key + ":";
//       if(typeof obj[key] == "object"){
//         this.outText += "{" + "\n";
//         //下層のオブジェクト数を足す
//         this.length += Object.keys(obj[key]).length;
//         //再帰処理
//         this.format(obj[key],times+1);
//         if(i == _objlength){
//           this.outText += tabs.replace(/(\t?).$/,'$1') + "}\n";
//         }
//         this.count++;
//       }else{
//         this.outText += obj[key];
//         if(i != _objlength){
//           this.outText += ",\n";
//         }else{
//           this.outText += "\n" + tabs.replace(/(\t?).$/,'$1') + "}\n";
//         }
//         this.count++;
//       }
//     }
//     if(this.length == this.count){
//       console.log(this.outText);
//     }
//   }
//   this.format(obj,0);
// }

// function cubeOpa() {
// 	corner = model_corners
// 	edge = model_edges
// 	center = model_centers

// 	// console.log(model_corners)
// 	// console.log(corner.length)

// 	for(let i=0;i<corner.length;i++){
// 		let F = corner[i]
// 		objopacty2(F)
// 	}

// 	for(let i=0;i<edge.length;i++){
// 		let F = edge[i]
// 		objopacty2(F)
// 	}

// 	for(let i=0;i<center.length;i++){
// 		let F = center[i]
// 		objopacty2(F)
// 	}
// }

// function cubeOpa2(step) {
// 	vis_p = [
// 		[
// 			[0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,0,0,0,0,0,0,0,0,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[0,0,0,0,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 	]

// 	vis = [
// 		[
// 			[0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,1,1,1,1,0,0,0,0,],
// 			[0,0,0,0,0,0,],
// 		],
// 		[
// 			[1,1,1,1,0,0,0,0,],
// 			[0,0,0,0,1,1,1,1,0,0,0,0,],
// 			[0,0,0,0,0,0,],
// 		],
// 		[
// 			[1,1,1,1,0,0,0,0,],
// 			[0,0,0,0,0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,0,0,],
// 		],
// 	]


// 	corner = model_corners
// 	edge = model_edges
// 	center = model_centers

// 	// console.log(model_corners)
// 	// console.log(corner.length)

// 	for(let i=0;i<corner.length;i++){
// 		let F = corner[i]
// 		objopacty4(F, vis_p[step][0][i])
// 	}

// 	for(let i=0;i<edge.length;i++){
// 		let F = edge[i]
// 		objopacty4(F, vis_p[step][1][i])
// 	}

// 	for(let i=0;i<center.length;i++){
// 		let F = center[i]
// 		objopacty4(F, vis_p[step][2][i])
// 	}
	
// 	if(step == 4 || step == 5 || step == 6){
// 		for(let i=0;i<corner.length;i++){
// 			let F = corner[i]
// 			if(vis[step - 4][0][i] == 0)	continue
// 			objopacty5(F, vis_p[step][0][i])
// 		}

// 		for(let i=0;i<edge.length;i++){
// 			let F = edge[i]
// 			if(vis[step - 4][1][i] == 0)	continue
// 			objopacty5(F, vis_p[step][1][i])
// 		}
// 	}
// }


// function cubeOpa3(step) {
// 	vis_p = [
// 		[
// 			[0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,0,0,0,0,0,0,0,0,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,0,0,0,0,],
// 			[0,0,0,0,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[0,0,0,0,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[0,0,0,0,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 		[
// 			[1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,1,1,1,1,1,1,],
// 			[1,1,1,1,1,1,],
// 		],
// 	]



// 	corner = model_corners
// 	edge = model_edges
// 	center = model_centers

// 	// console.log(model_corners)
// 	// console.log(corner.length)

// 	for(let i=0;i<corner.length;i++){
// 		let F = corner[i]
// 		objopacty4(F, vis_p[step][0][i])
// 	}

// 	for(let i=0;i<edge.length;i++){
// 		let F = edge[i]
// 		objopacty4(F, vis_p[step][1][i])
// 	}

// 	for(let i=0;i<center.length;i++){
// 		let F = center[i]
// 		objopacty4(F, vis_p[step][2][i])
// 	}



	
// }


// function objopacty(ojb, op1 = 0.5, step, op2 = undefined) {
//   const F = ojb.children
//   for(let s=0;s<F.length;s++){
//       F[s].material.opacity = op1
//       F[s].material.transparent = true
//   }
// 	if(op2 != undefined){
// 		F[F.length-1].material.opacity = op2
// 		F[F.length-1].material.transparent = true
// 	}
// }

// function objopacty2(ojb) {
//   const F = ojb.children
// 	for(let s=0;s<F.length;s++){
// 		F[s].visible = true
// 	}
// 		F[F.length-1].visible = false
// }

// function objopacty3(ojb, op1 = 0.5, op2 = undefined) {
//   const F = ojb.children
// 	for(let s=0;s<F.length;s++){
// 		F[s].renderOrder  = 10
// 	}
// 	//console.log("function objopacty3")
// }

// // cubeOpa(0.8,0)
// function objopacty4(ojb, vis) {
//   const F = ojb.children
// 	for(let s=0;s<F.length-1;s++){
// 		F[s].visible = (vis == 1? true:false)
// 	}
// }

// function objopacty5(ojb) {
//   const F = ojb.children
// 	for(let s=0;s<F.length-1;s++){
// 		F[s].visible = false
// 	}
// 	ojb.children[0].visible = true
// }


// function psd() {
// 	let t="let solved_state = new State(\n"
// 	t+="  ["+scrambled_state.cp.join(',')+"],\n"
// 	t+="  ["+scrambled_state.co.join(',')+"],\n"
// 	t+="  ["+scrambled_state.ep.join(',')+"],\n"
// 	t+="  ["+scrambled_state.eo.join(',')+"],\n"
// 	t+="  ["+scrambled_state.c.join(',')+"],\n"
// 	t+=")\n"
// 	//console.log(t)
// }
