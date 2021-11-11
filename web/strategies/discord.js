const passport = require("passport")
const DiscordStrategy = require("passport-discord")
const User = require("../database/schemas/user-schema.js")

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    User.findById( _id, (err, user) => {
    if(err){
        done(null, false, {error:err});
    } else {
        done(null, user);
    }
  });
});

passport.use(new DiscordStrategy({
    clientID: "880049472246284328",
    clientSecret: "Of64_H76boz7Q5M2fGjoFBt0YQ-XgKj0",
    callbackURL: "/main/auth/discord/redirect",
    scope: ["identify", "guilds"]
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const { id, username, discriminator, avatar, guilds } = profile
        const findUser = await User.findOneAndUpdate({ discordId: id }, { discordTag: `${username}#${discriminator}`, avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`, guilds: guilds}, { new: true }).exec()

        if (findUser) {
            return done(null, findUser)
        } else {
            const newUser = await new User({ discordId: id, discordTag: `${username}#${discriminator}`, avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`, guilds: guilds}).save()
            return done(null, newUser)
        }
    } catch(err) {
        return done(err, null)
    }
}))