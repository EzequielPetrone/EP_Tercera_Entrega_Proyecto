import twilio from 'twilio'

import { logger } from '../config/logger.js';

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } from '../config/config.js'

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendWapp(toNumberArray, text) {

    try {
        const sidArray = []
        for (const number of toNumberArray) {

            const message = await client.messages.create({
                body: text,
                from: 'whatsapp:' + TWILIO_FROM_NUMBER,
                to: 'whatsapp:' + number,
                // mediaUrl: ['https://blogger.googleusercontent.com/img']
            });

            if (message.errorCode) {
                throw `${message.errorCode} - ${message.errorMessage}`
            } else {
                sidArray.push(message.sid)
            }
        }
        return sidArray

    } catch (error) {
        logger.error(error);
        return null
    }
}

export { sendWapp }