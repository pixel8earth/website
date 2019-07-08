import React, { Component } from 'react'
import * as THREE from 'three'
import MapControls from './MapControls'
import SphericalMercator from 'sphericalmercator'
import cover from '@mapbox/tile-cover'
import { getBaseLog, pointToTile, llPixel } from './utils';
import Sidebar from '../components/Sidebar';
import ZoomControl from '../components/ZoomControl';
import worker from '../lib/worker';
import WebWorker from '../lib/WebWorker';

class ThreeMap extends Component {
  constructor() {
    super();
    this.layers = [];
    this.groups = [];
    this.loadedTiles = [];
    this.tile_zoom = 18
    this.mouse = new THREE.Vector2();
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.size = 65024 // the base plane size (full extent of the map)
    this.mercator = new SphericalMercator({size: this.size});
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1/99, 100000000000000)
    this.camera.position.z = 0.5 //this.props.cam_zoom || 100
    this.camera.up = new THREE.Vector3(0,0,1)
    this.camera.lookAt(this.scene.position)
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.renderer.sortObjects = false
    this.mount.appendChild(this.renderer.domElement)

    this.controls = new MapControls(this.camera, this.renderer.domElement)
    //this.state.controls.zoomSpeed = 0.25
    //this.state.controls.maxPolarAngle = 1.35
    this.controls.addEventListener('change', this.renderScene)

    this.raycaster = new THREE.Raycaster();

    var basePlane = new THREE.PlaneBufferGeometry(this.size*100, this.size*100, 1, 1);
    var mat = new THREE.MeshBasicMaterial({wireframe: true, opacity:0, transparent: true});

    this.plane = new THREE.Mesh( basePlane, mat );
    this.scene.add( this.plane );

    //Add light for meshes
    const light = new THREE.HemisphereLight( 0x443333, 0xffffff, 1 )
    this.scene.add(light);

    this.tile = this.centerTile()
    this.offsets = this.getOffsets()

    this.axes = new THREE.AxesHelper( .25 );
    this.scene.add( this.axes );

    this.layers = this.props.layers;
    this.layers.forEach( layer => {
      if (!!layer.getGroup) {
        const group = layer.getGroup();
        this.groups.push(group);
        this.scene.add(group);
      }
    })

    this.workerPool = [];
    for (let i = 0; i < 4; i++) {
      const w = new WebWorker(worker, { type: "module" });
      w.addEventListener('message', this.onMessage, false)
      this.workerPool.push(w)
    }

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('mouseup', this.onUp.bind(this), false)
    window.addEventListener('mousedown', this.onDown.bind(this), false)
    window.addEventListener('mousemove', this.onMove.bind(this), false)
    this.renderScene()
    this.updateTiles()
  }

  componentWillUnmount(){
    this.mount.removeChild(this.renderer.domElement)
  }

  // gets messages from workers and delegates to correct layer
  onMessage = e => {
    const lyr = this.getLayerByName(e.data.name)
    lyr.receiveMessage(e)
  }

  getLayerByName = name => {
    return this.layers.find(l => l.name === name)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderScene()
  }

  renderScene = () => {
    if (this.camera.position.z > 2) {
      this.camera.position.z = 2
    } else if (this.camera.position.z < 0.0) {
      this.camera.position.z = 0
    }
    this.renderer.render(this.scene, this.camera)
  }

  // convert center lat/lon to web mercator tile coords
  centerTile() {
    const tile = pointToTile(this.props.center[0], this.props.center[1], this.tile_zoom)
    return {x: tile[0], y: tile[1], z: tile[2]}
  }

  getCenter(){
    var pt = this.controls.target;
    return this.unproject(pt)
  }

  getZoom() {
    const pt = this.controls.target.distanceTo(this.controls.object.position);
    return Math.round(Math.min(Math.max(getBaseLog(0.5, pt/this.size) + 4, 0), 18));
  }

  getOffsets() {
    var px = llPixel(this.props.center, 0, this.size);
    px = {x: px[0] - this.size/ 2, y: px[1] - this.size / 2, z: 0.425};
    return px
  }

  unproject(pt) {
    const y = -pt.y + (pt.y * 0.15) // scales y to slow down the y dir center tile math
    var lngLat = this.mercator.ll([pt.x + this.size / 2, y + this.size / 2 ], 0);
    lngLat[0] += this.props.center[0]
    lngLat[1] += this.props.center[1]
    return lngLat.map(function(num){return num.toFixed(5)/1})
  }

  /*projectToScene(px) {
    const width = window.innerWidth
    const height = window.innerHeight
    var screenPosition = {x: (px[0]/width-0.5)*2, y:(0.5-px[1]/height)*2};
    this.raycaster.setFromCamera(screenPosition, this.camera);
    var pt = this.raycaster.intersectObject(this.plane)[0].point;
    return pt;
  }*/

  projectToScene(pt) {
    const canvas = this.renderer.domElement
    const rect = canvas.getBoundingClientRect();
    let x = pt[0] - rect.left
    let y = pt[1] - rect.top
    x = (x / rect.width) * 2 - 1;
    y = - (y / rect.height) * 2 + 1;
    const pos = new THREE.Vector3(x, y, 0.0)
    pos.unproject(this.camera)
    pos.sub(this.camera.position).normalize()
    var distance = -this.camera.position.z / pos.z
    var scaled = pos.multiplyScalar(distance)
    var coords = this.camera.position.clone().add(scaled)
    return this.unproject(coords)
  }

  project(lnglat) {
    let px = this.mercator.px(lnglat,0);
    px = {x:px[0]-this.size/2, y:px[1]-this.size/2, z: 0};
    return px
  }

  onMove(e) {
    if (this.flag) {
      if (this.axes) {
        //this.axes.position.x = this.controls.target.x
        //this.axes.position.z = this.controls.target.z
      }
    }
  }

  onDown(e) {
    // turn on mouse move handler
    this.flag = 1;
  }

  onUp(e) {
    //compute the center tile... from controls.target
    const newCenter = this.getCenter()
    const t = pointToTile(newCenter[0], newCenter[1], this.tile_zoom) // thinking that merc or mercator should do this...
    const newTile = new THREE.Vector3(t[0], t[1], t[2])

    if (newTile.x !== this.tile.x || newTile.y !== this.tile.y) {
      this.tile = newTile
      this.updateTiles()
    }
  }

  updateTiles(e) {
    const buf = 3
    if (this.controls && this.controls.getPolarAngle() < 0.0) {
      /*const ul = {x:-1,y:-1,z:-1}
      const ur = {x:1,y:-1,z:-1}
      const lr = {x:1,y:1,z:1}
      const ll = {x:-1,y:1,z:1}

      // NOTe - this fails as low polar angles, it needs to see the baseplane
      // when this fails i think we convert to the other tile loading...
      var corners = [ul, ur, lr, ll, ul].map( corner => {
          this.raycaster.setFromCamera(corner, this.camera);
          return this.raycaster.intersectObject(this.plane)[0].point;
      })

      const box = {
        "type": "Polygon",
        "coordinates": [corners.map( c => this.unproject(c) )]
      }

      // using tile-cover, figure out which tiles are inside viewshed and put in zxy order
      var bboxTiles = cover.tiles(box,{min_zoom: this.tile_zoom, max_zoom: this.tile_zoom})
          .map(([x,y,z]) => new THREE.Vector3(x, y, z));

      // TODO protect the length of tiles here. At low angles and high zooms this number of tiles gets BIGGG
      this.updateLayers(bboxTiles)*/

      const canvas = this.renderer.domElement
      const rect = canvas.getBoundingClientRect();
      const ll = this.projectToScene([rect.left, rect.top])
      const ur = this.projectToScene([rect.right, rect.bottom])
      const coords = [ll, [ll[0], ur[1]], ur, [ur[0], ll[1]], ll]
      //const coords = [[ul[0], lr[1]], ul, [lr[0], ul[1]], lr, [ul[0], lr[1]]]
      const box = {
        "type": "Polygon",
        "coordinates": [coords]
      }
      const tiles = cover.tiles(box,{min_zoom: this.tile_zoom, max_zoom: this.tile_zoom})
        .map(([x,y,z]) => new THREE.Vector3(x, y, z))

      const closeTiles = []
      tiles.forEach(t => {
        const dx = Math.abs(this.tile.x - t.x)
        const dy = Math.abs(this.tile.y - t.y)
        if (dx <= buf && dy <= buf) {
          closeTiles.push(t)
        }
      })
      this.updateLayers(closeTiles)
    } else {
      const minx = this.tile.x - (buf) // extra tile in x dir
      const maxx = this.tile.x + (buf) // extra tile in x dir
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
  }

  updateLayers(tiles) {
    this.layers.forEach(l => l.update({
        tiles,
        scene: this.scene,
        offsets: this.offsets,
        workerPool: this.workerPool,
        render: () => this.renderScene()
      })
    );
  }

  addGroupToScene = group => {
    this.scene.add(group);
  }

  removeGroupFromScene = group => {
    this.scene.remove(group);
  }

  changeZoom = direction => {
    // granularity: 0.5 is scope.zoomSpeed in mapControls increasing this
    // number increases the amt of zoom change per click
    const granularity = 0.5;
    const scale = Math.pow(0.95, granularity);
    direction === 'in'
      ? this.controls.dollyOut(scale)
      : this.controls.dollyIn(scale);
    this.controls.update();
  }

  render() {
    return(
      <div style={{ display: 'inline-flex' }}>
        <Sidebar
          groups={this.groups}
          add={this.addGroupToScene}
          remove={this.removeGroupFromScene}
          render={this.renderScene}
        />
        <ZoomControl changeZoom={this.changeZoom} />
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}

export default ThreeMap
