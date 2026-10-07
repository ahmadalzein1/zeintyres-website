// The 3D wheel behind the How it works frame sequence, built from code - no
// model files. render.mjs loads this page in a headless browser and calls
// renderFrame(t) for t from 0 to 1. The choreography in pose() lines up with
// the four steps, a quarter of t each.
//
// Everything is built with the axle along +Y (the lathe axis) and the face
// at +Y; wheelRoot turns that towards the camera.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const params = new URLSearchParams(location.search)
const OUT_W = Number(params.get('w') ?? 800)
const OUT_H = Number(params.get('h') ?? 667)
const SS = 2 // rendered at twice the size and scaled down, for clean edges
const W = OUT_W * SS
const H = OUT_H * SS

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(W, H, false)
renderer.setClearColor(0x000000, 0)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
document.body.appendChild(renderer.domElement)
renderer.domElement.style.width = `${OUT_W}px`

const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.75

const camera = new THREE.PerspectiveCamera(27, W / H, 0.1, 50)
camera.position.set(0, 0.35, 6.4)
camera.lookAt(0, -0.08, 0)

// --- Lights ---------------------------------------------------------------
const key = new THREE.DirectionalLight(0xffffff, 2.6)
key.position.set(-2.5, 5, 4)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.left = -3
key.shadow.camera.right = 3
key.shadow.camera.top = 3
key.shadow.camera.bottom = -3
key.shadow.radius = 14
key.shadow.blurSamples = 24
key.shadow.bias = -0.0005
scene.add(key)

const rim = new THREE.DirectionalLight(0xffffff, 2.2)
rim.position.set(4, 2, -3)
scene.add(rim)

const fill = new THREE.DirectionalLight(0xfff1f3, 0.5)
fill.position.set(3, -1, 4)
scene.add(fill)

const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.3 }))
ground.rotation.x = -Math.PI / 2
ground.position.y = -1.0
ground.receiveShadow = true
scene.add(ground)

// --- Materials ------------------------------------------------------------
const rubber = new THREE.MeshPhysicalMaterial({
  color: 0x121214, roughness: 0.62, metalness: 0, envMapIntensity: 0.35,
  clearcoat: 0.25, clearcoatRoughness: 0.45, side: THREE.DoubleSide,
})
const treadRubber = new THREE.MeshPhysicalMaterial({ color: 0x111113, roughness: 0.8, metalness: 0, envMapIntensity: 0.3 })
const alloy = new THREE.MeshPhysicalMaterial({
  color: 0xe4e6ea, metalness: 1, roughness: 0.14, clearcoat: 0.8, clearcoatRoughness: 0.08, side: THREE.DoubleSide,
})
const alloyInner = new THREE.MeshPhysicalMaterial({ color: 0x2c2e33, metalness: 0.9, roughness: 0.5, side: THREE.DoubleSide })
const chrome = new THREE.MeshPhysicalMaterial({ color: 0xf2f2f2, metalness: 1, roughness: 0.07 })
const discMat = new THREE.MeshPhysicalMaterial({ color: 0x74777e, metalness: 1, roughness: 0.34 })
const hatMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2c31, metalness: 0.85, roughness: 0.5 })
const holeMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 1 })
const red = new THREE.MeshPhysicalMaterial({
  color: 0xd0112d, metalness: 0.15, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06,
})

const mesh = (geo, mat) => {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

// --- Geometry helpers -----------------------------------------------------
const V = (x, y) => new THREE.Vector2(x, y)
const quad = (p0, p1, p2, n) => {
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t
    out.push(V(a * p0.x + b * p1.x + c * p2.x, a * p0.y + b * p1.y + c * p2.y))
  }
  return out
}
const arc = (cx, cy, r, a0, a1, n) => {
  const out = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * (i / n)
    out.push(V(cx + r * Math.cos(a), cy + r * Math.sin(a)))
  }
  return out
}
const join = (...parts) => parts.flatMap((p, i) => (i ? p.slice(1) : p))

// --- Tyre -----------------------------------------------------------------
const Ri = 0.705, Ro = 1.0, Wd = 0.225, C = 0.09
const frontWall = join(
  quad(V(Ri, Wd * 0.86), V(0.87, Wd * 1.13), V(Ro - C, Wd), 28),
  arc(Ro - C, Wd - C, C, Math.PI / 2, 0, 12),
)
const profile = join(
  frontWall,
  [V(Ro, Wd - C), V(Ro, -(Wd - C))],
  arc(Ro - C, -(Wd - C), C, 0, -Math.PI / 2, 12),
  quad(V(Ro - C, -Wd), V(0.87, -Wd * 1.13), V(Ri, -Wd * 0.86), 28),
)
const SEG = 200
const tyre = new THREE.Group()
tyre.add(mesh(new THREE.LatheGeometry(profile, SEG), rubber))

// Sidewall lettering + red pinstripe, painted on a lathe that follows the
// front sidewall. u runs around the wheel, v from bead to shoulder.
{
  const decalProfile = frontWall.map((p) => V(p.x, p.y + 0.003))
  let arcLen = 0
  for (let i = 1; i < decalProfile.length; i++) arcLen += decalProfile[i].distanceTo(decalProfile[i - 1])
  const TW = 8192, TH = 512
  const cvs = document.createElement('canvas')
  cvs.width = TW
  cvs.height = TH
  const g = cvs.getContext('2d')
  const rText = 0.86
  const uScale = TW / (2 * Math.PI * rText) // px per unit around
  const vScale = TH / arcLen // px per unit along the profile
  // Pinstripe near the bead
  g.fillStyle = '#d0112d'
  const stripeV = 0.1
  g.fillRect(0, (1 - stripeV) * TH - 0.006 * vScale, TW, 0.012 * vScale)
  // Lettering
  g.save()
  const textV = 0.42
  g.translate(0, (1 - textV) * TH)
  g.scale(1, vScale / uScale)
  g.fillStyle = '#77777d'
  const fontPx = 0.085 * uScale
  g.font = `800 ${fontPx}px "Arial Black", Arial, sans-serif`
  g.textBaseline = 'middle'
  const label = 'ZEIN TYRES   ·   AMCHIT   ·   24/7   ·   '
  const reps = 2
  const step = TW / reps
  for (let i = 0; i < reps; i++) {
    g.letterSpacing = `${0.012 * uScale}px`
    g.fillText(label, i * step + step * 0.04, 0)
  }
  g.restore()
  const tex = new THREE.CanvasTexture(cvs)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  // The lathe runs its u the other way round to reading order.
  tex.wrapS = THREE.RepeatWrapping
  tex.repeat.x = -1
  const decal = new THREE.Mesh(
    new THREE.LatheGeometry(decalProfile, SEG),
    new THREE.MeshPhysicalMaterial({
      map: tex, transparent: true, roughness: 0.6, metalness: 0, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -2,
    }),
  )
  decal.receiveShadow = true
  tyre.add(decal)
}

// Directional tread: two staggered rows of slanted blocks.
{
  const blocks = 60
  const geo = new RoundedBoxGeometry(0.1, 0.17, 0.05, 2, 0.012)
  const inst = new THREE.InstancedMesh(geo, treadRubber, blocks * 2)
  inst.castShadow = true
  inst.receiveShadow = true
  const d = new THREE.Object3D()
  let k = 0
  for (const side of [1, -1]) {
    for (let i = 0; i < blocks; i++) {
      const th = ((i + (side > 0 ? 0 : 0.5)) / blocks) * Math.PI * 2
      const R = Ro + 0.006
      d.position.set(R * Math.sin(th), side * 0.093, R * Math.cos(th))
      d.rotation.set(0, th, 0)
      d.rotateZ(side * 0.42)
      d.updateMatrix()
      inst.setMatrixAt(k++, d.matrix)
    }
  }
  tyre.add(inst)
}

// --- Rim ------------------------------------------------------------------
const rimGroup = new THREE.Group()
const barrel = join(
  [V(0.655, -0.215), V(0.665, -0.2)],
  [V(0.665, 0.15)],
  quad(V(0.665, 0.15), V(0.715, 0.155), V(0.722, 0.19), 8),
  quad(V(0.722, 0.19), V(0.725, 0.212), V(0.69, 0.214), 8),
  [V(0.655, 0.2)],
)
rimGroup.add(mesh(new THREE.LatheGeometry(barrel, SEG), alloy))
// Dark inner face of the barrel, so the gaps between spokes have depth.
rimGroup.add(mesh(new THREE.CylinderGeometry(0.662, 0.662, 0.4, SEG, 1, true), alloyInner))

// Twin spokes, tapered and bevelled.
{
  const s = new THREE.Shape()
  s.moveTo(-0.042, 0.17)
  s.quadraticCurveTo(-0.03, 0.42, -0.024, 0.66)
  s.lineTo(0.024, 0.66)
  s.quadraticCurveTo(0.03, 0.42, 0.042, 0.17)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.014, bevelSegments: 5, curveSegments: 16,
  })
  // Shape plane -> wheel face; extrude back along -Y from the face.
  geo.rotateX(Math.PI / 2)
  // Concave face: the rim end sits deeper than the hub end.
  geo.rotateX(0.14)
  for (let k = 0; k < 5; k++) {
    for (const off of [-0.1, 0.1]) {
      const sp = mesh(geo, alloy)
      sp.position.y = 0.215
      sp.rotation.y = (k / 5) * Math.PI * 2 + off
      rimGroup.add(sp)
    }
  }
}

// Hub, centre cap and nuts.
{
  const hub = join(
    [V(0, 0.228), V(0.07, 0.228)],
    quad(V(0.07, 0.228), V(0.17, 0.226), V(0.205, 0.18), 10),
    [V(0.21, 0.06)],
  )
  rimGroup.add(mesh(new THREE.LatheGeometry(hub, 96), alloy))
  const cap = mesh(new THREE.CylinderGeometry(0.07, 0.074, 0.03, 64), red)
  cap.position.y = 0.238
  rimGroup.add(cap)
  const ring = mesh(new THREE.TorusGeometry(0.074, 0.008, 12, 64), chrome)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.245
  rimGroup.add(ring)
}
const nuts = new THREE.Group()
{
  const geo = new THREE.CylinderGeometry(0.028, 0.028, 0.06, 6)
  const tip = new THREE.SphereGeometry(0.02, 16, 8)
  for (let k = 0; k < 5; k++) {
    const a = ((k + 0.5) / 5) * Math.PI * 2
    const n = mesh(geo, chrome)
    n.position.set(0.135 * Math.sin(a), 0.235, 0.135 * Math.cos(a))
    nuts.add(n)
    const t = mesh(tip, chrome)
    t.position.set(0.135 * Math.sin(a), 0.265, 0.135 * Math.cos(a))
    nuts.add(t)
  }
}
rimGroup.add(nuts)

// --- Brake (stays on the car) ---------------------------------------------
const disc = new THREE.Group()
{
  const d = mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.035, 128), discMat)
  d.position.y = -0.02
  disc.add(d)
  const hat = mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.1, 96), hatMat)
  hat.position.y = 0.02
  disc.add(hat)
  const holeGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.038, 16)
  const radii = [0.36, 0.42, 0.48]
  const per = 18
  const inst = new THREE.InstancedMesh(holeGeo, holeMat, radii.length * per)
  const o = new THREE.Object3D()
  let k = 0
  radii.forEach((r, ri) => {
    for (let i = 0; i < per; i++) {
      const a = ((i + ri / radii.length) / per) * Math.PI * 2
      o.position.set(r * Math.sin(a), -0.02, r * Math.cos(a))
      o.updateMatrix()
      inst.setMatrixAt(k++, o.matrix)
    }
  })
  disc.add(inst)
}

const caliper = new THREE.Group()
{
  // Upper right of the disc, as seen from the front.
  const a0 = THREE.MathUtils.degToRad(-78)
  const a1 = a0 + THREE.MathUtils.degToRad(46)
  const s = new THREE.Shape()
  const r0 = 0.45, r1 = 0.615
  s.absarc(0, 0, r1, a0, a1, false)
  s.absarc(0, 0, r0, a1, a0, true)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.14, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 5, curveSegments: 32,
  })
  geo.rotateX(Math.PI / 2)
  const m = mesh(geo, red)
  m.position.y = 0.05
  caliper.add(m)
}

// --- Assembly -------------------------------------------------------------
const pivot = new THREE.Group() // yaw, pitch, position
const wheelRoot = new THREE.Group()
wheelRoot.rotation.x = Math.PI / 2
pivot.add(wheelRoot)
scene.add(pivot)

const tyreSpin = new THREE.Group(); tyreSpin.add(tyre)
const rimSpin = new THREE.Group(); rimSpin.add(rimGroup)
const discSpin = new THREE.Group(); discSpin.add(disc)
wheelRoot.add(tyreSpin, rimSpin, discSpin, caliper)

// --- Choreography ---------------------------------------------------------
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const seg = (t, a, b) => clamp01((t - a) / (b - a))
const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
const lerp = (a, b, x) => a + (b - a) * x

const X0 = -1.0
function pose(t) {
  // 1. Rolls in from the left (0 - 0.22).
  const roll = inOut(seg(t, 0, 0.22))
  let x = lerp(X0, 0, roll)
  let spin = (x - X0) / Ro
  // 2. Turns to a three-quarter view to be looked over (0.24 - 0.42).
  const turn = inOut(seg(t, 0.24, 0.42))
  let yaw = lerp(0, -0.78, turn)
  let pitch = lerp(0, 0.1, turn)
  spin += 0.7 * seg(t, 0.24, 0.5)
  // 3. Comes apart along the axle, then goes back together.
  const ex = inOut(seg(t, 0.5, 0.61)) * (1 - inOut(seg(t, 0.71, 0.83)))
  spin += 0.12 * seg(t, 0.5, 0.75)
  x += 0.32 * ex
  // 4. Turns back towards side-on and spins up to speed.
  const back = inOut(seg(t, 0.8, 0.93))
  yaw = lerp(yaw, -0.22, back)
  pitch = lerp(pitch, 0.03, back)
  const go = seg(t, 0.82, 1)
  spin += Math.PI * 2 * 0.95 * go * go
  return { x, yaw, pitch, spin, ex }
}

function apply(t) {
  const p = pose(t)
  pivot.position.x = p.x
  pivot.rotation.set(p.pitch, p.yaw, 0, 'YXZ')
  // Positive Y here is a counter-clockwise turn seen from the front; rolling
  // to the right is clockwise.
  for (const g of [tyreSpin, rimSpin, discSpin]) g.rotation.y = -p.spin
  rimGroup.position.y = 0.85 * p.ex
  nuts.position.y = 0.5 * p.ex
  tyre.position.y = -0.22 * p.ex
}

const out = document.createElement('canvas')
out.width = OUT_W
out.height = OUT_H
const octx = out.getContext('2d')
octx.imageSmoothingQuality = 'high'

window.renderFrame = (t, quality = 0.82, type = 'image/webp') => {
  apply(t)
  renderer.render(scene, camera)
  octx.clearRect(0, 0, OUT_W, OUT_H)
  octx.drawImage(renderer.domElement, 0, 0, OUT_W, OUT_H)
  return out.toDataURL(type, quality)
}
window.ready = true
