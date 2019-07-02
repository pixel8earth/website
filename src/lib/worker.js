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
      self.fetchTile(e.data.url, e.data.offsets, e.data.key);
    } else {
      postMessage(e.data);
    }
  });

  self.fetchTile = function(url, offsets) {

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
                data.push(rData[0] - offsets[0]) // x
                data.push(rData[2] - 130) // z
                data.push(-1 * (rData[1] - offsets[1])) // y
              }
            }
          });
          postMessage({ job: 'fetchTileComplete', result: data, url: url });
        } else throw new Error('failed to fetch')
      });
    } catch (err) {
      postMessage({ error: err.message });
    }
  }
};

export default worker;
