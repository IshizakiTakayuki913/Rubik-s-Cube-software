const syncuser = () => ({
  schema: {
    userId: {default: "userPosition"},
    load: {type: "boolean" ,default: false},
  },

  init() {
    this.user = undefined;
    this.camera = this.el;
    const iframe = document.getElementById("iframe")
    // console.log(iframe)

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document
      console.log(`try Ok`)
      this.load()
      this.data.load = true
    } catch (error) {
      console.log(`try No`)
      this.data.load = false
    }
    
  },
  tick() {
    if ((typeof this.user !== "undefined") && (this.user != null)) {
      try {
        var rot = this.camera.object3D.rotation
        this.user.object3D.rotation.copy(rot)
      } catch (error) {
      }
    }
    else if(this.data.load){this.load()}
  },
  load() {
    const iframe = document.getElementById("iframe")
    // console.log(`load function`)
    if ((typeof this.user === "undefined")) {
      const doc = iframe.contentDocument || iframe.contentWindow.document
      this.user = doc.getElementById(this.data.userId)
      this.data.load = false
    }
  },
})