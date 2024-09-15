const modelLoad = () => ({
  schema: {
    modelType: {type: 'string', default: ""},
  },
  init(){
    const scene = document.getElementById('scene')
    const root = document.getElementById('root')

    function name(ojb,index,r,map = undefined,normalMap = undefined, side = 2) {
      data = {
        color: 0xffffff,
        roughness : r,
        normalScale: {x:3,y:3}
      }

      if(map != undefined)  data.map = map
      if(normalMap != undefined)  data.normalMap = normalMap
      
      f=document.getElementById(ojb).object3D.children[0].children[0].children[0].children[index]

      const material = new THREE.MeshStandardMaterial(data)

      f.material=material
      f.material.side=side
      // f.material.normalMap.repeat={x:2,y:2}
    }

    function AAA(){
      // const texture = new THREE.TextureLoader().load(`./mesh/M_a_${1}.jpg`)
      // const texture1 = new THREE.TextureLoader().load(`./mesh/M_n_${1}.jpg`)
      // A=3
      // AA=["center","corner","edge"]
      // B=[6,8,12]
      // C=[1,3,2]

      // for(let j=0;j<A;j++){
      //   for(let i=0;i<B[j];i++){
      //     for(let s=0;s<C[j];s++){
      //       name(`${AA[j]}${i}`, s, 0.5, undefined, texture1, 2)
      //     }    
      //   }   
      // }
      color_set(scrambled_state)
      // cubeOpa(1,0,objopacty2)
      // cubeOpa(1,0,objopacty3)
      
      root.object3D.visible = true
    }
    
    const Lhand = document.createElement('a-entity')
    const Rhand = document.createElement('a-entity')
    Lhand.id="L-hand"
    Lhand.setAttribute("mixin","m_hand")
    Lhand.setAttribute("rotation","0 -90 0")
    Lhand.setAttribute("scale","2.2 2.2 2.2")
    Lhand.setAttribute("shadow")

    Rhand.id="R-hand"
    Rhand.setAttribute("mixin","m_hand")
    Rhand.setAttribute("rotation","0 90 0")
    Rhand.setAttribute("scale","-2.2 2.2 2.2")
    Rhand.setAttribute("shadow")
    
    root.prepend(Lhand)
    root.prepend(Rhand)

    const hands = [
      Lhand,
      Rhand,
    ]

    hands[1].addEventListener("model-loaded", (e) => {
      console.log("hands[1] model-loaded")
      c = {r:1,g:0.8,b:0.6}
      hands[0].object3D.traverse( (child) => {
        if(child.type == "SkinnedMesh") {
          child.material.transparent = true;
          child.material.opacity = 0.7;
          child.material.color=c
          child.material.side=0
          // child.material.roughness = 0
        }
      })
      hands[1].object3D.traverse( (child) => {
        if(child.type == "SkinnedMesh") {
          child.material.transparent = true;
          child.material.opacity = 0.7;
          child.material.color=c
          child.material.side=0
          // child.material.roughness = 0
        }
      })

      Lhand.object3D.traverse((e) => {
        if(e.type == "Bone"){
          bone_L_hand[e.name] = e
        }
      })

      Rhand.object3D.traverse((e) => {
        if(e.type == "Bone"){
          bone_R_hand[e.name] = e
        }
      })

      L_hand = Lhand
      R_hand = Rhand
          // child.material.transparent = true;
          // child.material.opacity = 0.5;
      // hands[0].object3D.visible=true
      // hands[1].object3D.visible=true
    })

    const sky = document.createElement('a-sky')
    sky.id="sky"
    sky.classList.add("clickable","sky")
    sky.setAttribute("visible","false")

    root.appendChild(sky)
    

    const frame = document.getElementById('frame')
    const frame_corner = document.createElement('a-entity')
    frame_corner.id="frame_corner"
    frame_corner.object3D.visible = false
    const f_c_in = document.createElement('a-entity')
    f_c_in.setAttribute("mixin","m_f_c")
    frame_corner.appendChild(f_c_in)
    frame.appendChild(frame_corner)

    f_c_in.addEventListener("model-loaded", (e)=>{
      console.log("f_c_in model-loaded")
      f=f_c_in.object3D.children[0].children[0].children

      f[2].material.transparent=true
      f[2].material.opacity=0
      f[1].material = new THREE.MeshBasicMaterial()
      f[1].renderOrder=1
      f[1].material.side=0
      f[1].material.depthTest=false
      f[1].material.flatShading=true
      f[1].material.color={r:1,g:1,b:1}
      f[0].material = new THREE.MeshBasicMaterial()
      f[0].renderOrder=2
      f[0].material.side=0
      f[0].material.depthTest=false
      f[0].material.flatShading=true
      f[0].material.color={r:0,g:0,b:0}
    })
    
    
    const frame_edge = document.createElement('a-entity')
    frame_edge.id="frame_edge"
    frame_edge.object3D.visible = false
    const f_e_in = document.createElement('a-entity')
    f_e_in.setAttribute("mixin","m_f_e")
    frame_edge.appendChild(f_e_in)
    frame.appendChild(frame_edge)

    f_e_in.addEventListener("model-loaded", (e)=>{
      console.log("f_e_in model-loaded")
      f=f_e_in.object3D.children[0].children[0].children

      f[2].material.transparent=true
      f[2].material.opacity=0
      f[1].material = new THREE.MeshBasicMaterial()
      f[1].renderOrder=1
      f[1].material.side=0
      f[1].material.depthTest=false
      f[1].material.flatShading=true
      f[1].material.color={r:1,g:1,b:1}
      f[0].material = new THREE.MeshBasicMaterial()
      f[0].renderOrder=2
      f[0].material.side=0
      f[0].material.depthTest=false
      f[0].material.flatShading=true
      f[0].material.color={r:0,g:0,b:0}
    })


    const model_cube = document.createElement('a-entity')
    model_cube.id="cube"
    model_cube.classList.add("clickable","cube")
    model_cube.setAttribute("mixin","m_cube")
    model_cube.setAttribute("shadow")
    
    root.prepend(model_cube)

    str=  {"n":model_centers, "c":model_corners,  "e":model_edges}
    str2= {"n":bone_centers,  "c":bone_corners,   "e":bone_edges}
    
    model_cube.addEventListener("model-loaded", (e) => {
      console.log("model_cube model-loaded")
      a=model_cube.object3D.children[0].children[0].children[0].children
      b = a.map((x) => x.children[0])
      for(let i=0;i<b.length;i++){
        t=b[i].userData.name[0]
        num=b[i].userData.name[1]+b[i].userData.name[2]
        str[t][parseInt(num)] = b[i]
        str2[t][parseInt(num)] = b[i].parent
      }
      full_cube = model_cube
      for(b of bone_corners) bone_name_model[b.name]=b
      for(b of bone_centers) bone_name_model[b.name]=b
      for(b of bone_edges) bone_name_model[b.name]=b
      AAA()
    })

  },
})