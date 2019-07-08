import * as THREE from 'three'
import Base from './base'

class PlyTiles extends Base {

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data
    if (job === 'fetchTileComplete' && !error) {
      const geometry = new THREE.BufferGeometry()
      if ( result.indices.length > 0 ) {
        geometry.setIndex( result.indices )
      }
      geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( result.vertices, 3 ) )
      geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( result.normals, 3 ) )
      //const url = `https://pixel8austin.storage.googleapis.com/imagery/${tile[2]}/${tile[0]}/${tile[1]}.jpg`
      //const material = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(url)});
      const material = new THREE.MeshPhongMaterial({color: 0x666666, wireframe: true})
      material.side = THREE.DoubleSide // Fixes lighting issues on meshes 
      const mesh = new THREE.Mesh(geometry, material)
      mesh.doubleSided = true;

      const fetchIndex = this.fetchingUrls.indexOf(url)
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1)

      this.cachedTiles[coords] = mesh
      this.addTile(coords, mesh)
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  addTile(coords, mesh) {
    if (mesh) {
      const tileName = `${coords}-${mesh.uuid}`
      mesh.name = tileName
      this.loadedTiles.push(tileName)
      this.group.add(mesh)
      this.renderScene()
    }  
  }

  fetchHandler = (raw, offsets, size, coords) => {
    function parseASCIINumber( n, type ) {
      switch ( type ) {
        case 'char': case 'uchar': case 'short': case 'ushort': case 'int': case 'uint':
        case 'int8': case 'uint8': case 'int16': case 'uint16': case 'int32': case 'uint32':
          return parseInt( n )
        case 'float': case 'double': case 'float32': case 'float64':
          return parseFloat( n )
        default:
          return parseFloat( n )
      }
    }

    function parseASCIIElement( properties, line ) {
      var values = line.split( /\s+/ );
      var element = {};
      for ( var i = 0; i < properties.length; i ++ ) {
        if ( properties[ i ].type === 'list' ) {
          var list = [];
          var n = parseASCIINumber( values.shift(), properties[ i ].countType );
          for ( var j = 0; j < n; j ++ ) {
            list.push( parseASCIINumber( values.shift(), properties[ i ].itemType ) );
          }
          element[ properties[ i ].name ] = list;
        } else {
          element[ properties[ i ].name ] = parseASCIINumber( values.shift(), properties[ i ].type );
        }
      }
      return element;
    }

    function handleElement( buffer, elementName, element, i ) {
      if ( elementName === 'vertex' ) {

        // converts mercator x/y to latlng
        const ll =  [
          (element.x * (180 / Math.PI) / 6378137.0),
          ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-element.y / 6378137.0))) * (180 / Math.PI)
        ]

        // convert ll to world coords (pixel xy)
        let px = llPixel(ll, 0, size)
        px = {x: px[0] - size / 2, y: px[1] - size / 2, z: 0}

        buffer.vertices.push( px.x - offsets.x, -1 * px.y + offsets.y, (element.z / 343) - offsets.z);

        if ( 'normalx' in element && 'normaly' in element && 'normalz' in element ) {
          buffer.normals.push( element.normalx, element.normaly, element.normalz );
        }

        if ( 's' in element && 't' in element ) {
          buffer.uvs.push( element.s, element.t );
        }

        if ( 'red' in element && 'green' in element && 'blue' in element ) {
          buffer.colors.push( element.red / 255.0, element.green / 255.0, element.blue / 255.0 );
        }

      } else if ( elementName === 'face' ) {
        var vertex_indices = element.vertex_indices || element.vertex_index; // issue #9338
        if ( vertex_indices.length === 3 ) {
          buffer.indices.push( vertex_indices[ 0 ], vertex_indices[ 2 ], vertex_indices[ 1 ] );
        } else if ( vertex_indices.length === 4 ) {
          buffer.indices.push( vertex_indices[ 0 ], vertex_indices[ 1 ], vertex_indices[ 3 ] );
          buffer.indices.push( vertex_indices[ 1 ], vertex_indices[ 2 ], vertex_indices[ 3 ] );
        }
      }
    }

    // taken from plyloader.js as this needs to be pure, no imports etc 
    function parseHeader( data ) {
      var patternHeader = /ply([\s\S]*)end_header\s/;
      var headerText = '';
      var headerLength = 0;
      var result = patternHeader.exec( data );
      if ( result !== null ) {
        headerText = result[ 1 ];
        headerLength = result[ 0 ].length;
      }
      var header = {comments: [], elements: [], headerLength: headerLength };
      var lines = headerText.split( '\n' );
      var currentElement;
      var lineType, lineValues;

      function make_ply_element_property( propertValues ) {
        var property = { type: propertValues[ 0 ] };
        if ( property.type === 'list' ) {
          property.name = propertValues[ 3 ];
          property.countType = propertValues[ 1 ];
          property.itemType = propertValues[ 2 ];
        } else {
          property.name = propertValues[ 1 ];
        }
        return property;
      }

      for ( var i = 0; i < lines.length; i ++ ) {
        var line = lines[ i ];
        line = line.trim();
        if ( line === '' ) continue;
        lineValues = line.split( /\s+/ );
        lineType = lineValues.shift();
        line = lineValues.join( ' ' );
        switch ( lineType ) {
          case 'format':
            header.format = lineValues[ 0 ];
            header.version = lineValues[ 1 ];
            break;
          case 'comment':
            header.comments.push( line );
            break;
          case 'element':
          if ( currentElement !== undefined ) {
              header.elements.push( currentElement );
            }
            currentElement = {};
            currentElement.name = lineValues[ 0 ];
            currentElement.count = parseInt( lineValues[ 1 ] );
            currentElement.properties = [];
            break;
          case 'property':
            currentElement.properties.push( make_ply_element_property(lineValues) );
            break;
          default:
            console.log( 'unhandled', lineType, lineValues );
        }
      }
      if ( currentElement !== undefined ) {
        header.elements.push( currentElement );
      }
      return header;
    }

    const llPixel = (ll, zoom, _size) => {
      var size = _size * Math.pow(2, zoom);
      var d = size / 2;
      var bc = (size / 360);
      var cc = (size / (2 * Math.PI));
      var ac = size;
      var f = Math.min(Math.max(Math.sin((Math.PI / 180) * ll[1]), -0.9999), 0.9999);
      var x = d + ll[0] * bc;
      var y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      (x > ac) && (x = ac);
      (y > ac) && (y = ac);
      return [x, y];
    }

    const header = parseHeader(raw);
    
    var buffer = {
      indices: [],
      vertices: [],
      normals: [],
      uvs: [],
      colors: []
    };

    var result;
    var patternBody = /end_header\s([\s\S]*)$/;
    var body = '';
    if ( ( result = patternBody.exec( raw ) ) !== null ) {
      body = result[ 1 ];
    }

    var lines = body.split( '\n' );
    var currentElement = 0;
    var currentElementCount = 0;

    for ( var i = 0; i < lines.length; i ++ ) {
      var line = lines[ i ];
      line = line.trim();
      if ( line === '' ) {
        continue
      }
      if ( currentElementCount >= header.elements[ currentElement ].count ) {
        currentElement ++;
        currentElementCount = 0;
      }
      var element = parseASCIIElement( header.elements[ currentElement ].properties, line );
      handleElement( buffer, header.elements[ currentElement ].name, element );
      currentElementCount ++;
    }
    return buffer
  }
}

export default PlyTiles
