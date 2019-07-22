import React, { Component } from 'react'
import * as THREE from 'three'
import MapControls from './MapControls'
import SphericalMercator from 'sphericalmercator'
import cover from '@mapbox/tile-cover'
import { getBaseLog, pointToTile, llPixel } from './utils';
import Sidebar from '../components/Sidebar';
import ZoomControl from '../components/ZoomControl';
import PositionDisplay from '../components/PositionDisplay';
import proj4 from 'proj4';

proj4.defs([
  [
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
  ],[
    'EPSG:32614',
    '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs'
  ],[
    'EPSG:32613',
    '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs'
  ]
]);

class ThreeMap extends Component {
  constructor() {
    super();
    this.mounted = false;
    this.layers = [];
    this.groups = [];
    this.root = new THREE.Group();
    this.geo = new THREE.Group();
    this.loadedTiles = [];
    this.tile_zoom = 18;
    this.mouse = new THREE.Vector2();
    this.state = {
      layersShowing: null,
      center: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.size = 65024 // the base plane size (full extent of the map)
    this.mercator = new SphericalMercator({size: this.size})
    this.zOffset = this.props.zOffset || 0
    //ADD SCENE
    this.scene = new THREE.Scene()
    this.scene.add(this.root);
    // Geo Group setup to adjust for offsets
    const xyOffset = proj4('EPSG:4326', this.props.proj).forward(this.props.center);
    this.geo.position.z = -xyOffset[0];
    this.geo.position.x = -xyOffset[1];
    this.geo.position.y = -this.zOffset;
    this.geo.updateMatrix();
    console.log('geo pos', this.geo.position);

    this.root.add(this.geo);
    this.root.updateMatrixWorld();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1/99, 100000000000000)
    this.root.add(this.camera);
    // The standard for WebVR is as follows:
    // positive X is to the user's right
    // positive Y is up
    // positive Z is behind the user
    //this.camera.position.y = this.zOffset + (this.props.camZoom || 1);
    this.camera.lookAt(this.scene.position)
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.renderer.sortObjects = false
    this.mount.appendChild(this.renderer.domElement)

    this.controls = new MapControls(this.camera, this.renderer.domElement)
    this.controls.minZoom = this.zOffset
    this.controls.target.y = this.zOffset
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.addEventListener('change', this.renderScene)
    const center = this.getCenter();
    this.setState({ center });

    this.raycaster = new THREE.Raycaster();

    var basePlane = new THREE.PlaneBufferGeometry(this.size*100, this.size*100, 1, 1);
    var mat = new THREE.MeshBasicMaterial({wireframe: true, /*opacity:0, transparent: true,*/ color: 0x203020,});

    this.plane = new THREE.Mesh( basePlane, mat );
    this.plane.rotateX(Math.PI / 2);
    this.plane.updateMatrix();
    this.root.add( this.plane );

    var axes = new THREE.AxesHelper( 10 );
    this.root.add( axes );

    //Add light for meshes
    const light = new THREE.HemisphereLight( 0x443333, 0xffffff, 1 )
    this.root.add(light);

    this.tile = this.centerTile()
    this.offsets = this.getOffsets()

    this.layers = this.props.layers;
    this.layers.forEach( layer => {
      if (!!layer.getGroup) {
        const group = layer.getGroup();
        this.groups.push(group);
        this.geo.add(group);
      }
    })
    this.camera.position.y = this.props.camZoom || 25;
    this.camera.updateMatrix();
    this.root.updateMatrixWorld();
    this.setState({ layersShowing: this.layers.filter(l => l.options.visible).map(l => l.name) });

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('mouseup', this.onUp.bind(this), false)
    window.addEventListener('mousedown', this.onDown.bind(this), false)
    window.addEventListener('mousemove', this.onMove.bind(this), false)
    this.controls.update();
    this.renderScene()
    this.updateTiles()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.mounted && this.state.layersShowing !== prevState.layersShowing) {
      this.updateTiles()
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.controls) this.controls.removeEventListener('change', this.renderScene)
    window.removeEventListener('resize', this.onWindowResize.bind(this))
    window.removeEventListener('mouseup', this.onUp.bind(this))
    window.removeEventListener('mousedown', this.onDown.bind(this))
    window.removeEventListener('mousemove', this.onMove.bind(this))
    if (this.mount && this.renderer) this.mount.removeChild(this.renderer.domElement)
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
    if (this.mounted) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  // convert center lat/lon to web mercator tile coords
  centerTile() {
    const tile = pointToTile(this.props.center[0], this.props.center[1], this.tile_zoom)
    return {x: tile[0], y: tile[1], z: tile[2]}
  }

  getCenter(){
    var pt = this.controls.target;
    return this.unproject(pt);
  }

  getZoom() {
    const pt = this.controls.target.distanceTo(this.controls.object.position);
    return Math.round(Math.min(Math.max(getBaseLog(0.5, pt/this.size) + 4, 0), 18));
  }

  getOffsets() {
    var px = llPixel(this.props.center, 0, this.size);
    px = {x: px[0] - this.size/ 2, y: px[1] - this.size / 2, z: this.zOffset} //z: 0.425};
    return px
  }

  unproject(pt) {
    const y = -pt.y + (pt.y * 0.15) // scales y to slow down the y dir center tile math
    var lngLat = this.mercator.ll([pt.x + this.size / 2, y + this.size / 2 ], 0);
    lngLat[0] += this.props.center[0]
    lngLat[1] += this.props.center[1]
    return lngLat.map(function(num){return num.toFixed(5)/1})
  }

  projectToScene(pt) {
    if (this.mounted) {
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
  }

  project(lngLat) {
    return proj4('EPSG:4326', this.props.proj).forward(lngLat);
  }

  onMove(e) {
    if (this.flag) {}
  }

  onDown(e) {
    // turn on mouse move handler
    this.flag = 1;
  }

  onUp(e) {
    if (this.mounted) {
      //compute the center tile... from controls.target
      const newCenter = this.getCenter()
      this.setState({ center: newCenter });
      const t = pointToTile(newCenter[0], newCenter[1], this.tile_zoom) // thinking that merc or mercator should do this...
      const newTile = new THREE.Vector3(t[0], t[1], t[2])

      if (newTile.x !== this.tile.x || newTile.y !== this.tile.y) {
        this.tile = newTile
        this.updateTiles()
      }
    }
  }

  updateTiles(e) {
    if (this.mounted) {
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
  }

  updateLayers(tiles) {
    if (this.mounted) {
      this.layers.forEach(l => {
        if (this.state.layersShowing && this.state.layersShowing.indexOf(l.name) > -1) {
          l.update({
            tiles,
            scene: this.scene,
            offsets: this.offsets,
            project: this.project.bind(this),
            render: () => this.renderScene()
          });
        }
      });
    }
  }

  changeZoom = direction => {
    if (this.mounted) {
      // granularity: 0.5 is scope.zoomSpeed in mapControls increasing this
      // number increases the amt of zoom change per click
      const granularity = 5.0;
      const scale = Math.pow(0.95, granularity);
      direction === 'in'
        ? this.controls.dollyOut(scale)
        : this.controls.dollyIn(scale);
      this.controls.update();
    }
  }

  toggleLayerVisibility = group => {
    if (this.mounted) {
      let showing = [...this.state.layersShowing];
      const index = showing.indexOf(group.name);
      if (index < 0) {
        showing.push(group.name);
        this.geo.add(group);
      } else {
        showing.splice(index, 1);
        this.geo.remove(group);
      }
      this.setState({ layersShowing: showing });
      this.renderScene();
    }
  };

  render() {
    const { showSidebar } = this.props
    return(
      <div style={{ display: 'inline-flex' }}>
        <Sidebar
          expanded={showSidebar}
          groups={this.groups}
          showing={this.state.layersShowing}
          toggle={this.toggleLayerVisibility}
        />
        <ZoomControl changeZoom={this.changeZoom} />
        <PositionDisplay center={this.state.center} />
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}

export default ThreeMap
