import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import back from '../assets/images/register.webp';
import { useAuth } from '../contexts/authContext';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
      <Icon className="h-4 w-4" />
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 bg-black/30 backdrop-blur-sm border-2 border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-red-400 placeholder-gray-400"
    />
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Left Side - Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[30vh] lg:min-h-screen order-1">
        <img 
          src={back}
          alt="Anime Character" 
          className="w-full h-full object-cover"
        />
        {/* Overlay gradients - Adjusted for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-black/95 min-h-[100vh] lg:min-h-screen order-2">
        {/* Red energy effects - Adjusted for mobile */}
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-red-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-red-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700" />

        <div className="w-full max-w-md p-4 md:p-8 relative z-10">
          <div className="mb-6 md:mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">
              Join The Battle
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-800 mx-auto rounded-full" />
            <p className="mt-4 text-gray-400 text-center font-medium">
              Begin your legend
            </p>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 md:p-4 rounded-xl bg-red-900/50 backdrop-blur-sm border border-red-500/50 text-red-200 animate-shake text-sm md:text-base">
                {error}
              </div>
            )}

            <div className="space-y-3 md:space-y-4">
              <Input
                icon={User}
                type="text"
                placeholder="Choose your username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />

              <Input
                icon={Mail}
                type="email"
                placeholder="Your email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  icon={Lock}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 border border-red-500/50 shadow-lg shadow-red-500/20 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Awakening Power...
                </>
              ) : (
                'Begin Your Journey'
              )}
            </button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm md:text-base font-medium text-gray-400 hover:text-red-400 transition-colors duration-200 hover:underline"
              >
                Already a warrior? Return to battle
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Divider Line - Only visible on desktop */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />
    </div>
  );
};

export default Register;
