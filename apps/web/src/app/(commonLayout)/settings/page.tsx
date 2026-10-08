"use client";
import { Button, Card, CardBody, Divider, Input, Spinner, Switch, Textarea } from "@heroui/react";
import { useUpdateUser } from "@/hooks/user.hook";
import { useUpdateProfilePhoto } from "@/hooks/user.hook";
import { useEffect, useState } from "react";
import { useUser } from "@/context/user.provider";
import Image from "next/image";
import Link from "next/link";
import { Bell, ShieldCheck, User } from "lucide-react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const PREFS_KEY = "tech-tips-notification-prefs";

const Settings = () => {
  const { user, isLoading } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    bio: "",
    profession: "",
  });
  const [prefs, setPrefs] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const { mutate: updateUser, isPending: isSaving } = useUpdateUser();
  const { mutate: updatePhoto, isPending: isPhotoSaving } = useUpdateProfilePhoto();

  // The user object arrives async — resync the form when it loads.
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      mobileNumber: user?.mobileNumber || "",
      bio: user?.bio || "",
      profession: user?.profession || "",
    });
  }, [user?.name, user?.email, user?.mobileNumber, user?.bio, user?.profession]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
  }, []);

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");
    if (!file) {
      setProfilePhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      setProfilePhoto(null);
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Image must be smaller than 5MB.");
      setProfilePhoto(null);
      return;
    }
    setProfilePhoto(file);
  };

  const handleSubmit = () => {
    if (user?._id) {
      updateUser({ userId: user._id, userData: formData });
    }
  };

  const handlePhotoSubmit = () => {
    if (profilePhoto && user?._id) {
      const data = new FormData();
      data.append("profilePhoto", profilePhoto);
      updatePhoto(data, {
        onSuccess: () => setProfilePhoto(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-label="Loading settings..."
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <Card className="md:col-span-1">
          <CardBody className="flex flex-col items-center gap-4">
            <div className="relative">
              {user?.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={user?.name ?? "Profile"}
                  className="w-32 h-32 rounded-full object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex w-32 h-32 rounded-full items-center justify-center bg-default-200 text-4xl font-bold text-default-500"
                >
                  {(user?.name ?? "?").charAt(0)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="profile-photo"
                className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-primary/10 text-primary-fg font-medium cursor-pointer hover:bg-primary/20 transition-colors"
              >
                Change Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
                id="profile-photo"
              />
              {profilePhoto && (
                <p className="text-xs text-default-500 truncate">
                  Selected: {profilePhoto.name} ({Math.round(profilePhoto.size / 1024)} KB)
                </p>
              )}
              {photoError && (
                <p role="alert" className="text-xs text-danger">
                  {photoError}
                </p>
              )}
              {profilePhoto && (
                <Button
                  color="success"
                  onPress={handlePhotoSubmit}
                  isLoading={isPhotoSaving}
                  isDisabled={isPhotoSaving}
                  className="w-full"
                >
                  Save Photo
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Account Details Section */}
        <Card className="md:col-span-2">
          <CardBody className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <User size={18} /> Personal Information
            </h2>
            <Divider />

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isDisabled={isSaving}
                  className="w-full"
                />
                <Input
                  label="Profession"
                  name="profession"
                  placeholder="e.g. Frontend Engineer"
                  value={formData.profession}
                  onChange={handleChange}
                  isDisabled={isSaving}
                  className="w-full"
                />
              </div>
              <Input
                label="Email"
                name="email"
                value={formData.email}
                isReadOnly
                isDisabled
                className="w-full"
              />
              <Input
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                isDisabled={isSaving}
                className="w-full"
              />
              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                isDisabled={isSaving}
                minRows={3}
                className="w-full"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSaving}
                isDisabled={isSaving}
                className="w-full md:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card className="mt-6">
        <CardBody>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Bell size={18} /> Notification Preferences
          </h2>
          <Divider className="my-4" />
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: "likes", label: "Likes", desc: "When someone likes your post" },
                { key: "comments", label: "Comments", desc: "When someone comments on your post" },
                { key: "follows", label: "New followers", desc: "When someone follows you" },
                { key: "mentions", label: "Mentions", desc: "When someone mentions you" },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-divider p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-default-500">{item.desc}</p>
                </div>
                <Switch
                  size="sm"
                  isSelected={prefs[item.key]}
                  onValueChange={() => togglePref(item.key)}
                  aria-label={`${item.label} notifications`}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-default-500">
            Preferences are stored on this device and apply to the live notification feed.
          </p>
        </CardBody>
      </Card>

      {/* Privacy shortcuts */}
      <Card className="mt-6">
        <CardBody>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={18} /> Privacy & Safety
          </h2>
          <Divider className="my-4" />
          <div className="flex flex-wrap gap-2">
            <Button as={Link} href="/privacy" variant="flat" size="sm">
              Privacy Policy
            </Button>
            <Button as={Link} href="/terms" variant="flat" size="sm">
              Terms of Service
            </Button>
            <Button as={Link} href="/help" variant="flat" size="sm">
              Help Center
            </Button>
            {user?.nickName && (
              <Button
                as={Link}
                href={`/profile/${user.nickName}`}
                variant="flat"
                size="sm"
                color="primary"
              >
                View public profile
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Account Actions Section */}
      <Card className="mt-6">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <Divider />
          <div className="space-y-4 mt-4">
            <Button
              as={Link}
              href="/forget-password"
              color="primary"
              variant="light"
              className="w-full"
            >
              Change Password
            </Button>
            <p className="text-xs text-default-600 text-center">
              To delete your account, please contact support via the{" "}
              <Link href="/contact-us" className="text-primary-fg hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;
