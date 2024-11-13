const DiveSession = require("../models/diveSession.model");

function diveSessionsResponseDto(diveSessions) {
    const diveSessionsResponse = [];
    diveSessions.forEach(diveSession => {
        diveSessionsResponse.push(new DiveSession({
            user: diveSession.user,
            date: diveSession.date,
            location: diveSession.location,
            gpsLocation: diveSession.gpsLocation,
            waterType: diveSession.waterType,
            temperature: diveSession.temperature,
            diveCount: diveSession.diveCount,
            maxDepth: diveSession.maxDepth,
            maxDiveTime: diveSession.maxDiveTime,
            notes: diveSession.notes
        }));
    })

    return diveSessionsResponse;
}

module.exports = diveSessionsResponseDto;