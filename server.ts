import { configDotenv } from "dotenv";
import express from "express"
import { google } from "googleapis"

const app = express()

configDotenv()

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL,
);

app.get("/auth", (req, res) => {
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
    ];

    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        prompt: "consent",
        // If you only need one scope, you can pass it as a string
        scope: scopes
    });

    res.redirect(url)
})

app.get("/callback", async (req, res) => {
    const code = req.query.code as string
    const { tokens } = await oauth2Client.getToken(code)

    console.log("Token: ", tokens);

    res.json("You are given access to the google calendar")
})

app.listen(3600, () => {
    console.log("Server listening on port 3600");
})