module.exports = function(context, req, connectionInfo) {
  let last = context.bindings.inputBPM.length - 1;

  context.res = {
    body: {
      heartData: context.bindings.inputBPM[last],
      connectionInfo: connectionInfo
    }
  };
  context.done();
};
