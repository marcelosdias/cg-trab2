let index = 0

let selectedObject = 'spaceship'

let indexCamera = 0

const config = { 
  translationX: 0,
  translationY: -21, 
  translationZ: 80,
  
  rotationX: degToRad(0),
  rotationY: degToRad(0),
  rotationZ: degToRad(0),

  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,

  lightX: 0,
  lightY: 0,
  lightZ: 100,
  Shininess: 300,
  lightColor: [1, 1, 1, 1],
  specularColor: [1, 1, 1, 1],
}

let settings = {
  fps: false,
}

let gui = null

let listOfObjects = ['spaceship']

const loadGUI = () => {
  gui = new dat.GUI({closeFolders: false});
  gui.closed = false

  gui.add(settings, 'fps').onChange(value => fps = value)
}


