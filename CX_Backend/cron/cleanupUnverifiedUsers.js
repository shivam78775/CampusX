const cron = require("node-cron");
const userModel = require("../models/userModel");

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const deleted = await userModel.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: cutoffDate },
    });

    if (deleted.deletedCount > 0) {
      console.log(`🧹 Deleted ${deleted.deletedCount} unverified users.`);
    }
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
});
