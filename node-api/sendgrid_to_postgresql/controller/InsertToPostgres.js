const axios = require("axios");
require('dotenv').config();

const EmailActivity = require("../Models/emailActivity"); // Adjust path as needed

// SendGrid API configuration
const sendgridAPI = axios.create({
  baseURL: "https://api.sendgrid.com/v3",
  headers: {
    Authorization:
      "Bearer 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",
  },
});

async function InsertData() {
  try {
    const response = await sendgridAPI.get("/messages?limit=100");
    const messages = response.data.messages;

    // Insert data into PostgreSQL using Sequelize model
    for (const message of messages) {
      const {
        from_email,
        msg_id,
        subject,
        to_email,
        status,
        opens_count,
        clicks_count,
        last_event_time,
      } = message;

      await EmailActivity.findOrCreate({
        where: { msg_id },
        defaults: {
          from_email,
          subject,
          to_email,
          status,
          opens_count,
          clicks_count,
          last_event_time,
        },
      });

      console.log(`Record inserted: msg_id - ${msg_id}`);
    }

    console.log("Data inserted into PostgreSQL.");
  } catch (error) {
    console.error("Error fetching and inserting data:", error);
  }
}

module.exports = {
  InsertData,
};
