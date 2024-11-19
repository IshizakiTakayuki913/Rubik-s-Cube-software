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

    
    const smp = document.createElement('a-entity')
    smp.id="smp"
    // Lhand.removeAttribute("gltf-model")
    smp.setAttribute("gltf-model","url(./model/frame.glb)")
    // Lhand.setAttribute("mixin","m_hand")
    // Lhand.setAttribute("visible", false)
    smp.setAttribute("rotation","0 0 0")
    smp.setAttribute("scale","1 1 1")
    smp.setAttribute("shadow")

    smp.addEventListener("model-loaded", (e)=>{
      const frames=smp.object3D.children[0].children
      console.log(frames)
      for(let i=0;i<frames.length;i++){
        const m = frames[i].children
        console.log(m)
        // m[0].material = new THREE.MeshBasicMaterial()
        // m[0].renderOrder=2
        m[0].material.side=0
        // m[0].material.depthTest=false
        // m[0].material.flatShading=true
        // m[0].material.color={r:0,g:0,b:1}
        
        // m[1].renderOrder=3
        m[1].material.side=0
        // m[1].material.depthTest=false
        // m[1].material.flatShading=true
        // m[1].material.color={r:1,g:0,b:1}
      }
      smp.object3D.visible = false
    })

    root.prepend(smp)

    const Lhand = document.createElement('a-entity')
    const Rhand = document.createElement('a-entity')
    Lhand.id="L-hand"
    Lhand.setAttribute("gltf-model","url(./model/sub-hand.glb)")
    Lhand.setAttribute("visible", false)
    Lhand.setAttribute("rotation","0 -90 0")
    Lhand.setAttribute("scale","2.2 2.2 2.2")
    Lhand.setAttribute("shadow")

    Rhand.id="R-hand"
    Rhand.setAttribute("gltf-model","url(./model/sub-hand.glb)")
    Rhand.setAttribute("visible", false)
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
    frame_corner.appendChild(f_c_in)
    frame.appendChild(frame_corner)

    f_c_in.addEventListener("model-loaded", (e)=>{
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

    frame_edge.appendChild(f_e_in)
    frame.appendChild(frame_edge)

    f_e_in.addEventListener("model-loaded", (e)=>{
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
    model_cube.setAttribute("gltf-model","url(./model/cube-smp4.glb)")
    model_cube.classList.add("clickable","cube")
    model_cube.setAttribute("shadow")
    full_cube = model_cube

    root.prepend(model_cube)
    

    str=  {"n":[], "c":[],  "e":[]}
    str2= {"n":[],  "c":[],   "e":[]}
    
    model_cube.addEventListener("model-loaded", (e) => {
      const b=model_cube.object3D.children[0].children[0].children[0].children
      const m = b.map((x) => x.children[0])

      bone_centers  = b.slice(0, 6)
      bone_edges    = b.slice(6, 18)
      bone_corners  = b.slice(18)

      model_centers = m.slice(0, 6)
      model_edges   = m.slice(6, 18)
      model_corners = m.slice(18)

      f[1].material = new THREE.MeshBasicMaterial()

      model_cube.object3D.traverse((e)=>{
        if(e.type=="Mesh"){
          // e.material = new THREE.MeshBasicMaterial()
          e.material.roughness = 0.4
          e.material.metalness = 0.3
        }
      })

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