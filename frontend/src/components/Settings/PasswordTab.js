import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const PasswordTab = ({
  passwordData,
  onPasswordChange,
  onSubmit,
  saving
}) => {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Change Password</h2>
      
      <form onSubmit={onSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={onPasswordChange}
            required
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={onPasswordChange}
            required
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
          />
          <p className="text-xs text-slate-500">Minimum 6 characters</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={onPasswordChange}
            required
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordTab;