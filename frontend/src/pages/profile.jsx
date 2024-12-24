import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import api from '../utils/api';
import { User, Mail, Lock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast'

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
      <Icon className="h-4 w-4" />
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

const Button = ({ children, isLoading, ...props }) => (
  <button
    {...props}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        Processing...
      </>
    ) : (
      children
    )}
  </button>
);

const Alert = ({ type, children }) => (
  <div
    className={`p-4 rounded-lg ${
      type === 'success' 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}
  >
    {children}
  </div>
);

const Card = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    <div className="px-6 pb-6">{children}</div>
  </div>
);

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
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and set your preferences.
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
            <p className="text-sm text-gray-500 mb-4">
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