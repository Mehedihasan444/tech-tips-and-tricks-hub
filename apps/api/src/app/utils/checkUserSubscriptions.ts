import { TUser } from "../modules/User/user.interface";
import { User } from "../modules/User/user.model";

export const checkUserSubscriptions = async () => {
  try {
    const currentDate = new Date();

    // Find all users with premium access
    const users = await User.find({ isPremium: true });

    users.forEach(async (user: TUser) => {
      const subscriptionStartDate = new Date(
        user.subscriptionStartDate as string
      );
      const diffInTime =
        currentDate.getTime() - subscriptionStartDate.getTime();
      const diffInMonths = diffInTime / (1000 * 3600 * 24 * 30); // Convert time difference into months

      if (diffInMonths >= 1) {
        // Use MongoDB's $set operator to directly update the isPremium field
        await User.updateOne(
          { _id: user._id }, // Match the user by _id
          { $set: { isPremium: false } } // Set isPremium to false
        );

        console.log(`User ${user.email} has had their premium access revoked.`);
      }
    });
  } catch (error) {
    console.error("Error checking subscriptions:", error);
  }
};
