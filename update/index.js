var axios = require('axios');
var LIFX = require('lifx-http-api');

let client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

module.exports = function (context, req) {
  if (req.query.bpm && req.query.timeStamp) {

    let hue = 160 - req.query.bpm;

    client.setState('all', { color: `hue:${hue}` })
      .then(result => {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: result
        };

        context.done();
      })
      .catch(err => {
        handleError(context, err.message);
      })
  }
  else {
    handleError(context, "Please pass bpm and timeStamp parameters");
    context.done();
  }
};

function handleError(context, message) {
  context.res = {
    status: 400,
    body: message
  };
}