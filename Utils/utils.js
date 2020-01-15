// Required modules
var Docker = require('dockerode');

var docker = new Docker({
    host: '10.22.30.55',
    port: 2375,
    version: "v1.40",
});

/**
 * @param filter
 * Function who return a container by filter and take filter in parameter
 */
const containerByFilter = async (filter) => {
    try {
        // Get all container with all : true
        var getContainerByFilter = await docker.listContainers({ all: true, filters: filter });
        // Logs of getContainerByFilter
        console.log('getContainerByFilter : ', getContainerByFilter);
        // Return result of get all containers
        return getContainerByFilter;
    } catch (e) {
        // Logs of error
        console.log('error : ', e);
        // Send error message
        return e;
    }
};

module.exports = {
    containerByFilter: containerByFilter
};