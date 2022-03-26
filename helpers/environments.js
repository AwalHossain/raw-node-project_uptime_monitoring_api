// module scaffolding

// / module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    maxChecks: 10,
    twilio:{
        fromPhone:'+17655655247',
        accounSid:'ACf62a4949723e51211a182f2fe3af6561',
        authToken: 'a2f572f9110db42045b745d3d1ae002a',
    }
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    maxChecks: 10,
    twilio: {
        fromPhone: '+17655655247',
        accountSid: 'ACf62a4949723e51211a182f2fe3af6561',
        authToken: 'a2f572f9110db42045b745d3d1ae002a',
    },
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
// export moudle 

module.exports = environmentToExport;