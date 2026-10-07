import config from "../config";
import { USER_ROLE, USER_STATUS } from "../modules/User/user.constant";
import { User } from "../modules/User/user.model";
import { generateNickname } from "./generateNickname";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

type TSeedUser = {
  name: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  email: string;
  password: string;
};

const ensureUser = async ({ name, role, email, password }: TSeedUser) => {
  const existing = await User.findOne({ email, status: USER_STATUS.ACTIVE });

  if (existing) return false;

  await User.create({
    name,
    role,
    email,
    password,
    mobileNumber: "",
    status: USER_STATUS.ACTIVE,
    profilePhoto: BLANK_AVATAR,
    bio: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    education: [],
    socialMedia: [],
    nickName: generateNickname(name),
  });

  return true;
};

export const seed = async () => {
  try {
    const admin = await User.findOne({
      role: USER_ROLE.ADMIN,
      email: config.admin_email,
      status: USER_STATUS.ACTIVE,
    });

    if (!admin) {
      console.log("Seeding started...");
      await User.create({
        name: "Admin",
        role: USER_ROLE.ADMIN,
        email: config.admin_email,
        password: config.admin_password,
        mobileNumber: config.admin_mobile_number,
        status: USER_STATUS.ACTIVE,
        profilePhoto: config.admin_profile_photo || BLANK_AVATAR,
        bio: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        education: [],
        socialMedia: [],
        nickName: generateNickname("Admin"),
      });
      console.log("Admin created successfully...");
    }

    // Demo accounts backing the one-click role logins on the web login page.
    // These are ordinary users that authenticate through the normal
    // POST /auth/login route — there is no demo-only auth bypass — and they are
    // never created in production (see DEMO_LOGIN_ENABLED in config/env.ts).
    if (config.demo_login_enabled) {
      const created = await Promise.all([
        ensureUser({
          name: "Demo Admin",
          role: USER_ROLE.ADMIN,
          email: config.demo_admin_email,
          password: config.demo_admin_password,
        }),
        ensureUser({
          name: "Demo User",
          role: USER_ROLE.USER,
          email: config.demo_user_email,
          password: config.demo_user_password,
        }),
      ]);

      const count = created.filter(Boolean).length;
      if (count > 0) {
        console.log(`Demo accounts ready (${count} created).`);
      }
    }

    console.log("Seeding completed...");
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
