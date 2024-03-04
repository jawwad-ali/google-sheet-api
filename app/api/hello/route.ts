import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis"

import * as EmailValidator from 'email-validator';

export async function POST(request: NextRequest) {

    const req = await request.json()

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            },

            scopes: ['https://www.googleapis.com/auth/spreadsheets']

        });


        const sheets = google.sheets({
            auth,
            version: 'v4'
        })

        const validateEmail = EmailValidator.validate(req.email);

        console.log(validateEmail)
        console.log(typeof validateEmail)

        if (validateEmail) {

            const response = await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'A1:F1',
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [
                        [req.name, req.message, req.email, req.number,
                        new Date().toLocaleDateString(),
                        new Date().toLocaleTimeString()]
                        // name , message , email, number
                    ]

                }
            })
        }
        else {
            console.log("Please validate your email")
        }
        return new NextResponse(req.name)
    }
    catch (err: any) {
        console.log(err)
        return new NextResponse(err)
    }

}