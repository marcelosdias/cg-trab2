const radToDeg = rad => rad * 180 / Math.PI;

const degToRad = deg => deg * Math.PI / 180;
  
const computeMatrix = (matrix, config) => {
    matrix.trs.translation = [config.translationX, config.translationY, config.translationZ]
    matrix.trs.rotation = [degToRad(config.rotationX), degToRad(config.rotationY), degToRad(config.rotationZ)]
    matrix.trs.scale = [config.scaleX, config.scaleY, config.scaleZ]
}

const getRandomInt = (max) => Math.floor(Math.random() * max);

const convertObjectToArray = object => [object.x, object.y, object.z]

const calculateNormal = (position, indices) => {
  let pontos = []
  let faces = []
  
  for (let i = 0; i < position.length; i += 3) {
      pontos.push([position[i], position[i+1],position[i+2]])
  }
  
  for (let i = 0; i < indices.length; i += 3) {
      faces.push([indices[i], indices[i+1],indices[i+2]])
  }

  var normalUsadas = {}

  for (let i = 0, j = 0; i < position.length; i+=3, j++) {
      normalUsadas[j] = []
  }

  normal = faces.map(item => {
      // AB AC
      vetorA1 = [pontos[item[1]][0] - pontos[item[0]][0], pontos[item[1]][1] - pontos[item[0]][1], pontos[item[1]][2] - pontos[item[0]][2]]
      vetorB1 = [pontos[item[2]][0] - pontos[item[0]][0], pontos[item[2]][1] - pontos[item[0]][1], pontos[item[2]][2] - pontos[item[0]][2]]

      // BA BC
      vetorB2 = [pontos[item[0]][0] - pontos[item[1]][0], pontos[item[0]][1] - pontos[item[1]][1], pontos[item[0]][2] - pontos[item[1]][2]]
      vetorA2 = [pontos[item[2]][0] - pontos[item[1]][0], pontos[item[2]][1] - pontos[item[1]][1], pontos[item[2]][2] - pontos[item[1]][2]]

      // CA CB
      vetorA3 = [pontos[item[0]][0] - pontos[item[2]][0], pontos[item[0]][1] - pontos[item[2]][1], pontos[item[0]][2] - pontos[item[2]][2]]
      vetorB3 = [pontos[item[1]][0] - pontos[item[2]][0], pontos[item[1]][1] - pontos[item[2]][1], pontos[item[1]][2] - pontos[item[2]][2]]

      produto = [
          vetorA1[1] * vetorB1[2] - vetorB1[1] * vetorA1[2],
          vetorB1[0] * vetorA1[2] - vetorA1[0] * vetorB1[2],
          vetorA1[0] * vetorB1[1] - vetorB1[0] * vetorA1[1],

          vetorA2[1] * vetorB2[2] - vetorB2[1] * vetorA2[2],
          vetorB2[0] * vetorA2[2] - vetorA2[0] * vetorB2[2],
          vetorA2[0] * vetorB2[1] - vetorB2[0] * vetorA2[1],

          vetorA3[1] * vetorB3[2] - vetorB3[1] * vetorA3[2],
          vetorB3[0] * vetorA3[2] - vetorA3[0] * vetorB3[2],
          vetorA3[0] * vetorB3[1] - vetorB3[0] * vetorA3[1]
      ]

      let distancia = []

      for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
          distancia.push(Math.abs(Math.sqrt(produto[i] * produto[i] + produto[i+1] * produto[i+1] + produto[i+2] * produto[i+2])))

          produto[i] = produto[i] / distancia[j]
          produto[i+1] = produto[i+1] / distancia[j]
          produto[i+2] = produto[i+2] / distancia[j]
      }

      for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
          if (normalUsadas[item[0]].length == 0) {
              normalUsadas[item[0]] = [produto[i], produto[i+1], produto[i+2]]
          } else {
              if (normalUsadas[item[1]].length == 0) {
                  normalUsadas[item[1]] = [produto[i], produto[i+1], produto[i+2]]
              } else {
                  normalUsadas[item[2]] = [produto[i], produto[i+1], produto[i+2]]
              }
          }
      }
 
      return produto
  })

  let formattedCubeNormal = []
  
  for (const item in normalUsadas) {
      for (let i = 0; i < normalUsadas[item].length; i++) {
        formattedCubeNormal.push(normalUsadas[item][i])
      }
  }

  return formattedCubeNormal
}

const createArray = type =>   {
  const copyFormat = type == 'cube' ? JSON.parse(JSON.stringify(cubeFormat)) : JSON.parse(JSON.stringify(pyramidFormat))

  let cubeNormal = calculateNormal(copyFormat.position, copyFormat.indices)

  const newArray = {
    position: { numComponents: 3, data: copyFormat.position, },
    indices:{ numComponents: 3, data: copyFormat.indices, },
    normal: { numComponents: 3, data: cubeNormal },
  }

  return newArray
}

const updateScene = () => {
  const updatedValues = sceneDescription.children.map(item => {
    let name = item.name

    item.translation = nodeInfosByName[name].trs.translation
    item.rotation = nodeInfosByName[name].trs.rotation
    item.format = nodeInfosByName[name].format
    return item
  })

  sceneDescription.children = [...updatedValues]

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
  shootList = []
  enemyList = []
  enemyShootList = []
}

const mapMoviments = (event) => {
  if (firstTime) {
    const audio = new Audio("src/sounds/tema.mp3");

    audio.volume = 0.1
  
    audio.autoplay = true
  
    audio.play()

    firstTime = false
  }

  if (event.code === 'ArrowRight') {
    if (config.translationX <= 32)
      config.translationX += speedMoviment * 110
  }
  else if (event.code === 'ArrowLeft') {
    if (config.translationX >= -32)
      config.translationX -= speedMoviment * 110
  }
  // else if (event.code === 'ArrowUp')  {
  //   config.translationY += 3
  // }

  // else if (event.code === 'ArrowDown')  {
  //   config.translationY -= 3

  //}
  else if (event.code === 'Space') {
    if (shootList.length > 2) return 

    const sound = new Audio("src/sounds/tiro.mp3 ");

    sound.autoplay = true

    sound.play()

    const shoot = {
      name: `player-shoot-${index}`,
      draw: true,
      translation: [...nodeInfosByName['spaceship'].trs.translation],
      rotation: [...nodeInfosByName['spaceship'].trs.rotation],
      format: {...nodeInfosByName['spaceship'].format},
      children: [],
      scale: [0.5, 0.5, 0.5],
    }

    updateScene()

    sceneDescription.children[2].children.push(shoot)

    scene = makeNode(sceneDescription);

    projectileAlive[index] = true

    index++
    shooting = true

    shootlength++
  }
}

const createEnemies = sceneDescription => {
  const { format } = {...sceneDescription.children[0].children[0]}

  let firstPosition = -30
  let line = 24

  for (let i = 0; i < 40; i++) {
    if (i % 10 == 0) {
      line -= 3.5
      firstPosition = -30
    }

    const newEnemy = {
      name: `enemy-${i}`,
      id: indexEnemy,
      draw: true,
      translation: [firstPosition, line, 80],
      rotation: [degToRad(0), degToRad(0), degToRad(0)],
      format,
      children: [],
    }

    indexEnemy++

    sceneDescription.children[1].children.push(newEnemy)

    firstPosition += 4
  }
}

const createBarries = sceneDescription => {
  const { format } = {...sceneDescription.children[0].children[0]}

  let xPosition = -20

  for (let i = 0; i < 3; i++) {
    const newBarrier = {
      name: `barrier-${i}`,
      id: i,
      hp: 80,
      draw: true,
      translation: [xPosition, -17, 80],
      rotation: [degToRad(0), degToRad(0), degToRad(0)],
      format,
      scale: [3, 1, 1],
      children: [],
    }

    sceneDescription.children[3].children.push(newBarrier)

    xPosition += 20
  }
   
}

const enemiesAnimation = velocity => {
  for (let i = 0; i < enemyList.length; i++) {
    if (direction == 0) {
      if (enemyList[9].trs.translation[0] > 36) {
        direction = 1

        for (let j = 10; j < enemyList.length; j++) 
          enemyList[j].trs.translation[0] += velocity

        for (let j = 0; j < enemyList.length; j++) 
          enemyList[j].trs.translation[1] -= 0.5
        break

      } else {
        enemyList[i].trs.translation[0] += velocity
      }
    } else {
      if (enemyList[0].trs.translation[0] < -36) {
        direction = 0

        for (let j = 1; j < enemyList.length; j++) 
          enemyList[j].trs.translation[0] -= velocity

        for (let j = 0; j < enemyList.length; j++) 
          enemyList[j].trs.translation[1] -= 0.5
    
        break
    } else 
      enemyList[i].trs.translation[0] -= velocity
    }

    if (enemyList[i].trs.translation[1] < -18 && (
      enemyList[i].trs.translation[0] > -34 && enemyList[i].trs.translation[0] < 34
    )) {
      gameover = true
      animationTime = 0
    }
  }
}

const enemyShooting = selectedEnemy => {
  const shoot = {
    name: `enemy-shoot-${index}`,
    draw: true,
    translation: [...enemyList[selectedEnemy].trs.translation],
    rotation: [...enemyList[selectedEnemy].trs.rotation],
    format: {...enemyList[selectedEnemy].format},
    children: [],
    scale: [0.5, 0.5, 0.5],
  }

  updateScene()   

  sceneDescription.children[4].children.push(shoot)

  scene = makeNode(sceneDescription);
}

const checkIfPlayerShotBarriers = (playerShootTranslationX, playerShootTranslationY,  barrierTranslationX, barrierTranslationY, indexBarriers) => {
  let collision = false

  if (
    (
      playerShootTranslationY < (barrierTranslationY + 1.2) &&
      playerShootTranslationY > (barrierTranslationY - 1.2)
      ) &&
      (
        playerShootTranslationX < (barrierTranslationX + 4) &&
        playerShootTranslationX > (barrierTranslationX - 4)
      )
    ) {
      
      barrierList[indexBarriers].hp -= 10 

      if (barrierList[indexBarriers].hp <= 0) {
        const newBarriers= sceneDescription.children[3].children.filter(item => item.id !== barrierList[indexBarriers].id)

        sceneDescription.children[3].children = [...newBarriers]

        barrierList = []

      }

      sceneDescription.children[2].children.shift()

      updateScene()

      scene = makeNode(sceneDescription);
    
      collision = true

      index--

      projectileAlive[index] = false
    }

    return collision
}

const checkIfPlayerShotEnemy = (playerShootTranslationX, playerShootTranslationY, enemyTranslationX, enemyTranslationY, indexEnemy) => {
  let collision = false

  if (
      (
        playerShootTranslationY < (enemyTranslationY + 1.2) &&
        playerShootTranslationY > (enemyTranslationY - 1.2)
      ) &&
      (
        playerShootTranslationX < (enemyTranslationX + 1.2) &&
        playerShootTranslationX > (enemyTranslationX - 1.2)
      )
    ) {
        enemyList[indexEnemy].trs.translation[1] += 900
  
        sceneDescription.children[2].children.shift()
  
        updateScene()
  
        scene = makeNode(sceneDescription);
        index--
  
        projectileAlive[index] = false
  
        collision = true
  
        enemyKilled++   
        
        pontos += 10
  }

  return collision
}

const checkIfPlayerMissedTheShot = (playerShootTranslationY) => {
  let collision = false

  if (playerShootTranslationY > 24) {
    sceneDescription.children[2].children.shift()

    updateScene()

    scene = makeNode(sceneDescription);

    index--

    projectileAlive[index] = false

    collision = true

  }

  return collision
}

const checkIfEnemyShotBarriers = (enemyShootTranslationX, enemyShootTranslationY, barrierTranslationX, barrierTranslationY, indexBarriers) => {
  let collision = false

  if (
    (
      enemyShootTranslationY <= (barrierTranslationY + 2) &&
      enemyShootTranslationY >= (barrierTranslationY - 1)
      ) &&
      (
        enemyShootTranslationX < (barrierTranslationX + 4) &&
        enemyShootTranslationX > (barrierTranslationX - 4)
      )
    ) {
      
      barrierList[indexBarriers].hp-=10

      if (barrierList[indexBarriers].hp <= 0) {
        const newBarriers= sceneDescription.children[3].children.filter(item => item.id !== barrierList[indexBarriers].id)

        sceneDescription.children[3].children = [...newBarriers]

        barrierList = []
      }

      sceneDescription.children[4].children.shift()

      updateScene()

      scene = makeNode(sceneDescription);

      collision = true
  }

  return collision
}

const checkIfEnemyShotPlayer = (enemyShootTranslationX, enemyShootTranslationY, playerTranslationX, playerTranslationY) => {
  let collision = false

  if (
    (
      enemyShootTranslationY < (playerTranslationY + 1.2) &&
      enemyShootTranslationY > (playerTranslationY - 1.2)
      ) &&
      (
        enemyShootTranslationX < (playerTranslationX + 1.2) &&
        enemyShootTranslationX > (playerTranslationX - 1.2)
      )
    ) {
      collision = true

      gameover = true

      const audio = new Audio("src/sounds/morte.mp3");

      audio.volume = 0.2
    
      audio.autoplay = true
    
      audio.play()
    }

    return collision
}

const checkIfEnemyMissedTheShot = enemyShootTranslationY => {
  if (enemyShootTranslationY < -30) {

    sceneDescription.children[4].children.shift()

    updateScene()

    enemyShootList = []

    scene = makeNode(sceneDescription)
  }
}

const playersActions = shootSpeed => { 
  let length = shootList.length

  let collision = false

  for (indexShoot = 0; indexShoot < length; indexShoot++) {
    shootList[indexShoot].trs.translation[1] += shootSpeed

    collision = checkIfPlayerMissedTheShot(shootList[indexShoot].trs.translation[1])

    if (collision) break

    for (let indexBarriers = 0; indexBarriers < barrierList.length; indexBarriers++) {
      collision = checkIfPlayerShotBarriers(
        shootList[indexShoot].trs.translation[0],
        shootList[indexShoot].trs.translation[1],
        barrierList[indexBarriers].trs.translation[0],
        barrierList[indexBarriers].trs.translation[1],
        indexBarriers
      )

      if (collision) break
    }

    if (collision) break
    

    for (indexEnemy = 0; indexEnemy < enemyList.length; indexEnemy++) {
      collision = checkIfPlayerShotEnemy(
        shootList[indexShoot].trs.translation[0],
        shootList[indexShoot].trs.translation[1],
        enemyList[indexEnemy].trs.translation[0],
        enemyList[indexEnemy].trs.translation[1],
        indexEnemy
      )

      if (collision) break
    }

    if (collision) break
  }
}

const enemiesActions = shootSpeed => {
  let collision = false

  for (let indexShoot = 0; indexShoot < enemyShootList.length; indexShoot++) {
    enemyShootList[indexShoot].trs.translation[1] -= shootSpeed
    
    for (let indexBarriers = 0; indexBarriers < barrierList.length; indexBarriers++) {
      collision = checkIfEnemyShotBarriers(
        enemyShootList[indexShoot].trs.translation[0],  
        enemyShootList[indexShoot].trs.translation[1],
        barrierList[indexBarriers].trs.translation[0],
        barrierList[indexBarriers].trs.translation[1],
        indexBarriers
        )

        if (collision) break
    }

    if (collision) break

    collision = checkIfEnemyShotPlayer(
      enemyShootList[indexShoot].trs.translation[0],
      enemyShootList[indexShoot].trs.translation[1],
      nodeInfosByName['spaceship'].trs.translation[0],
      nodeInfosByName['spaceship'].trs.translation[1]
    )

    if (collision) break

    collision = checkIfEnemyMissedTheShot(enemyShootList[indexShoot].trs.translation[1])

    if (collision) break
  }
}