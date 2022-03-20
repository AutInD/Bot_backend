const { promisify } = require('util');
let graph = require('fbgraph'); // facebook graph library

const fbGraph = {
  get: promisify(graph.get)
}

graph.setAccessToken(578496233337521);  // <--- your facebook page token
graph.setVersion("13.0");

// gets profile from facebook
// user must have initiated contact for sender id to be available
// returns: facebook profile object, if any
async function getFacebookProfile(agent) {
  let ctx = agent.context.get('generic');
  let fbSenderID = ctx ? ctx.parameters.facebook_sender_id : undefined;
  let payload;

  console.log('FACEBOOK SENDER ID: ' + fbSenderID);

  if ( fbSenderID ) {
    try { payload = await fbGraph.get(fbSenderID) }
    catch (err) { console.warn( err ) }
  }

  return payload;
}