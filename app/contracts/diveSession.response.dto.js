function diveSessionResponseDto(diveSession) {
    return {
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
    }
}

module.exports = diveSessionResponseDto;