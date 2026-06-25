import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Posts() {
  const [posts, setPosts] = useState([]); // State to store posts from DB
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();

  // 1. Fetch posts from the backend database
  const fetchPosts = async () => {
    try {
      const res = await API.get('/api/v2/post'); // Assumes your router has a GET method on the base route
      // Handle variations in how your controller structures the data response
      setPosts(res.data.posts || res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  // Run on page load
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('description', description);
      formData.append('image', selectedFile);

      const res = await API.post('/api/v2/post/create', formData);
      alert(res.data.message || 'Post created successfully!');
      
      // Reset input fields
      setCaption('');
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);

      // 2. Refresh the feed immediately so the new post appears on screen
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating post');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 h-16 flex justify-between items-center">
          <span className="text-xl font-black text-indigo-600 tracking-wide">FEED</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Hi, <strong className="text-slate-800">{user?.username || 'User'}</strong></span>
            <button onClick={logout} className="rounded-lg bg-rose-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Grid Container */}
      <div className="mx-auto max-w-lg mt-8 px-4 space-y-8">
        
        {/* Form Panel */}
        <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Create a New Post</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Caption</label>
            <input 
              type="text" 
              placeholder="Give it a catchphrase..." 
              required 
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-indigo-500" 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea 
              placeholder="What's the story behind this picture?" 
              required 
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm h-24 resize-none outline-none focus:border-indigo-500" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Upload Post Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            
            {previewUrl && (
              <div className="mt-4 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex justify-center items-center">
                <img src={previewUrl} alt="Upload preview" className="object-contain max-h-64 w-full" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white text-sm font-semibold py-2.5 rounded-lg transition ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isSubmitting ? 'Uploading to ImageKit...' : 'Publish Post'}
          </button>
        </form>

        {/* 3. Output Feed Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Posts</h3>
          
          {posts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
              No posts to show yet. Be the first to publish!
            </p>
          ) : (
            posts.map((post) => (
              <div key={post._id || post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                {/* Render the ImageKit URL stored in the DB */}
                {post.image && (
                  <div className="bg-slate-50 border-b border-slate-100 flex justify-center items-center overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.caption} 
                      className="w-full h-auto object-cover max-h-96"
                      onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image fails to load
                    />
                  </div>
                )}
                
                {/* Post Content */}
                <div className="p-5 space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">{post.caption}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{post.discription || post.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}