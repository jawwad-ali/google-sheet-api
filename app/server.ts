"use server"

import { google } from "googleapis"
import * as EmailValidator from "email-validator";

// Function to get current GMT date
function getCurrentGMTDate() {
    return new Date().toISOString().split('T')[0];
}

// Function to get current GMT time
function getCurrentGMTTime() {
    return new Date().toISOString().split('T')[1].split('.')[0];
}

export const handleServer = async (email: string) => {
    console.log("serverMail", email)

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },

        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
        auth,
        version: "v4",
    });

    try {

        if (EmailValidator.validate(email)) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: "A1:C1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [
                        [
                            email,
                            getCurrentGMTDate(),
                            getCurrentGMTTime(),
                        ],
                    ],
                },
            });
        }

    }
    catch(err){
        console.log("Error",err)
    }
}