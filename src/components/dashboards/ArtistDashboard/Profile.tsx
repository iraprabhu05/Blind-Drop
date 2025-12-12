import React, { useState } from "react";
import { artistProfile } from "./mock-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(artistProfile);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [bannerPreview, setBannerPreview] = useState(profile.banner);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") setAvatarPreview(reader.result);
        if (type === "banner") setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-2">
          Customize your public artist profile.
        </p>
      </header>

      {/* Profile Banner and Avatar */}
      <div className="relative h-48 md:h-64 rounded-2xl bg-[#1C1C1C] border border-gray-800">
        <img
          src={bannerPreview}
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
        <div className="absolute bottom-0 left-8 translate-y-1/2">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <img
              src={avatarPreview}
              className="w-full h-full object-cover rounded-full border-4 border-[#111111]"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Upload size={32} />
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
              />
            </label>
          </div>
        </div>
        <label
          htmlFor="banner-upload"
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-violet-600"
        >
          <Upload size={20} />
          <input
            id="banner-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "banner")}
          />
        </label>
      </div>

      <div className="pt-24"></div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="Stage Name"
            className="bg-gray-800 border-gray-700 h-12"
          />
          <Input
            name="genre"
            value={profile.genre}
            onChange={handleInputChange}
            placeholder="Genre"
            className="bg-gray-800 border-gray-700 h-12"
          />
        </div>
        <Textarea
          name="bio"
          value={profile.bio}
          onChange={handleInputChange}
          placeholder="Your Bio"
          rows={5}
          className="bg-gray-800 border-gray-700"
        />

        <h3 className="text-xl font-bold text-white pt-4">Social Links</h3>
        <div className="space-y-4">
          <Input
            name="twitter"
            value={profile.socials.twitter}
            onChange={handleSocialChange}
            placeholder="Twitter URL"
            className="bg-gray-800 border-gray-700"
          />
          <Input
            name="instagram"
            value={profile.socials.instagram}
            onChange={handleSocialChange}
            placeholder="Instagram URL"
            className="bg-gray-800 border-gray-700"
          />
          <Input
            name="spotify"
            value={profile.socials.spotify}
            onChange={handleSocialChange}
            placeholder="Spotify URL"
            className="bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button
          onClick={handleSave}
          className="bg-violet-600 hover:bg-violet-700 font-semibold"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
