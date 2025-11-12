import React, { useState } from 'react';
import Spinner from './Spinner';

interface RegisterViewProps {
  onRegister: (name: string, phone: string, pass: string) => Promise<boolean>;
  loginError: string;
  setView: (view: string) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, loginError, setView }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onRegister(name, phone, password);
        setIsLoading(false);
    }

    return (
    <div className="flex items-center justify-center min-h-[70vh] bg-amber-50 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-900">Create Your Account</h1>
            <p className="text-gray-600">Join our community of devotees</p>
        </div>
        <form className="space-y-6" onSubmit={submitRegister}>
            <div>
                <label className="text-sm font-bold text-gray-700 tracking-wide">Full Name</label>
                <input
                    className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-700 tracking-wide">Mobile Number</label>
                <input
                    className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10}"
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
                <input
                    className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    disabled={isLoading}
                />
            </div>
            {loginError && <p className="text-sm text-center text-red-600">{loginError}</p>}
            <div>
                <button type="submit" className="w-full flex justify-center items-center bg-orange-500 text-white p-3 rounded-md tracking-wide font-semibold cursor-pointer hover:bg-orange-600 transition-colors disabled:bg-orange-300" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'Register'}
                </button>
            </div>
        </form>
         <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="font-medium text-orange-600 hover:underline">
              Login here
            </button>
          </p>
        </div>
    </div>
    );
};

export default RegisterView;