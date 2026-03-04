import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ImageUploader from '../Common/ImageUploader';
import { DEPARTMENTS } from '../../utils/constants';

const ProfileInfoTab = ({
  formData,
  onInputChange,
  onSave,
  onUploadProfile,
  onUploadCover,
  uploading,
  saving
}) => {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Profile Information</h2>
      
      <form onSubmit={onSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uploads */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Profile Picture
              </label>
              <ImageUploader
                currentImage={formData.profilePicture}
                onUpload={onUploadProfile}
                type="profile"
                isUploading={uploading.profile}
                maxSize={2}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Cover Picture
              </label>
              <ImageUploader
                currentImage={formData.coverPicture}
                onUpload={onUploadCover}
                type="cover"
                isUploading={uploading.cover}
                maxSize={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={onInputChange}
              placeholder="City, Country"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={onInputChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={onInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileInfoTab;