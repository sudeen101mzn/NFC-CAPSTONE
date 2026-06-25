const Route =
require('../models/route.model');

const serializeRoute = (route, index = 0) => {
    const stopNames = (route.stops || [])
        .map((stop) => stop && typeof stop === 'object' ? stop.name : stop?.name)
        .filter(Boolean);

    const fromStop = stopNames[0] || null;
    const toStop = stopNames[stopNames.length - 1] || null;
    const distance = Math.max((stopNames.length || 1) - 1, 1);
    const fare = 15 + (distance * 10);
    const routeName = route.name;
    const routeNumberMatch = routeName && routeName.match(/\d+/);

    return {
        id: route._id,
        routeNumber: routeNumberMatch ? routeNumberMatch[0] : `R-${index + 1}`,
        routeName,
        fromStop,
        toStop,
        distance,
        fare,
        stops: route.stops || [],
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
    };
};


// CREATE ROUTE
exports.createRoute =
async (req, res) => {

try {

const {
name,
stops
}
=
req.body;

const route =
await Route.create({

name,

stops

});

res
.status(201)
.json(serializeRoute(route));

}

catch(error){

res
.status(500)
.json({
message:
error.message
});

}

};


// GET ROUTES
exports.getRoutes =
async (req, res) => {

try {

const routes =
await Route
.find()
.populate('stops');

res
.json(routes.map((route, index) => serializeRoute(route, index)));

}

catch(error){

res
.status(500)
.json({
message:
error.message
});

}

};
