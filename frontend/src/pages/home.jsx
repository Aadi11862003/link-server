// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import API from '../api';

const Home = () => {
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get('/bookmark');
      setBookmarks(res.data);
    } catch (err) {
      alert('Error fetching bookmarks');
    }
  };

  const handleAdd = async () => {
    try {
      await API.post('/bookmark/add', { url });
      setUrl('');
      fetchBookmarks();
    } catch (err) {
      alert('Failed to add');
    }
  };

const handleDelete = async (id) => {
  try {
    await API.delete(`/bookmark/${id}`);
    fetchBookmarks();
  } catch (err) {
    alert('Failed to delete');
  }
};


  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      <h2>Bookmark Dashboard</h2>
      <input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <div>
        {bookmarks.map((b) => (
          <div key={b._id} style={{ border: '1px solid gray', margin: '10px' }}>
            <p><b>Title:</b> {b.title}</p>
            <p><b>URL:</b> <a href={b.url} target="_blank">{b.url}</a></p>
            <p><b>Summary:</b> {b.summary}</p>
            <button onClick={() => handleDelete(b._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
