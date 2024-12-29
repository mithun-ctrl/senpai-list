import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import api from '../utils/api';
import { User, Mail, Lock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {Input, Card, Button, Alert} from '../components/ProfileComponents';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await api.put('/auth/profile', updateData);
      toast.success('Profile updated successfully!');
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-red-400">Profile Settings</h1>
        <p className="mt-2 text-gray-400">
          Configure your account settings and preferences in the darkness.
        </p>
      </div>

      {message.text && (
        <Alert type={message.type}>{message.text}</Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card 
          title="Personal Information" 
          description="Update your personal details and contact information."
        >
          <div className="space-y-4">
            <Input
              icon={User}
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <Input
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </Card>

        <Card title="Security">
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Change your password or update your security settings.
            </p>

            <Input
              icon={Lock}
              type="password"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="New password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
            />
          </div>
        </Card>

        <Button type="submit" isLoading={isLoading}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Profile;