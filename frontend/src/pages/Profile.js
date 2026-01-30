import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import api from "../services/authService";
import { swalSuccess, swalError, swalConfirm } from "../utils/swal";

function Profile() {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  async function handleLogout() {
    const result = await swalConfirm({
      title: "Logout?",
      text: "You will be logged out of your account.",
      confirmText: "Logout",
    });

    if (!result.isConfirmed) return;

    // Clear auth
    localStorage.removeItem("token"); // if you store token
    setUser(null);

    swalSuccess("Logged Out", "You have been logged out successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 800);
  }

  // Sync initial values from auth user
  useEffect(
    function () {
      if (user) {
        setName(user.name || "");
        setFarmName(user.farmName || "");
        setLocation(user.location || "");
        setAvatarPreview(user.avatarUrl || null);
      }
    },
    [user],
  );

  // Auto-hide success message after 3s
  useEffect(
    function () {
      if (!message) return;
      var t = setTimeout(function () {
        setMessage("");
      }, 3000);
      return function () {
        clearTimeout(t);
      };
    },
    [message],
  );

  // Auto-hide error message after 4s
  useEffect(
    function () {
      if (!error) return;
      var t2 = setTimeout(function () {
        setError("");
      }, 4000);
      return function () {
        clearTimeout(t2);
      };
    },
    [error],
  );

  var initials =
    user && user.name
      ? user.name
          .split(" ")
          .map(function (s) {
            return s[0];
          })
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  function handleEdit() {
    setEditing(true);
    setError("");
    setMessage("");
  }

  async function handleCancel() {
    const result = await swalConfirm({
      title: "Discard changes?",
      text: "All unsaved changes will be lost",
      confirmText: "Yes, discard",
    });
    if (!result.isConfirmed) return;
    setEditing(false);
    setError("");
    setMessage("");
    setName(user?.name || "");
    setFarmName(user?.farmName || "");
    setLocation(user?.location || "");
    setAvatarPreview(user?.avatarUrl || null);
    setAvatarFile(null);
    setAvatarRemoved(false);

    swalSuccess("Cancelled", "Changes discarded");
  }

  function handleAvatarChange(e) {
    var file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setAvatarFile(file);
    setError("");
    setAvatarRemoved(false);
    var reader = new FileReader();
    reader.onload = function (ev) {
      setAvatarPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e?.preventDefault();

    // 🔔 Optional confirm before save
    const confirm = await swalConfirm({
      title: "Save changes?",
      text: "Your profile information will be updated",
      confirmText: "Save",
    });

    if (!confirm.isConfirmed) return;

    setSaving(true);
    setError("");

    try {
      // 1️⃣ Update profile fields
      const profileRes = await api.put("/users/me", {
        name,
        farmName,
        location,
      });

      let updatedUser = profileRes?.data?.user ?? profileRes.data;

      // 2️⃣ DELETE avatar if removed
      if (avatarRemoved && !avatarFile) {
        const deleteRes = await api.delete("/users/me/avatar");
        updatedUser = deleteRes.data.user;
      }

      // 3️⃣ Upload avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarRes = await api.post("/users/me/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedUser = avatarRes.data.user;
      }

      // 4️⃣ Update auth context
      setUser(updatedUser);

      // 5️⃣ Reset states
      setAvatarFile(null);
      setAvatarRemoved(false);
      setEditing(false);

      // ✅ SUCCESS SWEETALERT
      swalSuccess("Saved", "Profile updated successfully");
    } catch (err) {
      // ❌ ERROR SWEETALERT
      swalError(
        "Update Failed",
        err?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Render avatar node
  const shouldShowAvatar = !avatarRemoved && (avatarPreview || user?.avatarUrl);

  const avatarNode = shouldShowAvatar ? (
    <img
      src={avatarPreview || user.avatarUrl}
      alt="Profile"
      className="rounded-circle"
      style={{
        width: 96,
        height: 96,
        objectFit: "cover",
        border: "3px solid #198754",
      }}
    />
  ) : (
    <div
      className="mx-auto rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
      style={{ width: 96, height: 96, fontSize: 32 }}
    >
      {initials}
    </div>
  );

  // Layout tree
  return React.createElement(
    "div",
    { className: "d-flex" },
    React.createElement(Sidebar, null),
    React.createElement(
      "main",
      { className: "flex-grow-1", style: { background: "#fafaf8" } },
      React.createElement(
        "div",
        { className: "container-fluid py-4" },
        React.createElement(PageHeader, {
          title: "My Profile",
          subtitle: "View and manage your account details",
          badge: "Secure",
        }),

        React.createElement(
          "div",
          { className: "row g-3" },

          // Left column
          React.createElement(
            "div",
            { className: "col-12 col-lg-4" },
            React.createElement(
              "div",
              { className: "card border-0 shadow-sm h-100 text-center p-4" },
              React.createElement(
                "div",
                { className: "position-relative d-inline-block" },
                avatarNode,

                editing
                  ? React.createElement(
                      "div",
                      {
                        className: "position-absolute",
                        style: { bottom: -10, right: -10 },
                      },

                      // Change button
                      React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "btn btn-sm btn-light border me-1",
                          style: { fontSize: 11, padding: "2px 6px" },
                          onClick: function () {
                            fileInputRef.current &&
                              fileInputRef.current.click();
                          },
                        },
                        "Change",
                      ),

                      // Remove button (only show if an avatar exists)
                      avatarPreview || (user && user.avatarUrl)
                        ? React.createElement(
                            "button",
                            {
                              type: "button",
                              className: "btn btn-sm btn-danger border",
                              style: { fontSize: 11, padding: "2px 6px" },
                              onClick: async function () {
                                const result = await swalConfirm({
                                  title: "Remove Avatar?",
                                  text: "This will remove your profile picture",
                                  confirmText: "Remove",
                                });

                                if (!result.isConfirmed) return;

                                setAvatarPreview(null);
                                setAvatarFile(null);
                                setAvatarRemoved(true);

                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }

                                swalSuccess(
                                  "Removed",
                                  "Profile picture removed",
                                );
                              },
                            },
                            "Remove",
                          )
                        : null,
                    )
                  : null,

                // hidden file input
                React.createElement("input", {
                  type: "file",
                  accept: "image/*",
                  ref: fileInputRef,
                  className: "d-none",
                  onChange: handleAvatarChange,
                }),
              ),

              React.createElement("h4", { className: "mt-3 mb-0" }, user?.name),
              React.createElement(
                "div",
                { className: "text-muted" },
                user?.email,
              ),

              React.createElement(
                "span",
                { className: "badge bg-light text-dark mt-2" },
                "Role: " + (user?.role || "user"),
              ),

              React.createElement(
                "div",
                { className: "mt-3 text-start" },
                React.createElement(
                  "div",
                  { className: "small text-muted mb-1" },
                  "Farm Name",
                ),
                React.createElement(
                  "div",
                  { className: "fw-semibold" },
                  user?.farmName || "Not set yet",
                ),
                React.createElement(
                  "div",
                  { className: "small text-muted mt-3 mb-1" },
                  "Location",
                ),
                React.createElement(
                  "div",
                  { className: "fw-semibold" },
                  user?.location || "Not set yet",
                ),
              ),
            ),
          ),

          // Right column
          React.createElement(
            "div",
            { className: "col-12 col-lg-8" },
            React.createElement(
              "div",
              { className: "card border-0 shadow-sm h-100" },
              React.createElement(
                "div",
                { className: "card-body" },

                // Header controls
                React.createElement(
                  "div",
                  {
                    className:
                      "d-flex justify-content-between align-items-center mb-3",
                  },
                  React.createElement(
                    "h5",
                    { className: "mb-0" },
                    "Account Details",
                  ),

                  !editing
                    ? React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "btn btn-outline-success btn-sm",
                          onClick: handleEdit,
                        },
                        "Edit Profile",
                      )
                    : React.createElement(
                        "div",
                        { className: "d-flex gap-2" },
                        React.createElement(
                          "button",
                          {
                            type: "button",
                            className: "btn btn-sm btn-secondary",
                            onClick: handleCancel,
                            disabled: saving,
                          },
                          "Cancel",
                        ),
                        React.createElement(
                          "button",
                          {
                            type: "button",
                            className: "btn btn-sm btn-success",
                            onClick: handleSave,
                            disabled: saving,
                          },
                          saving ? "Saving…" : "Save",
                        ),
                      ),
                ),

                // Alerts
                error
                  ? React.createElement(
                      "div",
                      { className: "alert alert-danger py-2" },
                      error,
                    )
                  : null,
                message
                  ? React.createElement(
                      "div",
                      { className: "alert alert-success py-2" },
                      message,
                    )
                  : null,

                // Form
                React.createElement(
                  "form",
                  { onSubmit: handleSave, noValidate: true },
                  React.createElement(
                    "div",
                    { className: "row g-3" },

                    // Name
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "Name",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: name,
                        onChange: function (e) {
                          setName(e.target.value);
                        },
                        disabled: !editing,
                      }),
                    ),

                    // Email
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "Email",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: user?.email || "",
                        disabled: true,
                      }),
                    ),

                    // User ID
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "User ID",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: user?.id || user?._id || "",
                        disabled: true,
                      }),
                    ),

                    // Role
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "Role",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: user?.role || "",
                        disabled: true,
                      }),
                    ),

                    // Farm Name
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "Farm Name",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: farmName,
                        onChange: function (e) {
                          setFarmName(e.target.value);
                        },
                        disabled: !editing,
                      }),
                    ),

                    // Location
                    React.createElement(
                      "div",
                      { className: "col-12 col-md-6" },
                      React.createElement(
                        "label",
                        { className: "form-label" },
                        "Location",
                      ),
                      React.createElement("input", {
                        className: "form-control",
                        value: location,
                        onChange: function (e) {
                          setLocation(e.target.value);
                        },
                        disabled: !editing,
                      }),

                      React.createElement(
                        "div",
                        {
                          className: "d-flex justify-content-end mt-4",
                        },
                        React.createElement(
                          "button",
                          {
                            type: "button",
                            className: "btn btn-outline-danger btn-sm",
                            onClick: handleLogout,
                          },
                          "Logout",
                        ),
                      ),
                    ),
                  ),

                  // hidden submit for Enter
                  React.createElement("button", {
                    type: "submit",
                    className: "d-none",
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

export default Profile;
