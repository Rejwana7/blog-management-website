"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { getAssetUrl } from "@/utils/api";

const NAME_PATTERN = /^[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)*$/u;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function initials(user) {
  return `${user.firstname?.trim()?.[0] ?? ""}${user.lastname?.trim()?.[0] ?? ""}`.toUpperCase() || "U";
}

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [names, setNames] = useState({ firstname: user.firstname ?? "", lastname: user.lastname ?? "" });
  const [nameErrors, setNameErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fullName = [user.firstname, user.lastname].filter(Boolean).join(" ") || "User";
  const currentImageUrl = getAssetUrl(user.profilePicture);
  const displayedImageUrl = previewUrl || currentImageUrl;

  function updateName(event) {
    const { name, value } = event.target;
    setNames((current) => ({ ...current, [name]: value }));
    setNameErrors((current) => ({ ...current, [name]: "" }));
    setMessage({ type: "", text: "" });
  }

  function validateNames() {
    const errors = {};
    const firstname = names.firstname.trim();
    const lastname = names.lastname.trim();
    if (!firstname) errors.firstname = "First name is required.";
    else if (!NAME_PATTERN.test(firstname)) errors.firstname = "Use letters and spaces only.";
    if (lastname && !NAME_PATTERN.test(lastname)) errors.lastname = "Use letters and spaces only.";
    return errors;
  }

  async function saveProfile(event) {
    event.preventDefault();
    const errors = validateNames();
    setNameErrors(errors);
    if (Object.keys(errors).length) return;

    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await userService.updateProfile({
        firstname: names.firstname.trim(),
        lastname: names.lastname.trim() || null,
        email: user.email,
      });
      const updatedUser = response?.data ?? {};
      setUser((current) => ({ ...current, ...updatedUser }));
      setNames({ firstname: updatedUser.firstname ?? names.firstname.trim(), lastname: updatedUser.lastname ?? "" });
      setMessage({ type: "success", text: response?.message || "Profile updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Unable to update your profile." });
    } finally {
      setIsSaving(false);
    }
  }

  function chooseImage(event) {
    const file = event.target.files?.[0];
    setMessage({ type: "", text: "" });
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      setMessage({ type: "error", text: "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed." });
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      setMessage({ type: "error", text: "Image size must not exceed 5 MB." });
      event.target.value = "";
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function cancelImageSelection() {
    setSelectedImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage() {
    if (!selectedImage || isUploading) return;
    setIsUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await userService.uploadProfileImage(selectedImage);
      setUser((current) => ({ ...current, ...(response?.data ?? {}) }));
      setSelectedImage(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage({ type: "success", text: response?.message || "Profile image updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Unable to upload the image." });
    } finally {
      setIsUploading(false);
    }
  }

  const inputClass = (hasError) => `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-violet-500 focus:ring-violet-100"}`;

  return (
    <div className="max-w-3xl space-y-6">
      {message.text ? <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</div> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Profile picture</h2>
        <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP or AVIF · Maximum 5 MB</p>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div aria-label={`${fullName}'s avatar`} className="grid size-24 shrink-0 place-items-center rounded-full border-4 border-violet-100 bg-slate-900 bg-cover bg-center text-2xl font-bold text-white shadow-sm" role="img" style={displayedImageUrl ? { backgroundImage: `url(${displayedImageUrl})` } : undefined}>{displayedImageUrl ? <span className="sr-only">Profile image</span> : initials(user)}</div>
          <div className="min-w-0 flex-1">
            <input accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" id="profile-image" onChange={chooseImage} ref={fileInputRef} type="file" />
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-violet-600 bg-white px-5 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50" htmlFor="profile-image">Choose Image</label>
              {selectedImage ? <button className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={isUploading} onClick={uploadImage} type="button">{isUploading ? "Uploading..." : "Upload"}</button> : null}
              {selectedImage ? <button className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 disabled:opacity-50" disabled={isUploading} onClick={cancelImageSelection} type="button">Cancel</button> : null}
            </div>
            <p className="mt-2 max-w-sm truncate text-xs text-slate-500" title={selectedImage?.name}>{selectedImage ? selectedImage.name : "No image selected"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Profile information</h2>
        <form className="mt-6 grid gap-5 sm:grid-cols-2" noValidate onSubmit={saveProfile}>
          <label className="text-sm font-bold text-slate-800" htmlFor="profile-firstname">First Name <span className="text-red-500">*</span><input aria-invalid={Boolean(nameErrors.firstname)} className={inputClass(nameErrors.firstname)} id="profile-firstname" name="firstname" onChange={updateName} value={names.firstname} />{nameErrors.firstname ? <span className="mt-2 block font-normal text-red-600">{nameErrors.firstname}</span> : null}</label>
          <label className="text-sm font-bold text-slate-800" htmlFor="profile-lastname">Last Name <span className="font-normal text-slate-400">(optional)</span><input aria-invalid={Boolean(nameErrors.lastname)} className={inputClass(nameErrors.lastname)} id="profile-lastname" name="lastname" onChange={updateName} value={names.lastname} />{nameErrors.lastname ? <span className="mt-2 block font-normal text-red-600">{nameErrors.lastname}</span> : null}</label>
          <label className="text-sm font-bold text-slate-800" htmlFor="profile-email">Email <input className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none" id="profile-email" readOnly type="email" value={user.email ?? ""} /></label>
          <label className="text-sm font-bold text-slate-800" htmlFor="profile-role">Role <input className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-600 outline-none" id="profile-role" readOnly value={user.role ?? ""} /></label>
          <div className="sm:col-span-2 sm:text-right"><button className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save Changes"}</button></div>
        </form>
      </section>
    </div>
  );
}
