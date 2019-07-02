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
      self.fetchTile(e.data.url, e.data.offsets, e.data.coords, e.data.size);
    } else {
      postMessage(e.data);
    }
  });

  // converts lonlat to mercator x/y
  self.llPixel = (ll, zoom, _size) => {
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

  self.fetchTile = function(url, offsets, coords, size) {
    try {
      fetch(url).then(async res => {
        if (res.ok) {
          const arrayBuff = await res.arrayBuffer();
          const raw = await self.pako.inflate(arrayBuff, { to: 'string' });
          const rows = raw.split('\n');
          const data = [];
          rows.forEach((row, idx) => {
            if (idx > 0) {
              const rData = row.split(",").map(v => parseFloat(v))
              if (rData.length > 1) {
                // taken from sphericalmercator.js - including here cuz the imports are funky
                const ll =  [
                  (rData[0] * (180 / Math.PI) / 6378137.0), 
                  ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-rData[1] / 6378137.0))) * (180 / Math.PI)
                ]
                let px = self.llPixel(ll, 0, size)
                px = {x: px[0] - size / 2, y: 0, z: px[1] - size / 2}
                data.push(px.x - offsets.x)
                data.push((rData[2] * 0.5 / 686) - 0.1) // umm ok... some z level scaling gonna need to be figured out
                data.push(px.z - offsets.z)
              }
            }
          });
          postMessage({ job: 'fetchTileComplete', result: data, url: url, coords: coords });
        } else throw new Error('failed to fetch')
      });
    } catch (err) {
      postMessage({ error: err.message });
    }
  }
};

export default worker;
