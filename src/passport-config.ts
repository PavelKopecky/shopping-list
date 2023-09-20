const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

export const initialize = async (passport, getUser) => {
    const authenticateUser = async (username : string, password : string, done) => {
        const user = getUser(username);
        if (!user) {
            return ['User with this username does not exist.', false];
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return ['Login successful.', true];
            } else return ['Wrong password.', false];
        } catch {
            return ['An error occurred during authentication.', false];
        }
    }
    passport.use(new LocalStrategy(authenticateUser).strategy);
    passport.serializeUser((user) => [user.name, true]);
    passport.deserializeUser((user) => [user.name, true]);
}
