module.exports = function(context, req) {
  let last = context.bindings.inputBPM.length - 1;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: context.bindings.inputBPM[last]
  };

  context.done();
};
