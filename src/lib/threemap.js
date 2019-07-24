import React, { Component } from 'react'
import * as THREE from 'three'
import MapControls from './MapControls'
import { getBaseLog, pointToTile } from './utils';
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

    this.root.add(this.geo);
    this.root.updateMatrixWorld();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1/99, 100000000000000)
    //this.camera.up = new THREE.Vector3(0,0,1)
    this.root.add(this.camera);
    // The standard for WebVR is as follows:
    // positive X is to the user's right
    // positive Y is up
    // positive Z is behind the user
    this.camera.lookAt(this.scene.position)
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.renderer.sortObjects = false
    this.mount.appendChild(this.renderer.domElement)

    this.controls = new MapControls(this.camera, this.renderer.domElement)
    //this.controls.minZoom = this.zOffset
    this.controls.target.y = this.zOffset
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.addEventListener('change', this.renderScene)
    const center = this.getCenter();
    this.setState({ center });

    this.raycaster = new THREE.Raycaster();

    var axes = new THREE.AxesHelper( 10 );
    this.root.add( axes );

    //Add light for meshes
    const light = new THREE.HemisphereLight( 0x443333, 0xffffff, 1 )
    this.root.add(light);

    if (this.props.showGrid) {
      var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5*5, 5*5, 100, 100),
        new THREE.MeshBasicMaterial({color: 0x203020, wireframe: true})
      );
      plane.rotateX(Math.PI / 2);
      plane.position.y = 0
      this.root.add(plane);
    }

    this.tile = this.centerTile()
    this.offsets = new THREE.Vector3(xyOffset[0], xyOffset[1], this.zOffset)

    this.layers = this.props.layers;
    this.layers.forEach( layer => {
      if (!!layer.getGroup) {
        const group = layer.getGroup();
        this.groups.push(group);
        this.geo.add(group);
      }
    })
    this.camera.position.y = this.props.camZoom || 25;
    this.camera.position.x = -25;
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

  getCenter() {
    // IMPORTANT to clone target here, as we do not want to disrupt any scene/group matrices
    var pt = this.controls.target.clone();
    // need to negate x/z to center moves in the correct direction
    pt.x = -pt.x
    pt.z = -pt.z
    const utmPoint = this.geo.localToWorld(pt);
    return this.unproject(utmPoint);
  }

  getZoom() {
    const pt = this.controls.target.distanceTo(this.controls.object.position);
    return Math.round(Math.min(Math.max(getBaseLog(0.5, pt/this.size) + 4, 0), this.tile_zoom));
  }


  unproject(pt) {
    return proj4('EPSG:4326', this.props.proj).inverse([-pt.z, -pt.x]);
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
      const buf = 1
      const minx = this.tile.x - (buf) // extra tile in x dir
      const maxx = this.tile.x + (buf) // extra tile in x dir
      const miny = this.tile.y - buf
      const maxy = this.tile.y + buf

      const newTiles = []
      for ( let x = minx; x < maxx+1; x++ ) {
        for ( let y = miny; y < maxy+1; y++ ) {
          newTiles.push(new THREE.Vector3(x, y, this.tile_zoom))
        }
      }
      this.updateLayers(newTiles)
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
            unproject: this.unproject.bind(this),
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
