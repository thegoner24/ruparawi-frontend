"use client";
import { useState } from 'react';

export default function EditProfileForm({ profile, onUpdate, loading }) {
  const [formData, setFormData] = useState({
    // Auth data (readonly, just for display)
    user_id: profile.user_id || '',
    email: profile.email || '',
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    
    // Vendor profile data (editable)
    phone_number: profile.phone_number || '',
    address: profile.address || '',
    profile_image_url: profile.profile_image_url || null,
    business_type: profile.business_type || '',
    registration_number: profile.registration_number || ''
  });

  const [imagePreview, setImagePreview] = useState(profile.profile_image_url);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        
        // In a real app, you'd upload this file to your server or cloud storage
        // and get back a URL to store in profile_image_url
        // For now, we'll just use the data URL in the preview
        setFormData({...formData, profile_image_url: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  // Calculate profile completion
  const requiredFields = ['phone_number', 'address'];
  const optionalFields = ['profile_image_url', 'business_type', 'registration_number'];
  const completedRequired = requiredFields.filter(field => formData[field]).length;
  const completedOptional = optionalFields.filter(field => formData[field]).length;
  const completionPercentage = Math.round(
    ((completedRequired / requiredFields.length) * 0.7 + 
     (completedOptional / optionalFields.length) * 0.3) * 100
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Completion */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Profile Completion: {completionPercentage}%</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-black h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-900 transition">
          Upload Photo
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User ID (readonly) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="user_id">
            Vendor ID
          </label>
          <input
            id="user_id"
            name="user_id"
            type="text"
            value={formData.user_id}
            readOnly
            className="border border-gray-300 bg-gray-50 rounded-none px-6 py-4 w-full text-lg text-black outline-none"
          />
        </div>
        
        {/* Email (readonly) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="border border-gray-300 bg-gray-50 rounded-none px-6 py-4 w-full text-lg text-black outline-none"
          />
        </div>

        {/* First Name (readonly from auth) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="first_name">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            readOnly
            className="border border-gray-300 bg-gray-50 rounded-none px-6 py-4 w-full text-lg text-black outline-none"
          />
        </div>

        {/* Last Name (readonly from auth) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="last_name">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            readOnly
            className="border border-gray-300 bg-gray-50 rounded-none px-6 py-4 w-full text-lg text-black outline-none"
          />
        </div>

        {/* Phone Number (editable) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>

        {/* Business Type (editable) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="business_type">
            Business Type
          </label>
          <select
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
          >
            <option value="">Select business type</option>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Registration Number (editable) */}
        <div>
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="registration_number">
            Registration Number
          </label>
          <input
            id="registration_number"
            name="registration_number"
            type="text"
            value={formData.registration_number || ''}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
          />
        </div>

        {/* Address (editable) */}
        <div className="col-span-2">
          <label className="uppercase text-base tracking-wider text-gray-700 mb-1 block" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-fit px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition disabled:opacity-70"
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </form>
  );
}
