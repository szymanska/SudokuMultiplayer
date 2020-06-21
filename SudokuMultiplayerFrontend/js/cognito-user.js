let poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
};

let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function getCognitoUsername() {
    cognitoUser = userPool.getCurrentUser()
    return cognitoUser.username
}