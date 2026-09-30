"use client"
import { Button, Card, CardBody, Divider, Input, Spinner,  } from "@nextui-org/react";
import { useUpdateUser } from "@/hooks/user.hook";
import { useUpdateProfilePhoto } from "@/hooks/user.hook";
import { useState } from "react";
import { useUser } from "@/context/user.provider";
import Image from "next/image";

const Settings =  () => {
const {user,isLoading}=useUser()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    bio: user?.bio || "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: updatePhoto } = useUpdateProfilePhoto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (user?._id) {
      updateUser({ userId: user._id, userData: formData });
    }
  };

  const handlePhotoSubmit = () => {
    if (profilePhoto && user?._id) {
      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);
      updatePhoto(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <Card className="md:col-span-1">
          <CardBody className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={user?.profilePhoto || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                width={128}
                height={128}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="profile-photo"
              />
              <Button
                color="primary"
                variant="flat"
                onClick={() => document.getElementById('profile-photo')?.click()}
                fullWidth
              >
                Change Photo
              </Button>
              {profilePhoto && (
                <Button 
                  color="success" 
                  onClick={handlePhotoSubmit}
                  fullWidth
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
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <Divider />
            
            <div className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                fullWidth
              />
              <Input
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                // multiline
                // minRows={3}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                color="primary" 
                onClick={handleSubmit}
                className="w-full md:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Account Actions Section */}
      <Card className="mt-6">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <Divider />
          <div className="space-y-4 mt-4">
            <Button color="danger" variant="light" fullWidth>
              Change Password
            </Button>
            <Button color="danger" variant="light" fullWidth>
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;