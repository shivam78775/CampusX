const cron = require("node-cron");
const userModel = require("../models/userModel");

// Log that the cron job is scheduled
console.log("🕒 Unverified user cleanup cron job scheduled to run every 10 minutes (testing: 1 minute cutoff).");

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  // 🔁 For testing: delete users unverified for over 1 minute
  const cutoffDate = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago

  try {
    // 🔍 Log unverified users that qualify for deletion
    const unverifiedUsers = await userModel.find({
      isEmailVerified: false,
      createdAt: { $lt: cutoffDate },
    });

    if (unverifiedUsers.length > 0) {
      console.log("🔍 Found unverified users to delete:", unverifiedUsers.map(u => ({
        id: u._id,
        email: u.email,
        createdAt: u.createdAt,
      })));
    } else {
      console.log("🧼 No unverified users to delete at this time.");
    }

    // 🗑️ Perform deletion
    const deleted = await userModel.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: cutoffDate },
    });

    if (deleted.deletedCount > 0) {
      console.log(`🧹 Deleted ${deleted.deletedCount} unverified user(s).`);
    }
  } catch (error) {
    console.error("❌ Error deleting unverified users:", error);
  }
});
