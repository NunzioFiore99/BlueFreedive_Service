function diveSessionResponseDto(diveSession) {
    return {
        id: diveSession._id,
        user: diveSession.user,
        date: diveSession.date,
        location: diveSession.location,
        gpsCoordinates: diveSession.gpsCoordinates,
        waterType: diveSession.waterType,
        temperature: diveSession.temperature,
        diveCount: diveSession.diveCount,
        maxDepth: diveSession.maxDepth,
        maxDiveTime: diveSession.maxDiveTime,
        notes: diveSession.notes
    }
}

module.exports = diveSessionResponseDto;