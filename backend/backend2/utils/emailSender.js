import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendMail = async ({ to, subject, text }) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      },
    });

    const mailOptions = {
      from: `COde Editor OTP Verification  <${SENDER_EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
      html:`<h1>${text}</h1>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error while sending email: ", error);
    throw error;
  }
};
