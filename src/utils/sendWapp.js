import twilio from 'twilio'

import { logger } from '../config/logger.js';

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } from '../config/config.js'

// ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhELW2HOcnu5iUIB19R86sq8JWAdqWkNky9tXKpRpZ1Nx3WuMfIEcp2xyewEoqNdM6Ch_a8IRQlnOvKAGemGwqIjgZI7jfkU-hDErbgG6J496D5VpZc2E_mwv1A5S0MMVlKKGeipDfh6GW6OZcSOVkhcnW5F4q7QWTKX-GCe1fg5ShHR0qrGf257c0BFg/s1269/283140622_408711064598532_8524822679425111210_n.jpg'],

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendWapp(toNumberArray, text, media) {

    console.log(media);
    try {
        const sidArray = []
        for (const number of toNumberArray) {

            const message = await client.messages.create({
                body: text,
                from: 'whatsapp:' + TWILIO_FROM_NUMBER,
                to: 'whatsapp:' + number,
                mediaUrl: media
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