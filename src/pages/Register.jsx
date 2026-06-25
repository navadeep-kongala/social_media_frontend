import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h2 className="text-center text-3xl font-extrabold text-slate-800">Get Started</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-600">Username</label>
            <input type="text" required className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-indigo-500" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Email Address</label>
            <input type="email" required className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-indigo-500" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input type="password" required className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700">Register</button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}