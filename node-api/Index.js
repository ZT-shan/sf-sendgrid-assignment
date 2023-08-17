const express = require("express");
require('dotenv').config();
const insertData = require("./controller/InsertToPostgres");
const getEmailActivity = require("./controller/getActivity");

const app = express();
const PORT = process.env.PORT || 8000;


// Middleware to check Authorization header
function authorizeToken(req, res, next) {
const expectedToken = process.env.SENDGRID_API_KEY;
  const authHeader = req.header("Authorization");
  const Token =
    `Bearer ${expectedToken}`;

  if (authHeader !== Token) {
    return res.status(401).json({ statuscode: 401, error: "Not Authorized." });
  }
  next();
}

// Route to get email activity data
app.get("/get-activity-records", authorizeToken, async (req, res) => {
  try {
    const records = await getEmailActivity.getEmailActivityRecords();
    res.status(200).json({ statuscode: 200, body: records });
  } catch (error) {
    res
      .status(500)
      .json({
        statuscode: 500,
        error: "An error occurred while fetching data.",
      });
  }
});

// Function to start the server and fetch/insert data
async function startServer() {
  try {
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    await insertData.InsertData();
    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error fetching and inserting data:", error);
  }
}

// Call the startServer function to initiate server startup
startServer();
