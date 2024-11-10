const frameCube = () => ({
	schema: {
		Execution_move: {type: 'boolean', default: false},
	},	
	init() {
    console.log(`frameCube init`)
    this.load_end = true


    const paly_btn=document.querySelector(".display-paly")
    paly_btn.addEventListener("click", (e) => {
      timeList.rote_re_start()
    })
    // rote_speed_metar = new metar(a[0].classList[1], a[0], 0.2, 10, 4, true)
    // // console.log({rote_speed_metar})
    // hnd_opacity_metar = new metar(a[1].classList[1], a[1], 0.1, 1, 1, false)
    // // console.log({rote_speed_metar})
    
    // this.Mode_set("Free")
	},
  modeleData(
    full_cube, model_centers, model_corners, model_edges,
    bone_centers, bone_corners, bone_edges,
    L_hand, R_hand,
    bone_L_hand, bone_R_hand, 
    bone_name_model, frameObj
  ){
    
    timeList = new motionList(
      full_cube, model_centers, model_corners, model_edges,
      bone_centers, bone_corners, bone_edges,
      L_hand, R_hand,
      bone_L_hand, bone_R_hand, 
      bone_name_model, frameObj
    )

    timeList.color_set(scrambled_state, [0,1,2,3,4,5])
    timeList.ins(
      scrambled_state,
      [
        [ "R","U","F2","y" ],
        [ "F2","y" ],
        [ "U2","F2","y" ],
        [ "U'","F2","y" ],
        [ "y" ],
        [ "y2","R","U","R'","y2","U","R","U","R'","y" ],
        [ "R","U","R'","U'","R","U","R'","y" ],
        [ "U2","R","U2","R'","U'","R","U","R'","y" ],
        [ "U2","U","R","U'","R'","F","R'","F'","R","y" ],
        [ "U'","R'","F'","R","U","R","U'","R'","F","y" ],
        [ "y","R","U'","R'","F","R'","F'","R","y'","U'","U'","R'","F'","R","U","R","U'","R'","F","y" ],
        [ "U2","U'","R'","F'","R","U","R","U'","R'","F","y" ],
        [ "U'","F","R","U","R'","U'","F'","F","R","U","R'","U'","F'" ],
        [ "U","R","U","R'","U","R","U2","R'","R","U","R'","U","R","U2","R'" ],
        [ "U2" ],
        [ "y'","x'","U2","R2","U'","L'","U","R2","U'","L","U'","x","y","x'","U2","R2","U'","L'","U","R2","U'","L","U'","x" ],
      ],
    )



    this.load_end = false
  },
  timeLise_push(){
    if(this.load_end) return undefined
    console.log("frameCube timeLise_push")
    return timeList
  },
})