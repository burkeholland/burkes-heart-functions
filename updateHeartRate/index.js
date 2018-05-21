var LIFX = require('lifx-http-api');

let client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

module.exports = function(context, req) {
  if (req.query.bpm) {
    // bpm needs to be an integer or the hue
    // calculations won't work correctly
    let bpm = parseInt(req.query.bpm);

    // push the current bpm to the SignalR hub
    pushMessage(context, 'heartMessage', bpm);

    // store the current bpm in Azure Table Storage
    storeBpm(context, bpm);

    // calculate the hue based on bpm
    let hue = getHue(bpm);

    // update the bulb color
    updateLight(hue)
      .then(results => {
        send(context, results, 200);
      })
      .catch(err => {
        send(context, err.message, 400);
      });
  } else {
    send(context, 'Please pass bpm parameter', 400);
  }
};

function pushMessage(context, target, bpm) {
  context.bindings.heartMessage = [
    {
      target: target,
      arguments: [{ bpm: bpm, timestamp: new Date() }]
    }
  ];
}

function storeBpm(context, bpm) {
  context.bindings.inputBPM = {
    PartitionKey: 'BPM',
    RowKey: new Date().getTime(),
    bpm: bpm,
    timestamp: new Date()
  };
}

function getHue(bpm) {
  let min = process.env.BPM_MIN;
  let max = process.env.BPM_MAX;
  let range = max - min;
  let factor = 120 / range;

  if (bpm < min) {
    return 120;
  }

  if (bpm > max) {
    return 0;
  }

  let hue = 120 - (bpm - min) * factor;

  return hue;
}

function updateLight(hue) {
  return client
    .setState('all', { color: `hue:${hue}` })
    .then(results => results);
}

function send(context, message, status) {
  context.res = {
    status: status,
    body: message
  };

  context.done();
}
