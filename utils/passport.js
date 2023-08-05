import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import keys from '../configs/keys.js';
import { UserModel as User } from '../models/user.js';

const { secret } = keys.jwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

const setupPassport = () => {
    passport.use(
        new JwtStrategy(opts, (payload, done) => {
            User.findById(payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }

                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false);
                });
        })
    );
};

export default setupPassport;