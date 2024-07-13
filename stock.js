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
  
  const Cam= camera2.components.camera.camera
  
  
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
    