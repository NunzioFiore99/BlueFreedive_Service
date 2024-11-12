function userProfileResponseDto(userProfile) {
    return {
        id: userProfile._id,
        userId: userProfile.user,
        gender: userProfile.gender,
        birthdate: userProfile.birthdate,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        weight: userProfile.weight,
        height: userProfile.height,
    };
}

module.exports = userProfileResponseDto;