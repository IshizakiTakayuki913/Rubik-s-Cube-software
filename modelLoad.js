const modelLoad = () => ({
  schema: {
    modelType: {type: 'string', default: ""},
  },
  init(){
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
    const scene = document.getElementById('scene')
    const root = document.getElementById('root')


    const center = document.createElement('a-entity')
    center.id="center"
    const center_in = document.createElement('a-entity')
    const center_in_in = document.createElement('a-entity')
    center_in_in.setAttribute("mixin","m_ce m_normal")
    center_in_in.classList.add("clickable","cube")

    for(let i=0;i<6;i++){
      const cin = center_in.cloneNode(true)
      const cinin = center_in_in.cloneNode(true)
      cinin.setAttribute("rotation",rote.ce[i])
      cin.id=`center${i}`
      cin.appendChild(cinin)
      center.appendChild(cin)
    }
    root.appendChild(center)

    const edge = document.createElement('a-entity')
    edge.id="edge"
    const edge_in = document.createElement('a-entity')
    const edge_in_in = document.createElement('a-entity')
    edge_in_in.setAttribute("mixin","m_e m_normal")
    edge_in_in.classList.add("clickable","cube")

    for(let i=0;i<12;i++){
      const cin = edge_in.cloneNode(true)
      const cinin = edge_in_in.cloneNode(true)
      cinin.setAttribute("rotation",rote.e[i])
      cin.id=`edge${i}`
      cin.appendChild(cinin)
      edge.appendChild(cin)
    }
    root.appendChild(edge)
    
    const corner = document.createElement('a-entity')
    corner.id="corner"
    const corner_in = document.createElement('a-entity')
    const corner_in_in = document.createElement('a-entity')
    corner_in_in.setAttribute("mixin","m_c m_normal")
    corner_in_in.classList.add("clickable","cube")

    for(let i=0;i<8;i++){
      const cin = corner_in.cloneNode(true)
      const cinin = corner_in_in.cloneNode(true)
      cinin.setAttribute("rotation",rote.c[i])
      cin.id=`corner${i}`
      cin.appendChild(cinin)
      corner.appendChild(cin)
    }
    root.appendChild(corner)

    function name(name,ojb,index,r,map,normalMap) {
      const texture = new THREE.TextureLoader().load(`./mesh/M_a_${name}.jpg`)
      
      // const {src1} = document.getElementById('mesh_1_n')
      const texture1 = new THREE.TextureLoader().load(`./mesh/M_n_${name}.jpg`)
      
      f=document.getElementById(ojb).object3D.children[0].children[0].children[0].children[index]
      const material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
          roughness : r,
        // map: texture,
        normalMap: texture1,
        normalScale: {x:3,y:3}
      } );
      f.material=material
      f.material.side=2
      // f.material.normalMap.repeat={x:2,y:2}
      }
      


    this.parts = [
      center.children[5].children[0],
      edge.children[11].children[0],
      corner.children[7].children[0],
    ]
    
    this.loadedCount=0
    for(let i=0;i<3;i++){

      this.parts[i].addEventListener('model-loaded',(e)=>{
        this.loadedCount++
        if(this.loadedCount==3){

            A=3
            AA=["center","corner","edge"]
            B=[6,8,12]
            C=[1,3,2]

            for(let j=0;j<A;j++){
            for(let i=0;i<B[j];i++){
            for(let s=0;s<C[j];s++){
                name(2,`${AA[j]}${i}`,s,0.5,true,true)

            }    
            }   
            }
          color_set(scrambled_state)
          cubeOpa(1,0,objopacty2)
          cubeOpa(1,0,objopacty3)
          
          root.object3D.visible = true
        }
      })
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
    
    root.appendChild(Lhand)
    root.appendChild(Rhand)

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
    
    // sky.setAttribute("color","#00000000")
    // src ="#umi" 
    // <a-plane id="plane" color="#CCC" height="20" width="20" position="0 -3 0" rotation="-90 0 0" visible="false" shadow></a-plane> -->

  },
})