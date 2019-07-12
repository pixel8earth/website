const worker = () => {
  /* eslint-disable no-restricted-globals */
  self.importScripts('https://cdn.jsdelivr.net/pako/1.0.3/pako.min.js');
  self.addEventListener("message", e => {
    // NOTES:
    // older browsers only support passing in a string to postMessage.
    //
    // There are two ways to stop a worker: by calling worker.terminate() from
    // the main page or by calling self.close() inside of the worker itself.

    if (!e) return;

    else if (e.data.job === 'fetchTile') {
      self.fetchTile(e.data);
    } else {
      postMessage(e.data);
    }
  });

  self.fetchHandler = function (raw, offsets, size, coords, options) {
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

    const rows = raw.split('\n')
    const data = []
    const colors = []
    rows.forEach((row, idx) => {
      if (idx > 0) {
        const rData = row.split(",").map(v => parseFloat(v))
        if (rData.length > 1) {
          // taken from sphericalmercator.js - including here cuz the imports are funky
          const ll =  [
            (rData[0] * (180 / Math.PI) / 6378137.0),
            ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-rData[1] / 6378137.0))) * (180 / Math.PI)
          ]
          let px = llPixel(ll, 0, size)
          px = {x: px[0] - size / 2, y: px[1] - size / 2, z: rData[2]}
          data.push(px.x - offsets.x)
          data.push(-px.y + offsets.y)

          const yMin = options.scales[0] || 0;
          const yMax = options.scales[1] || 100;
          const scaledZ = ((px.z - yMin) / (yMax - yMin)) * (options.scales[2] || 0.5) + yMin;
          data.push(scaledZ)

          if (options.style && options.style.colorMap && options.style.colorMap[rData[3]]) {
            colors.push(...options.style.colorMap[rData[3]])
          } else {
            colors.push(0.0, 0.0, 0.0)
          }
        }
      }
    });
    return [data,colors]
  }

  self.fetchTile = function({name, url, offsets, coords, size, handler, options}) {
    try {
      fetch(url).then(async res => {
        if (res.ok) {
          const parts = url.split('.')
          const ext = parts[parts.length - 1]
          let raw = null
          if (ext === 'gz') {
              const arrayBuff = await res.arrayBuffer()
              raw = await self.pako.inflate(arrayBuff, { to: 'string' })
          } else {
              raw = await res.clone().text()
          }
          const data = this.fetchHandler(raw, offsets, size, coords, options)
          postMessage({ job: 'fetchTileComplete', result: data, url: url, coords: coords, name })
        } else throw new Error('failed to fetch')
      });
    } catch (err) {
      postMessage({ error: err.message })
    }
  }

};

export default worker;
