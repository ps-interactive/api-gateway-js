const aws = require('./lib/aws.js');

const apiName = '';

const lambdaARN = '';
const iamApiGatewayServiceRoleARN = '';

async function createAndDeploy() {
  if (
    !lambdaARN ||
    lambdaARN.length === 0 ||
    !iamApiGatewayServiceRoleARN ||
    iamApiGatewayServiceRoleARN.length === 0
  ) {
    console.log('missing data');
    return false;
  }

  const apiData = await aws.createRestApi(apiName);
  const restApiId = apiData.id;

  const rootResources = await aws.getRootResources(restApiId);
  const rootPathId = rootResources.items[0].id;

  const usersResource = await aws.createResource(
    restApiId,
    rootPathId,
    'users'
  );
  const resourceId = usersResource.id;

  await aws.createResourceGETMethod(restApiId, resourceId);

  await aws.create200MethodResponse(restApiId, resourceId);

  await aws.createMethodIntegration(
    restApiId,
    resourceId,
    lambdaARN,
    iamApiGatewayServiceRoleARN
  );

  await aws.createMethodIntegrationResponse(restApiId, resourceId);

  aws.createDeployment(restApiId).then((data) => {
    console.log('Finished creating and deploying API Gateway');
    console.log({ restApiId, resourceId });
  });
}

createAndDeploy();
