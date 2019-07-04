export default class WebWorker {
  constructor(worker) {
    //const code = worker.toString();
    //const blob = new Blob(["(" + code + ")()"]);
    return new Worker('worker.js') //URL.createObjectURL(blob));
  }
}
