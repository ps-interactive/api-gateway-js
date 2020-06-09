// Imports
const AWS = require('aws-sdk');
const util = require('util');
AWS.config.update({ region: 'us-west-2' });

const apiG = new AWS.APIGateway();

const apiName = 'ps-labs-users';

async function run() {
  //# Step 1
  //const apiData = await createRestApi(apiName);
  //const restApiId = apiData.id;

  const restApiId = 'j7eihjj2ld';

  //# Step 2

  const rootResources = await getRootResources(restApiId);
  const rootPathId = rootResources.items[0].id;

  //# Step 3
  // args: root path id, resource path, api id
  //const usersResource = await createResource(rootPathId, 'users', restApiId);
  //const resourceId = usersResource.id;

  const resourceId = 'jcv5am';
  // Step #4
  //const resourceMethod = await createResourceGETMethod(resourceId, restApiId);
  //console.log(util.inspect({ resourceMethod }, { depth: null }));

  // Step #5
  // const resourceMethodResponse = await create200MethodResponse(
  //   resourceId,
  //   restApiId
  // );
  // console.log(util.inspect({ resourceMethodResponse }, { depth: null }));

  // Step #6
  // Before this step, must create Service Role for API Gateway
  // and take note of Lambda ARN
  // const resourceMethodIntegration = await createMethodIntegration(
  //   resourceId,
  //   restApiId
  // );
  // console.log(util.inspect({ resourceMethodIntegration }, { depth: null }));

  // Step #7
  // const methodIntegrationResponse = await createMethodIntegrationResponse(
  //   resourceId,
  //   restApiId
  // );
  // console.log(util.inspect({ methodIntegrationResponse }, { depth: null }));

  //createDeployment(restApiId).then((data) => console.log({ data }));

  const { body } = await invokeMethod(resourceId, restApiId);
  console.log({ body });
}

run();

function createRestApi(name) {
  return apiG.createRestApi({ name }).promise();
}

function getRootResources(apiId) {
  const params = {
    restApiId: apiId,
  };
  return apiG.getResources(params).promise();
}

function createResource(parentResourceId, resourcePath, apiId) {
  const params = {
    parentId: parentResourceId,
    pathPart: resourcePath,
    restApiId: apiId,
  };

  return apiG.createResource(params).promise();
}

function createResourceGETMethod(resourceId, apiId) {
  const params = {
    authorizationType: 'NONE',
    httpMethod: 'GET',
    resourceId: resourceId,
    restApiId: apiId,
  };

  return apiG.putMethod(params).promise();
}

function create200MethodResponse(resourceId, apiId) {
  const params = {
    restApiId: apiId,
    resourceId: resourceId,
    httpMethod: 'GET',
    statusCode: '200',
  };

  return apiG.putMethodResponse(params).promise();
}

function createMethodIntegration(resourceId, apiId) {
  const params = {
    httpMethod: 'GET',
    resourceId: resourceId,
    restApiId: apiId,
    integrationHttpMethod: 'POST',
    type: 'AWS',
    uri:
      'arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:647915875147:function:helloWorld/invocations',
    credentials: 'arn:aws:iam::647915875147:role/apigAwsProxyRole',
  };

  return apiG.putIntegration(params).promise();
}

function createMethodIntegrationResponse(resourceId, restApiId) {
  const params = {
    httpMethod: 'GET',
    resourceId,
    restApiId,
    statusCode: '200',
  };

  return apiG.putIntegrationResponse(params).promise();
}

function createDeployment(restApiId) {
  return apiG
    .createDeployment({
      restApiId,
      description: 'Testing API w Lambda',
      stageName: 'prod',
    })
    .promise();
}

function invokeMethod(resourceId, restApiId) {
  return apiG
    .testInvokeMethod({
      httpMethod: 'GET',
      resourceId,
      restApiId,
    })
    .promise();
}
