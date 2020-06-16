const AWS = require('aws-sdk');
AWS.config.update({ region: '' });

const apiG = new AWS.APIGateway();

function createRestApi(name) {
  const params = {
    name,
  };
  return apiG.createRestApi(params).promise();
}

function getRootResources(restApiId) {
  const params = {
    restApiId,
  };
  return apiG.getResources(params).promise();
}

function createResource(restApiId, parentId, pathPart) {
  const params = {
    restApiId,
    parentId: parentId,
    pathPart,
  };

  return apiG.createResource(params).promise();
}

function createResourceGETMethod(restApiId, resourceId) {
  const params = {
    restApiId,
    resourceId,
    authorizationType: 'NONE',
    httpMethod: 'GET',
  };

  return apiG.putMethod(params).promise();
}

function create200MethodResponse(restApiId, resourceId) {
  const params = {
    restApiId,
    resourceId,
    httpMethod: 'GET',
    statusCode: '200',
  };

  return apiG.putMethodResponse(params).promise();
}

function createMethodIntegration(
  restApiId,
  resourceId,
  lambdaARN,
  iamApiGatewayServiceRole
) {
  const params = {
    restApiId,
    resourceId,
    httpMethod: 'GET',
    integrationHttpMethod: 'POST',
    type: 'AWS',
    uri: `arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/${lambdaARN}/invocations`,
    credentials: iamApiGatewayServiceRole,
  };

  return apiG.putIntegration(params).promise();
}

function createMethodIntegrationResponse(restApiId, resourceId) {
  const params = {
    restApiId,
    resourceId,
    httpMethod: 'GET',
    statusCode: '200',
  };

  return apiG.putIntegrationResponse(params).promise();
}

function createDeployment(restApiId) {
  return apiG
    .createDeployment({
      restApiId,
      description: 'API for list-users Lambda',
      stageName: 'prod',
    })
    .promise();
}

function invokeMethod(restApiId, resourceId) {
  return apiG
    .testInvokeMethod({ restApiId, resourceId, httpMethod: 'GET' })
    .promise();
}

module.exports = {
  createRestApi,
  getRootResources,
  createResource,
  createResourceGETMethod,
  create200MethodResponse,
  createMethodIntegration,
  createMethodIntegrationResponse,
  createDeployment,
  invokeMethod,
};
