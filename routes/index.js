// Required modules
var router = require('express').Router();
var Docker = require('dockerode');
var stringify = require('json-stringify-safe');
var compose = require('docker-compose');
var path = require('path');

// Required files
var utils = require('../Utils/utils.js');

var docker = new Docker({
    host: process.env.ADDRESS_IP,
    port: process.env.DOCKER_PORT || 2375,
    version: 'v1.40'
});


/**
 * @param req, @param res
 * Get all running container 
 */
router.get('/getAllRunningContainer', async function (req, res) {
    try {
        // Get all container
        var getAllRunningContainer = await docker.listContainers();
        // Check if getAllRunningContainer return true
        if(getAllRunningContainer){
            // Return result of get all containers
            return res.send(getAllRunningContainer).status(200);
        }
    } catch (e) {
        // Logs of errors
        console.log('error : ', e);
        // Return error message
        return res.send(e).status(500);
    }
});


/**
 * @param req, @param res
 * Get all container 
 */
router.get('/getAllContainer', async function (req, res) {
    try {
        // Get all container with all : true
        var getAllContainer = await docker.listContainers({ all: true });
        // Check if getAllContainer return true
        if(getAllContainer){
            // Return result of get all containers
            return res.send(getAllContainer).status(200);
        }
    } catch (e) {
        // Logs of error
        console.log('error : ', e);
        // Send error message
        return res.send(e).status(500);
    }
});

/**
 * @param filter, @param req, @param res
 * Get containers by filters
 * Example : yourhost.com/api/getContainerByFilter/{"status": ["exited"]}
 */
router.get('/getContainerByFilter/:filter', async function (req, res) {
    try {
        // Get container by filtre 
        var getContainerByFilter = await utils.containerByFilter(req.params.filter);
        // Check if getContainerByFilter return true
        if(getContainerByFilter){
            // Return this container
            return res.send(getContainerByFilter);
        }
    } catch (e) {
        // Logs of error
        console.log('error : ', e);
        // Return error message
        return res.send(e).status(500);
    }
});


/**
 * @param req, @param res
 * Get all services 
 */
router.get('/getAllServices', async function (req, res) {
    try {
        // Get all services
        var getAllServices = await docker.listServices();
        // Check if getAllServices return true
        if(getAllServices){
            // Return result of get all services
            return res.send(getAllServices).status(200);
        }
    } catch (e) {
        // Logs of errors
        console.log('error : ', e);
        // Return error message
        return res.send('error !').status(500);
    }
});


/**
 * @param req, @param res
 * Retrieve info of docker host
 */
router.get('/info', async (req, res) => {
    try {
        // Get docker info
        var dockerInfo = await docker.info();
        // Send object of info
        return res.send(dockerInfo).status(200);
    } catch (e) {
        // Logs of error
        console.log('error :', e);
        // Send error
        return res.send(e).status(500);
    }
});


/**
 * @param containerId, @param req, @param res
 * Start a container with containerId
 */
router.post('/startContainer/:containerId', async (req, res) => {
    // Check if contairdId exists
    if (!req.params.containerId || req.params.containerId == "") {
        return res.send('Il manque le paramètre containerId à la requête !').status(400);
    }
    // Check if containerId's length equals to 5 min
    if (req.params.containerId.length < 5) {
        // Display error message
        return res.send('Veuillez renseigner au moins les 5 premières lettres de l\'id du container').status(401);
    }
    // Get container by id
    var container = docker.getContainer(req.params.containerId);
    // Start container
    container.start(function (err, start) {
        if (err) {
            // Console logs of error
            console.log('err : ', err);
            // Display error message
            return res.send(err).status(500);
        } else {
            // Send success message
            return res.send(`${req.params.containerId} à été démarré avec succès !`).status(200);
        }
    });
});


/**
 * @param containerId, @param req, @param res
 * Stop a container with containerId
 */
router.post('/stopContainer/:containerId', async (req, res) => {
    // Check if contairdId exists
    if (!req.params.containerId || req.params.containerId == "") {
        return res.send('Il manque le paramètre containerId à la requête !').status(400);
    }
    // Check if containerId's length equals to 5 min
    if (req.params.containerId.length < 5) {
        // Display error message
        return res.send('Veuillez renseigner au moins les 5 premières lettres de l\'id du container').status(401);
    }
    // Get container by id
    var container = docker.getContainer(req.params.containerId);
    // Start container
    container.stop(function (err, stop) {
        if (err) {
            // Console logs of error
            console.log('err : ', err);
            // Display error message
            return res.send(err).status(500);
        } else {
            // Send success message
            return res.send(`${req.params.containerId} à été stoppé avec succès !`).status(200);
        }
    });
});


/**
 * @param containerId, @param req, @param res
 * Remove a container with containerId
 */
router.post('/removeContainer/:containerId', async (req, res) => {
    // Check if contairdId exists
    if (!req.params.containerId || req.params.containerId == "") {
        return res.send('Il manque le paramètre containerId à la requête !').status(400);
    }
    // Check if containerId's length equals to 5 min
    if (req.params.containerId.length < 5) {
        // Display error message
        return res.send('Veuillez renseigner au moins les 5 premières lettres de l\'id du container').status(401);
    }
    // Get container by id
    var container = docker.getContainer(req.params.containerId);
    // Start container
    container.remove(function (err, stop) {
        if (err) {
            // Console logs of error
            console.log('err : ', err);
            // Display error message
            return res.send(err).status(500);
        } else {
            // Send success message
            return res.send(`${req.params.containerId} à été supprimé avec succès !`).status(200);
        }
    });
});

/**
 * @param containerId, @param req, @param res
 * Restart a container with containerId
 */
router.post('/restartContainer/:containerId', async (req, res) => {
    // Check if contairdId exists
    if (!req.params.containerId || req.params.containerId == "") {
        return res.send('Il manque le paramètre containerId à la requête !').status(400);
    }
    // Check if containerId's length equals to 5 min
    if (req.params.containerId.length < 5) {
        // Display error message
        return res.send('Veuillez renseigner au moins les 5 premières lettres de l\'id du container').status(401);
    }
    // Get container by id
    var container = docker.getContainer(req.params.containerId);
    // Start container
    container.restart(function (err, restart) {
        if (err) {
            // Console logs of error
            console.log('err : ', err);
            // Display error message
            return res.send(err).status(500);
        } else {
            // Send success message
            return res.send(`${req.params.containerId} à été redémarré avec succès !`).status(200);
        }
    });
});

/**
 * @param name
 * Get container by name and inspect this container
 */
router.get('/inspectContainerByName/:name', async function (req, res) {
    // Check if name exists
    if (!req.params.name || req.params.name == "") {
        return res.send('Il manque le paramètre name à la requête ! ').status(400);
    }
    if(req.params.name !== typeof String){
        return res.send('Le paramètre name doit être une chaine de charactère').status(401);
    }
    // Get container by Name
    var getContainerIdByName = await utils.containerByFilter(`{"name": ["${req.params.name}"]}`);
    // Get containerId by name
    var getContainerById = docker.getContainer(getContainerIdByName[0].Id);
    // Inspect this container
    getContainerById.inspect(function (err, inspect) {
        if (err) {
            console.log('error : ', err);
            return res.send(err).status(500);
        } else {
            return res.send(inspect).status(200);
        }
    });
});

/**
 * @param name
 * Get container id by name
 */
router.get('/getContainerIdByName/:name', async function (req, res) {
    if(!req.params.name || req.params.name == ""){
        return res.send('Il manque le paramètre name à la requête ! ').status(400);
    }
    if(req.params.name !== typeof String){
        return res.send('Le paramètre name doit être une chaine de charactère').status(401);
    }
    try {
        // Get container id by name
        var getContainerIdByName = await utils.containerByFilter(`{"name": ["${req.params.name}"]}`);
        // Logs of this object
        console.log('getContainerIdByName : ', getContainerIdByName[0].Id);
        // Return Id 
        return res.send(getContainerIdByName[0].Id).status(200);
    } catch (e) {
        // Logs of error
        console.log('error : ',e);
        // Return error
        return res.send(e).status(500);
    }
});

/**
 * @param containerId
 * Get stats container
 */
router.get('/getStatsContainer/:containerId', async function (req, res) {
    // Check if contairdId exists
    if (!req.params.containerId || req.params.containerId == "") {
        return res.send('Il manque le paramètre containerId à la requête !').status(400);
    }
    // Check if containerId's length equals to 5 min
    if (req.params.containerId.length < 5) {
        // Display error message
        return res.send('Veuillez renseigner au moins les 5 premières lettres de l\'id du container').status(401);
    }
    // Get container by id
    var getContainer = docker.getContainer(req.params.containerId);

    // Get stats of this container
    getContainer.stats(function (err, stats) {
        if (err) {
            // Logs of error
            console.log('error : ', err);
            // Send error message
            return res.send(err).status(500);
        } else {
            // Return stats of container
            return res.send(JSON.parse(stringify(stats))).status(200);
        }
    });
});


/**
 * @param composePrestashop
 * Create a container
 */
router.post('/createContainer', async function (req, res) {
    try {
        // Create container
        var composePrestashop = await compose.upAll({ cwd: path.join(__dirname) });
        // Logs of container
        console.log('composePrestashop : ', composePrestashop);
        // Return createContainer details
        return res.send('container créé ! ');
    } catch (e) {
        console.log('err : ', e);
        return res.send(e);
    }
});


module.exports = router;

