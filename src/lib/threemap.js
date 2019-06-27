import React, { Component } from 'react'
import * as THREE from 'three'
import MapControls from './MapControls'
import SphericalMercator from 'sphericalmercator'

const basePlaneDimension = 65024;
const mercator = new SphericalMercator({size: basePlaneDimension});
const merc = new SphericalMercator({ size: 256 })

function pointToTileFraction(lon, lat, z) {
  var sin = Math.sin(lat * (Math.PI / 180)),
      z2 = Math.pow(2, z),
      x = z2 * (lon / 360 + 0.5),
      y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI)

  // Wrap Tile X
  x = x % z2
  if (x < 0) x = x + z2
  return [x, y, z]
}

function pointToTile (lon, lat, z) {
    var tile = pointToTileFraction(lon, lat, z)
    tile[0] = Math.floor(tile[0])
    tile[1] = Math.floor(tile[1])
    return tile
}

function getBaseLog(base, result) {
  return Math.log(result) / Math.log(base);
}

class ThreeMap extends Component {
  layers = []
  loadedTiles = []
  tile_zoom = 18
  mouse = new THREE.Vector2()

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1/99, 100000000000000)
    this.camera.position.y = this.props.cam_zoom || 100
    this.camera.lookAt(this.scene.position)
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    this.controls = new MapControls(this.camera, this.renderer.domElement)
    this.controls.addEventListener('change', this.renderScene)

    this.raycaster = new THREE.Raycaster();

    var basePlane = new THREE.PlaneBufferGeometry(basePlaneDimension*100, basePlaneDimension*100, 1, 1);
    var mat = new THREE.MeshBasicMaterial({wireframe: true, opacity:0, transparent: true});

    this.plane = new THREE.Mesh( basePlane, mat );
    this.plane.rotation.x = -0.5*Math.PI;
    this.scene.add( this.plane );

    //Add light for meshes
    this.scene.add( new THREE.HemisphereLight( 0x443333, 0xffffff ) );

    this.centerTile = this.centerTile()
    this.tile = this.centerTile
    // NOTE: possibly needed for rendering data as an offset 
    this.offsets = mercator.forward(this.props.center)
    
    this.axes = new THREE.AxesHelper( 1 );
    this.scene.add( this.axes );
    this.layers = this.props.layers
    this.updateTiles()

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('mouseup', this.onUp.bind(this), false)
    this.renderScene()
  }

  componentWillUnmount(){
    this.mount.removeChild(this.renderer.domElement)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderScene()
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  // convert center lat/lon to web mercator tile coords
  centerTile() {
    const tile = pointToTile(this.props.center[0], this.props.center[1], this.tile_zoom)
    return {x: tile[0], y: tile[1], z: tile[2]}
  }

  getZoom() {
    const pt = this.controls.target.distanceTo(this.controls.object.position);
    return Math.min(Math.max(getBaseLog(0.5, pt/(basePlaneDimension)) + 8, 0), 18);
  }

  getOffsets() {
    const bbox = merc.bbox(this.tile.x, this.tile.x, this.tile.z, true, '900913')
    return [bbox[0], bbox[3], 0]
  }

  unproject(pt, scaleX, scaleY) {
    const x = pt.x * scaleX
    const y = pt.z * scaleY
    var lngLat = mercator.ll([x + basePlaneDimension / 2, y + basePlaneDimension / 2], 0)
    return lngLat
  }

  projectToScene(px) {
    const width = window.innerWidth
    const height = window.innerHeight
    var screenPosition = {x: (px[0]/width-0.5)*2, y:(0.5-px[1]/height)*2};
    this.raycaster.setFromCamera(screenPosition, this.camera);
    var pt = this.raycaster.intersectObject(this.plane)[0].point;
    return pt;
  }

  onUp(e) {
    //TODO: possibly need a strategy to find the screen coords in scene world coords
    // could use this to compute the viewable bbox in lat/lon and get tiles at a given zoom 
    // Another option is to use raycasting onto the base plane and find all tiles (but tricky at low angles)
    //var v = new THREE.Vector3( 0, 150, 0 )//.unproject( this.camera );

    // these scales are probably an issue, need to find a way to not use them
    // but they slow down the impact of panning on tile requests    
    const scaleX = 0.045 
    const scaleY = 0.035 

    if (this.axes) {
      this.axes.position.x = this.controls.target.x
      this.axes.position.z = this.controls.target.z
    }

    const lngLat = this.unproject(this.controls.target, scaleX, scaleY)
    const lng = lngLat[0] * scaleX + this.props.center[0]
    const lat = (lngLat[1] * scaleY) + this.props.center[1]
    const t = pointToTile(lng, lat, this.tile_zoom) // thinking that merc or mercator should do this...
    const newTile = new THREE.Vector3(t[0], t[1], t[2])

    if (newTile.x !== this.tile.x || newTile.y !== this.tile.y) {
      //console.log('NEW Center tile', newTile.x, newTile.y)
      this.tile = newTile
      this.updateTiles()
    }
  }

  updateTiles(e) {
    const buf = 2
    const minx = this.tile.x - buf
    const maxx = this.tile.x + buf
    const miny = this.tile.y - buf
    const maxy = this.tile.y + buf

    const newTiles = []
    for ( let x = minx; x < maxx+1; x++ ) {
      for ( let y = miny; y < maxy+1; y++ ) {
        newTiles.push(new THREE.Vector3(x, y, 18))
      }
    }
    this.updateLayers(newTiles)
  }

  updateLayers(tiles) {
    this.layers.forEach(l => l.update(tiles, this.scene, this.offsets, () => this.renderScene()))
  }

  render() {
    return(
      <div
        style={{ width: window.innerWidth, height: window.innerHeight }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default ThreeMap
