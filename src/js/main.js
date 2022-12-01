let programInfo
let scene

let objectsToDraw = []
let objects = []
let nodeInfosByName = {}
let shootList = []
let enemyList = []
let barrierList = []

let sceneDescription

let indexEnemy = 0

let arrayCube = {}

let direction = 0

let animaTionRotation = 0

let shooting = false

let isEnemyShooting = false
let selectedEnemy = 0
let enemyShootList = []

let firstTime = true

let fps = false

let projectileAlive = [false, false, false]

let enemyKilled = 0

let gameover = false

let pontos = 0

let shootlength = 0

let end = false

let selectedEffect = 0

let speedMoviment = 0

let deltaTime
let arrayCameras = [
  new Camera([0, 0, 120], [0, 0, 0], [0, 1, 0]),
  new Camera([0, -22.5, 79.5], [0, 14.5, 80], [0, 1, 0]),
  new Camera([100, 150, 200], [0, 35, 0], [0, 1, 0]),
]

function makeNode(nodeDescription) {
  let trs = new TRS();
  let node = new Node(trs);

  if (nodeDescription.name.indexOf('player-shoot-') >= 0) {
    let newShoot = {
      trs: trs,
      node: node,
      format: nodeDescription.format
    }

    shootList.push(newShoot)
  } else if (nodeDescription.name.indexOf('enemy-shoot') >= 0)  {
    let newShoot = {
      trs: trs,
      node: node,
      format: nodeDescription.format
    }

    enemyShootList.push(newShoot)
  } else if (nodeDescription.name.indexOf('enemy-') >= 0)  {
    let newEnemy = {
      id: nodeDescription.id,
      trs: trs,
      node: node,
      format: nodeDescription.format
    }
    enemyList.push(newEnemy)
  } else if (nodeDescription.name.indexOf('barrier-') >= 0) {
    let newBarrier = {
      trs: trs,
      id: nodeDescription.id,
      hp: nodeDescription.hp,
      node: node,
      format: nodeDescription.format
    }
    barrierList.push(newBarrier)
  }
  else {
    nodeInfosByName[nodeDescription.name] = {
      trs: trs,
      node: node,
      format: nodeDescription.format
    };
  }

  trs.translation = nodeDescription.translation || trs.translation;

  trs.rotation = nodeDescription.rotation || trs.rotation;

  trs.scale = nodeDescription.scale || trs.scale;

  if (nodeDescription.draw !== false) {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, nodeDescription.format);
  
    const vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);
    
      node.drawInfo = {
          uniforms: {
              u_color: [0.2, 1, 0.2, 1],
          },
          format: nodeDescription.format,
          programInfo,
          bufferInfo,
          vertexArray,
      };
      objectsToDraw.push(node.drawInfo);
      objects.push(node);
  }

  makeNodes(nodeDescription.children).forEach(function(child) {
      child.setParent(node);
    });

  return node;
}

const makeNodes = nodeDescriptions => nodeDescriptions ? nodeDescriptions.map(makeNode) : []

function main(option = 0) {

  const initialize = initializeWebgl(option)

  const keyboardListener = document.querySelector('body')
  
  keyboardListener.addEventListener('keydown', mapMoviments, false)

  gl = initialize.gl
  
  programInfo = initialize.programInfo

  const fieldOfViewRadians = degToRad(60);

  const arrayCube = createArray('cube')

  sceneDescription = {
    name: "Center of the world",
      draw: false,
      children: [
        {
          name: 'player',
          draw: false,
          children: [
            {
              name: "spaceship",
              draw: true,
              translation: [0, -21, 80],
              rotation: [degToRad(0), degToRad(0), degToRad(0)],
              format: {...arrayCube},
              children: [],
            },
          ]
        },
        {
          name: 'enemy',
          draw: false,
          children: []
        },
        {
          name: 'shoot',
          draw: false,
          children: []
        },
        {
          name: 'barriers',
          draw: false,
          children: []
        },
        {
          name: 'enemyShoot',
          draw: false,
          children: []
        },
      ]
  }

  createEnemies(sceneDescription)
  createBarries(sceneDescription)

  scene = makeNode(sceneDescription)

  loadGUI()
  
  requestAnimationFrame(drawScene);

  let then = 0;

  let animationTime = 0

  let shootSpeed = 0

  let isFirstTime = true

  let startTime = true

  let tempo = 0

  function drawScene(now) {
    now *= 0.001;

    deltaTime = (now - then)
    
    animationTime += deltaTime

    speedMoviment = deltaTime * 2

    shootSpeed = deltaTime * 50

    then = now;

    if (gui == null)
      loadGUI()
  
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // gl.clearColor(0.75, 0.85, 0.8, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    enemiesAnimation(deltaTime * 10)
    if (!gameover) {
      if (enemyKilled !== enemyList.length) {
        if (fps) {
          indexCamera = 1
          arrayCameras[1].cameraPosition = {
            x: nodeInfosByName[selectedObject].trs.translation[0],
            y: nodeInfosByName[selectedObject].trs.translation[1] - 2,
            z: nodeInfosByName[selectedObject].trs.translation[2] + 2
          }
      
          arrayCameras[1].target = {      
            x: nodeInfosByName[selectedObject].trs.translation[0],
            y: 20,
            z: 80
          }
        } else {
          indexCamera = 0
        }

        if (shootList.length > 0)
          playersActions(shootSpeed)

        if (animationTime > 1) {
            let index = getRandomInt(enemyList.length)

            while (enemyList[index].trs.translation[1] > 100) {
              index = getRandomInt(enemyList.length)
            }

            enemyShooting(index)
                  
            animationTime = 0
        }

        if (enemyShootList.length > 0) 
          enemiesActions(shootSpeed)

        computeMatrix(nodeInfosByName[selectedObject], config)
      } else {
        end = true
        alert(`Você Ganhou, fez ${pontos} pontos`)
        window.location.reload();
      }
    } else {
      if (startTime) {
        tempo = now + 5

        startTime = false

        selectedEffect = getRandomInt(3)
      }

      if (now >= tempo) {
        end = true
        alert(`Você Morreu, fez ${pontos} pontos`)
        window.location.reload();
      } else {
        animaTionRotation += 1
        nodeInfosByName['Center of the world'].trs.rotation[selectedEffect] = degToRad(animaTionRotation);
      }
    }

    if (!end) {
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 300);

      const viewProjectionMatrix = m4.multiply(projectionMatrix, arrayCameras[indexCamera].computeMatrix()); 

      scene.updateWorldMatrix();

      objects.forEach(object => {
          object.drawInfo.uniforms.u_lightColor = [0.5, 0.5, 0.5];
          object.drawInfo.uniforms.u_specularColor = [0.2, 0.2, 0.2]; 

          if (projectileAlive[0]) {
            object.drawInfo.uniforms.u_lightWorldPosition2 = [shootList[0].trs.translation[0],shootList[0].trs.translation[1],shootList[0].trs.translation[2] + 5];
            object.drawInfo.uniforms.u_lightColor2 = [0, 0, 1];
            object.drawInfo.uniforms.u_specularColor2 = [0, 0, 0];
          } else {
              object.drawInfo.uniforms.u_lightWorldPosition2 = [0,0,0]
              object.drawInfo.uniforms.u_lightColor2 = [0,0,0];
              object.drawInfo.uniforms.u_specularColor2 = [0, 0, 0];
          }

          if (enemyShootList.length > 0) {
            object.drawInfo.uniforms.u_lightWorldPosition3 = [enemyShootList[0].trs.translation[0], enemyShootList[0].trs.translation[1], enemyShootList[0].trs.translation[2] + 20];
            object.drawInfo.uniforms.u_lightColor3 = [1, 0, 0];
            object.drawInfo.uniforms.u_specularColor3 = [0, 0 ,0];
          }  else {
            object.drawInfo.uniforms.u_lightWorldPosition3 = [0, 0, 0]
            object.drawInfo.uniforms.u_lightColor3 = [0, 0, 0];
            object.drawInfo.uniforms.u_specularColor3 = [0, 0, 0];
          }

          // if (projectileAlive[1]) {
          //   object.drawInfo.uniforms.u_lightWorldPosition3 = [shootList[1].trs.translation[0], shootList[1].trs.translation[1], shootList[1].trs.translation[2] + 5];
          //   object.drawInfo.uniforms.u_lightColor3 = [0, 1, 0];
          //   object.drawInfo.uniforms.u_specularColor3 = [0, 1 ,0];
          // }  else {
          //   object.drawInfo.uniforms.u_lightWorldPosition3 = [0, 0, 0]
          //   object.drawInfo.uniforms.u_lightColor3 = [0, 0, 0];
          //   object.drawInfo.uniforms.u_specularColor3 = [0, 0, 0];
          // }

          // if (projectileAlive[2]) {
          //   object.drawInfo.uniforms.u_lightWorldPosition4 = [shootList[2].trs.translation[0], shootList[2].trs.translation[1], shootList[2].trs.translation[2] + 5];
          //   object.drawInfo.uniforms.u_lightColor4 = [1, 0, 0];
          //   object.drawInfo.uniforms.u_specularColor4 = [0, 0, 0];
          // }  else {
          //   object.drawInfo.uniforms.u_lightWorldPosition4 = [0, 0, 0]
          //   object.drawInfo.uniforms.u_lightColor4 = [0, 0, 0];
          //   object.drawInfo.uniforms.u_specularColor4 = [0, 0, 0];
          // }

          object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);

          object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(degToRad(0)));

          object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(viewProjectionMatrix, object.worldMatrix);

          object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));

          object.drawInfo.uniforms.u_color = [1, 1, 1, 1]

          object.drawInfo.uniforms.u_lightWorldPosition = [config.lightX, config.lightY, config.lightZ]

          object.drawInfo.uniforms.u_viewWorldPosition = convertObjectToArray(arrayCameras[indexCamera].cameraPosition)
      })

      twgl.drawObjectList(gl, objectsToDraw);

      requestAnimationFrame(drawScene);
    }
  }
}

main(0);
