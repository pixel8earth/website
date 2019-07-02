import React, { Component } from 'react'
import * as THREE from 'three'
import MapControls from './MapControls'
import SphericalMercator from 'sphericalmercator'
import cover from '@mapbox/tile-cover'
import { getBaseLog, pointToTile, llPixel } from './utils';
import Sidebar from '../Sidebar';

class ThreeMap extends Component {
  layers = []
  groups = []
  loadedTiles = []
  tile_zoom = 18
  mouse = new THREE.Vector2()

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.size = 65024 // the base plane size (full extent of the map)
    this.mercator = new SphericalMercator({size: this.size});
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1/99, 100000000000000)
    this.camera.position.y = 0.5 //this.props.cam_zoom || 100
    this.camera.lookAt(this.scene.position)
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    this.controls = new MapControls(this.camera, this.renderer.domElement)
    //this.controls.zoomSpeed = 0.25
    this.controls.maxPolarAngle = 1.35
    this.controls.addEventListener('change', this.renderScene)

    this.raycaster = new THREE.Raycaster();

    var basePlane = new THREE.PlaneBufferGeometry(this.size*100, this.size*100, 1, 1);
    var mat = new THREE.MeshBasicMaterial({wireframe: true, opacity:0, transparent: true});

    this.plane = new THREE.Mesh( basePlane, mat );
    this.plane.rotation.x = -0.5*Math.PI;
    this.scene.add( this.plane );

    //Add light for meshes
    this.scene.add( new THREE.HemisphereLight( 0x443333, 0xffffff ) );


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

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderScene()
  }

  renderScene = () => {
    if (this.camera.position.y > 600) {
      this.camera.position.y = 600
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
    px = {x: px[0] - this.size/ 2, y: 0, z: px[1] - this.size / 2 };
    return px
  }

  unproject(pt) {
    var lngLat = this.mercator.ll([pt.x + this.size / 2, pt.z + this.size / 2 ], 0);
    lngLat[0] += this.props.center[0]
    lngLat[1] += this.props.center[1]
    return lngLat.map(function(num){return num.toFixed(5)/1})
  }

  projectToScene(px) {
    const width = window.innerWidth
    const height = window.innerHeight
    var screenPosition = {x: (px[0]/width-0.5)*2, y:(0.5-px[1]/height)*2};
    this.raycaster.setFromCamera(screenPosition, this.camera);
    var pt = this.raycaster.intersectObject(this.plane)[0].point;
    return pt;
  }

  project(lnglat) {
    let px = this.mercator.px(lnglat,0);
    px = {x:px[0]-this.size/2, y:0, z:px[1]-this.size/2};
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
      console.log('New Tile', newTile, this.tile)
      this.tile = newTile
      this.updateTiles()
    }

    //if (corners[0] === screenPosition) return;
    //else screenPosition = corners[0];


    //this.flag = 0; // turn off mouse move handler
    //TODO: possibly need a strategy to find the screen coords in scene world coords
    // could use this to compute the viewable bbox in lat/lon and get tiles at a given zoom
    // Another option is to use raycasting onto the base plane and find all tiles (but tricky at low angles)
    //var v = new THREE.Vector3( 0, 150, 0 )//.unproject( this.camera );

    // these scales are probably an issue, need to find a way to not use them
    // but they slow down the impact of panning on tile requests
    /*const scaleX = 0.035 // these suck to have FYI... just hardcoded scale factors...
    const scaleY = 0.035

    const lngLat = this.unproject(this.controls.target, scaleX, scaleY)
    const lng = (lngLat[0] * scaleX) + this.props.center[0]
    const lat = (lngLat[1] * scaleY) + this.props.center[1]
    const t = pointToTile(lng, lat, this.tile_zoom) // thinking that merc or mercator should do this...
    const newTile = new THREE.Vector3(t[0], t[1], t[2])

    if (newTile.x !== this.tile.x || newTile.y !== this.tile.y) {
      //console.log('NEW Center tile', newTile.x, newTile.y)
      this.tile = newTile
      this.updateTiles()
    }*/
  }

  updateTiles(e) {
    console.log('updateTiles')
    /*try {
      const ul = {x:-1,y:-1,z:-1}
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

      console.log('raycasted tiles', bboxTiles.length)
      // TODO protect the length of tiles here. At low angles and high zooms this number of tiles gets BIGGG
      this.updateLayers(bboxTiles)
    } catch(e) {*/
      const buf = 1
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
      console.log('raycaster failed', e, newTiles.length)
      this.updateLayers(newTiles)
    //}
  }

  updateLayers(tiles) {
    this.layers.forEach(l => l.update({
        tiles,
        scene: this.scene,
        offsets: this.offsets,
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

  render() {
    return(
      <div style={{ display: 'inline-flex' }}>
        <Sidebar
          groups={this.groups}
          add={this.addGroupToScene}
          remove={this.removeGroupFromScene}
          render={this.renderScene}
        />
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}

export default ThreeMap
