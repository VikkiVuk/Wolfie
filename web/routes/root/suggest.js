const router = require('express').Router()
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

router.get("/", function(req, res) {
    if (req.user) {
        res.send(`
            <html>
                <head>
                    <title>Preporuci</title>
                    <meta content="Preporuci nesto!" property="og:title" />
                    <meta content="Ovde mozes da preporucis nesto za discord bota koji se zove Wolfie! Ukoliko zelis da se prijavis za admina molim te idi na /admin-apply a ne /suggest." property="og:description" />
                    <meta content="https://discord-wolfie.herokuapp.com/main/suggest" property="og:url" />
                    <meta content="" property="og:image" />
                    <meta content="#26EDC2" data-react-helmet="true" name="theme-color" />
                </head>
                <body style="background-color: #3c3c3c;">
                    <center>
                        <br> <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">Preporuci nesto!</h1>
                        <form method="post" action="/main/suggest/send">
                            <label for="email" style="color:white;font-family: Arial, Helvetica, sans-serif;">Email:</label>
                            <input type="email" id="email" name="email" placeholder="johndoe@mydomain.com"><br><br>
                            <label for="suggestion" style="color:white;font-family: Arial, Helvetica, sans-serif;">Preporuka:</label>
                            <input type="text"  id="suggestion" name="suggestion" placeholder="Voleo bih da vidim ovo ______, jer ______"><br><br>
                            <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="attachements">Izaberite fajl (nije obavezno):</label>
                            <input type="file" id="attachements" name="attachements" style="color: white; font-family: Arial, Helvetica, sans-serif; cursor: pointer;"><br><br>
                            <input type="checkbox" id="tos_agree" name="tos_agree" value="tos_agree">
                            <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="tos_agree"> Prihvatam uslove deljenja moje informacije i da cu biti informisan ako moja preporuka bude prihvacena.</label><br><br>
                            <input type="submit" value="Posalji!" style="border: white; height: 70px; width: 500px; font-family: Arial, Helvetica, sans-serif; font-size: 50px; cursor:pointer;">
                        </form>
                    </center>
                </body>
            </html>
        `)
    } else {
        res.redirect(new URL(`http://${req.hostname}:${(process.env.PORT == undefined) ? 4000 : process.env.PORT}/main/auth/discord`))
    }
})

router.post("/send", (req, res) => {
    const { email, suggestion, attachements, tos_agree } = req.body
	if (tos_agree !== undefined) {
        trello.addCard("Preporuka od " + req.user.discordTag + ". Vise informacija u deskripciji", `
		Email: ${email},
		Discord Tag: ${req.user.discordTag},

		Preporuka: ${suggestion}
	`, '6113904f6f163a7d919d2481', function(error, card) {
		if (error) {
			res.send("Doslo je do greske i tvoja preporuka nije poslata.")
		} else {
			res.send("Uspesno si preporucio nesto za wolfie!")
		}
	})
    } else {
        res.send("Molim te prihvati sve.")
    }
})

module.exports = router