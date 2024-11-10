class iframeDiplay{
	constructor(){
    this.nIntervId = undefined
    this.list = undefined
    this.display = undefined

    setTimeout((e)=>{
      this.nIntervId = setInterval(this.frame(), 2000)
    },5000)
	}
  frame(){
    const _list = document.querySelectorAll(".main-display")

    // console.log(_list)
    let list = []
    _list.forEach((e) => list.push(e))
    this.display = list

    list = list.map((e) => {
      try{
        let a=e.contentDocument || e.contentWindow.document
        a = a.querySelector("[frame-cube]")
        a = a.components["frame-cube"]
        a = a.timeLise_push()
        return a
      }catch(error){
        console.log(error)
        return undefined
      }
    })
    // console.log(list)
    // console.log(`check ${list.every((e) => e != undefined)}`)

    if(list.length > 0 && list.every((e) => e != undefined)){
      clearInterval(this.nIntervId)
      // console.log("読み込み完了")
      // alert("iframeDiplay\n 読み込み完了")
      this.list = list
      this.set_data(list)
    }
  }		
	set_data(){
    console.log(this.list)
    console.log(this.display)

    // const paly = document.createElement("div")
    // paly.classList.add("display-paly")

    // for(let i=0;i<this.list.length;i++){
    //   this.list[i].color_set(scrambled_state, [(0+i)%4, (1+i)%4, (2+i)%4, (3+i)%4, 4,5])
    //   this.display[i].appendChild(paly.cloneNode())
    // }
  }
}

const display = new iframeDiplay()