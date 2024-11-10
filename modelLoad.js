const modelLoad = () => ({
  schema: {
    sendComponents: {type: 'string', default: ""},
    modelType: {type: 'int', default: 0},
  },
  init(){
    const scene = this.el
    const root = this.el.querySelector(".root")

    console.log({scene, root})

    let full_cube = undefined

    let model_centers	=new Array(6)
    let model_corners	=new Array(8)
    let model_edges		=new Array(12)

    let bone_centers	=new Array(6)
    let bone_corners	=new Array(8)
    let bone_edges		=new Array(12)

    let L_hand = undefined
    let R_hand = undefined

    const bone_L_hand	= {}
    const bone_R_hand	= {}

    let bone_name_model={}

    let frameObj = {
      edge:{
        out: undefined,
        in: undefined,
      },
      corner:{
        out: undefined,
        in: undefined,
      }
    }

    this.loaded_count = 0

    const Lhand = document.createElement('a-entity')
    const Rhand = document.createElement('a-entity')
    Lhand.id="L-hand"
    // Lhand.removeAttribute("gltf-model")
    Lhand.setAttribute("gltf-model","url(./model/sub-hand.glb)")
    // Lhand.setAttribute("mixin","m_hand")
    // Lhand.setAttribute("visible", false)
    Lhand.setAttribute("rotation","0 -90 0")
    Lhand.setAttribute("scale","2.2 2.2 2.2")
    Lhand.setAttribute("shadow")

    Rhand.id="R-hand"
    Rhand.setAttribute("gltf-model","url(./model/sub-hand.glb)")
    // Rhand.setAttribute("mixin","m_hand")
    // Rhand.setAttribute("visible", false)
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
      // console"hands[1] model-loaded")
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
      Lhand.setAttribute("my-animation", {
        clip: "Idole", frame: 0})
      Rhand.setAttribute("my-animation", {
        clip: "Idole", frame: 0})

      this.el.dispatchEvent(new Event( "load-all-end"))
    })

    const sky = document.createElement('a-sky')
    sky.id="sky"
    sky.classList.add("clickable","sky")
    sky.setAttribute("visible","false")

    root.appendChild(sky)
    

    const frame = this.el.querySelector(".frame")
    const frame_corner = document.createElement('a-entity')
    frame_corner.id="frame_corner"
    frame_corner.object3D.visible = false
    const f_c_in = document.createElement('a-entity')
    
    f_c_in.setAttribute("gltf-model","url(./model/frame-corner.glb)")
    // f_c_in.setAttribute("mixin","m_f_c")
    frame_corner.appendChild(f_c_in)
    frame.appendChild(frame_corner)

    f_c_in.addEventListener("model-loaded", (e)=>{
      // console"f_c_in model-loaded")
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

      frameObj.corner = {
        out: frame_corner,
        in: f_c_in
      }

      this.el.dispatchEvent(new Event( "load-all-end"))
    })
    
    
    const frame_edge = document.createElement('a-entity')
    frame_edge.id="frame_edge"
    frame_edge.object3D.visible = false
    const f_e_in = document.createElement('a-entity')
    f_e_in.setAttribute("gltf-model","url(./model/frame-edge.glb)")
    // f_e_in.setAttribute("mixin","m_f_e")

    frame_edge.appendChild(f_e_in)
    frame.appendChild(frame_edge)

    f_e_in.addEventListener("model-loaded", (e)=>{
      // console"f_e_in model-loaded")
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
      
      frameObj.edge = {
        out: frame_edge,
        in: f_e_in
      }

      this.el.dispatchEvent(new Event( "load-all-end"))
    })


    const model_cube = document.createElement('a-entity')
    model_cube.id="cube"
    model_cube.setAttribute("gltf-model","url(./model/cube-full.glb)")
    // model_cube.setAttribute("gltf-model","#model_cube_full")
    // model_cube.setAttribute("mixin","m_cube")
    model_cube.classList.add("clickable","cube")
    model_cube.setAttribute("shadow")
    full_cube = model_cube

    // setTimeout((e) => {
      root.prepend(model_cube)
    // },this.data.modelType * 500)
    

    str=  {"n":[], "c":[],  "e":[]}
    str2= {"n":[],  "c":[],   "e":[]}
    
    model_cube.addEventListener("model-loaded", (e) => {
      // console"model_cube model-loaded")
      const a=model_cube.object3D.children[0].children[0].children[0].children
      b = a.map((x) => x.children[0])
      for(let i=0;i<b.length;i++){
        t=b[i].userData.name[0]
        num=b[i].userData.name[1]+b[i].userData.name[2]
        str[t][parseInt(num)] = b[i]
        str2[t][parseInt(num)] = b[i].parent
      }

      model_centers = str.n
      model_corners = str.c
      model_edges = str.e

      bone_centers = str2.n
      bone_corners = str2.c
      bone_edges = str2.e

      bone_corners.forEach((c) => {bone_name_model[c.name]=c})
      bone_centers.forEach((c) => {bone_name_model[c.name]=c})
      bone_edges.forEach((c) => {bone_name_model[c.name]=c})

      this.el.dispatchEvent(new Event( "load-all-end"))
      root.object3D.visible = true
    })

    this.el.addEventListener("load-all-end",(e) => {
      this.loaded_count ++
      if(this.loaded_count < 4) return
      
      console.log(" モデルが全て呼び込まれたよー")
      // const modelType = this.data.modelType
      // console.log(`modelType [${this.data.modelType}] Type [${typeof this.data.modelType}]`)

      this.el.components[this.data.sendComponents].modeleData(
        full_cube, model_centers, model_corners, model_edges,
        bone_centers, bone_corners, bone_edges,
        L_hand, R_hand,
        bone_L_hand, bone_R_hand, 
        bone_name_model, frameObj
      )
      
      // console.log(this)
    })
  },
})