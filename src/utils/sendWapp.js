import twilio from 'twilio'

const ACCOUNT_SID = 'AC97512b0f59cc4ba28c74486b10374110';
const AUTH_TOKEN = '08611d830e35fe07aaa17fca9b884fa8'

const FROM_NUMBER = '+14155238886'
// const FROM_NUMBER = '+19154659342'

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function sendWapp(toNumber, text) {
    try {
        const message = await client.messages.create({
            body: text,
            from: 'whatsapp:' + FROM_NUMBER,
            to: 'whatsapp:' + toNumber,
            // mediaUrl: ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhELW2HOcnu5iUIB19R86sq8JWAdqWkNky9tXKpRpZ1Nx3WuMfIEcp2xyewEoqNdM6Ch_a8IRQlnOvKAGemGwqIjgZI7jfkU-hDErbgG6J496D5VpZc2E_mwv1A5S0MMVlKKGeipDfh6GW6OZcSOVkhcnW5F4q7QWTKX-GCe1fg5ShHR0qrGf257c0BFg/s1269/283140622_408711064598532_8524822679425111210_n.jpg'],

        });

        if (message.errorCode) {
            throw `${message.errorCode} - ${message.errorMessage}`
        } else {
            return message.sid
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

export { sendWapp }