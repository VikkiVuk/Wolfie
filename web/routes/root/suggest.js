const router = require('express').Router()
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");
const axios = require('axios')

router.get("/", function(req, res) {
    if (req.user) {
        res.send(`
            <html>
                <head>
                    <title>Suggest - Wolfie</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4231389926874940" crossorigin="anonymous"></script>
                    <meta content="Suggest - Wolfie" property="og:title" />
                    <meta content="Want something on the bot? Then go here! I will accept any suggestion as long as its PG, and not something ultimatively weird." property="og:description" />
                    <meta content="https://wolfie.vikkivuk.xyz/main/suggest" property="og:url" />
                    <meta content="" property="og:image" />
                    <meta content="#26EDC2" data-react-helmet="true" name="theme-color" />
                    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                </head>
                <body style="background-color: #3c3c3c;">
                    <center>
                        <br> <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">Suggest</h1>
                        <form method="post" action="/main/suggest/send">
                            <label for="email" style="color:white;font-family: Arial, Helvetica, sans-serif;">Email:</label>
                            <input type="email" id="email" name="email" placeholder="johndoe@mydomain.com"><br><br>
                            <label for="suggestion" style="color:white;font-family: Arial, Helvetica, sans-serif;">Suggestion:</label>
                            <input type="text"  id="suggestion" name="suggestion" placeholder="I'd love to see this ____ because ____..."><br><br>
                            <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="attachements">Choose a file (not required):</label>
                            <input type="file" id="attachements" name="attachements" style="color: white; font-family: Arial, Helvetica, sans-serif; cursor: pointer;"><br><br>
                            <input type="checkbox" id="tos_agree" name="tos_agree" value="tos_agree">
                            <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="tos_agree"> I agree to the Wolfie TOS and the Discord TOS.</label><br><br>
                            <div class="g-recaptcha" data-sitekey="6LezLgMdAAAAAPAJ7Nxcy4LrAxf7K43W8WfjKqKe"></div><br><br>

                            <input type="submit" value="Posalji!" style="border: white; height: 70px; width: 500px; font-family: Arial, Helvetica, sans-serif; font-size: 50px; cursor:pointer;">
                        </form>
                    </center>
                </body>
            </html>
        `)
    } else {
        res.redirect(new URL(`http://${req.hostname}${(req.hostname == "localhost") ? ":4000" : ""}/main/auth/discord`))
    }
})

router.post("/send", (req, res) => {
    const { "g-recaptcha-response": recaptcha } = req.body
    if (recaptcha !== '') {
        axios.post("https://www.google.com/recaptcha/api/siteverify?secret=6LezLgMdAAAAABBzx0bsdYm_2kCq6NHDT4RArtEi&response=" + recaptcha, {}).then(response => {
            if (response.data.success == true) {
                const { email, suggestion, attachements, tos_agree } = req.body
                if (tos_agree !== undefined) {
                    trello.addCard("Preporuka od " + req.user.discordTag + ". Vise informacija u deskripciji", `
                    Email: ${email},
                    Discord Tag: ${req.user.discordTag},
            
                    Preporuka: ${suggestion}
                `, '6113904f6f163a7d919d2481', function(error, card) {
                    if (error) {
                        res.send("your suggestion was not sent due to an error")
                    } else {
                        res.send("Your suggestion was sent!")
                    }
                })
                } else {
                    res.send("Please accept the TOS.")
                }
            } else {
                res.send("Captcha Invalid.")
            }
        })
    } else {
        res.send("Please do the CAPTCHA.")
    }
})

module.exports = router