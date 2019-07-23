//const worker = () => {
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
    const rows = raw.split('\n')
    const data = []
    const colors = []
    rows.forEach((row, idx) => {
      if (idx > 0) {
        const rData = row.split(",").map(v => parseFloat(v))
        if (rData.length > 1) {
          data.push(rData[1])
          data.push(rData[2])
          data.push(rData[0])
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

//};

//export default worker;
