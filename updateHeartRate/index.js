var LIFX = require('lifx-http-api');

let client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

module.exports = function(context, req) {
  if (req.query.bpm) {
    let hue = 160 - req.query.bpm;

    // send a message to SignalR Service
    context.bindings.heartMessage = [
      {
        target: 'heartMessage',
        arguments: [{ bpm: req.query.bpm, timestamp: new Date() }]
      }
    ];

    context.bindings.inputBPM = {
      PartitionKey: 'BPM',
      RowKey: new Date().getTime(),
      bpm: req.query.bpm,
      timestamp: new Date()
    };

    client
      .setState('all', { color: `hue:${hue}` })
      .then(results => {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: results
        };

        context.done();
      })
      .catch(err => {
        handleError(context, err.message);
      });
  } else {
    handleError(context, 'Please pass bpm parameter');
    context.done();
  }
};

function handleError(context, message) {
  context.res = {
    status: 400,
    body: message
  };
}
