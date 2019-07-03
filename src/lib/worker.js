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

  self.getFunc = function (funcStr) {
    // from: https://blog.scottlogic.com/2011/02/24/web-workers-part-3-creating-a-generic-worker.html
    var argName = funcStr.substring(funcStr.indexOf("(") + 1, funcStr.indexOf(")"));
    funcStr = funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
    return new Function(argName, funcStr);
  };

  self.fetchTile = function({name, url, offsets, coords, size, handler}) {
    const handlerFn = self.getFunc(handler)
    try {
      fetch(url).then(async res => {
        if (res.ok) {
          const arrayBuff = await res.arrayBuffer();
          const raw = await self.pako.inflate(arrayBuff, { to: 'string' });
          const data = handlerFn(raw, offsets, size)
          postMessage({ job: 'fetchTileComplete', result: data, url: url, coords: coords, name });
        } else throw new Error('failed to fetch')
      });
    } catch (err) {
      postMessage({ error: err.message });
    }
  }
};

export default worker;
