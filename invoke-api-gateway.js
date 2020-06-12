const { invokeMethod } = require('./lib/aws.js');

const restApiId = '';
const resourceId = '';

invokeAPI(restApiId, resourceId);

async function invokeAPI(restApiId, resourceId) {
  const { body } = await invokeMethod(restApiId, resourceId);
  console.log({ body });
}
