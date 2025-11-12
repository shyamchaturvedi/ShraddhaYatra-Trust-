import React, { useState } from 'react';
import Spinner from './Spinner';

interface LoginViewProps {
  onLogin: (phone: string, pass: string) => Promise<void>;
  loginError: string;
  setView: (view: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, loginError, setView }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onLogin(phone, password);
        setIsLoading(false);
    }

    return (
    <div className="flex items-center justify-center min-h-[70vh] bg-amber-50 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-900">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to continue your spiritual journey</p>
        </div>
        <form className="space-y-6" onSubmit={submitLogin}>
            <div>
            <label className="text-sm font-bold text-gray-700 tracking-wide">Mobile Number</label>
            <input
                className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="text"
                placeholder="Enter your 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
            />
            </div>
            <div>
            <label className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
            <input
                className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
            />
            </div>
            {loginError && <p className="text-sm text-center text-red-600">{loginError}</p>}
            <div>
            <button type="submit" className="w-full flex justify-center items-center bg-orange-500 text-white p-3 rounded-md tracking-wide font-semibold cursor-pointer hover:bg-orange-600 transition-colors disabled:bg-orange-300" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Sign In'}
            </button>
            </div>
        </form>
         <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => setView('register')} className="font-medium text-orange-600 hover:underline">
              Register here
            </button>
          </p>
        </div>
    </div>
    );
};

export default LoginView;