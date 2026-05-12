// src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/User/user.model";
import { Provider } from "../modules/User/user.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_SECRET,
      callbackURL: `${envVars.SERVER_URL}${envVars.GOOGLE_CREDENTIALS.GOOGLE_CALLBACK_URL}`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;
        const name = profile.displayName;

        // 1. Find user who already has this Google provider entry
        let user = await User.findOne({
          auths: {
            $elemMatch: {
              provider: Provider.GOOGLE, // match your enum value
              providerId: googleId,
            },
          },
        });

        if (user) return done(null, user);

        // 2. Email exists but signed up locally — link Google to that account
        user = await User.findOne({ email });

        if (user) {
          user.auths.push({
            provider: Provider.GOOGLE,
            providerId: googleId,
          });
          if (!user.avatar) user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        // 3. Brand new user — create with Google auth entry
        user = await User.create({
          name,
          email,
          avatar,
          isVerified: true,
          auths: [
            {
              provider: Provider.GOOGLE,
              providerId: googleId,
            },
          ],
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

export default passport;
