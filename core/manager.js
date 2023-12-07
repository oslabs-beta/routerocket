'use strict'

const runner =require('./runner');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData} = require('node:worker_threads');

const printResults = require('./printResults');
const calculate = require('./calculate');

async function manager(opts, resultCb){
  if(opts.numOfWorkers === 1){
    return resultCb(runner(opts).latencyStats);
  }
  else{
    const workerPromises = []

    for(let i = 0; i < opts.numOfWorkers; i++){
      workerPromises.push(new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, './worker.js'), {workerData: opts});
        worker.on('message', msg => {
          resolve(msg.latencyStats);
        })
      })) 
    }
    const result = await Promise.all(workerPromises)

    printResults(calculate(metrics, config));

    return resultCb(result);
  }
}

module.exports = manager