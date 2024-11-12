function userResponseDto(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        roles: user.roles.map(role => role.name),
    };
}

module.exports = userResponseDto;