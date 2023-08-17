const EmailActivity = require("../Models/emailActivity"); // Adjust path as needed

async function getEmailActivityRecords() {
  try {
    const records = await EmailActivity.findAll();
    return records;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
}

module.exports = {
  getEmailActivityRecords,
};
