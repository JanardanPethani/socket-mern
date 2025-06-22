import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { AxiosError } from "axios";

interface ProfileFormData {
  username: string;
  email: string;
}

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profilePic || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => authApi.updateProfile(formData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setError(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Failed to update profile.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setSuccess(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);

    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                id="profilePic"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profilePic"
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer"
              >
                Change Profile Picture
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Username cannot exceed 30 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
