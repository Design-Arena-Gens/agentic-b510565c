const twilio = require('twilio');

// Create Twilio client
const createClient = () => {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};

// Send OTP via SMS
exports.sendOTP = async (phoneNumber, otp) => {
  try {
    const client = createClient();

    const message = await client.messages.create({
      body: `Your verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('OTP sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Send order status update via SMS
exports.sendOrderStatusSMS = async (phoneNumber, orderNumber, status) => {
  try {
    const client = createClient();

    let statusMessage = '';
    switch(status) {
      case 'paid':
        statusMessage = 'Your order has been confirmed and is being processed.';
        break;
      case 'shipped':
        statusMessage = 'Your order has been shipped and is on its way!';
        break;
      case 'delivered':
        statusMessage = 'Your order has been delivered. Thank you for shopping with us!';
        break;
      default:
        statusMessage = `Your order status has been updated to: ${status}`;
    }

    await client.messages.create({
      body: `Order ${orderNumber}: ${statusMessage}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('Order status SMS sent');
    return true;
  } catch (error) {
    console.error('Error sending order status SMS:', error);
    return false;
  }
};
