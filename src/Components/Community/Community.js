import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Community.css';

const getAuthToken = () => {
    const saved = Cookies.get('homegate-token');
    if (!saved) return null;
    try {
        const parsed = JSON.parse(saved);
        return parsed?.token || saved;
    } catch {
        return saved;
    }
};

const dummyPosts = [
    {
        _id: 'demo-1',
        title: 'What’s the best food for a newly adopted dog?',
        content: 'I just adopted a dog from the shelter and I want to know what food is safe and healthy for the first few weeks. Should I change diet immediately or stick to the shelter food?',
        tags: ['dog', 'nutrition', 'adoption'],
        author: { name: 'Aarav' },
        upvotes: ['u1', 'u2', 'u3'],
        downvotes: [],
        comments: [
            {
                _id: 'c1',
                content: 'Start with the food the shelter used and slowly switch over 7-10 days. This helps avoid stomach upset.',
                author: { name: 'Neha' },
                createdAt: '2026-04-12T10:12:00.000Z'
            }
        ],
        createdAt: '2026-04-12T09:00:00.000Z'
    },
    {
        _id: 'demo-2',
        title: 'How can I stop my cat from scratching furniture?',
        content: 'I have a six-month-old cat and it keeps scratching the couch and curtains. Any advice on training or products that actually work?',
        tags: ['cat', 'behavior', 'training'],
        author: { name: 'Priya' },
        upvotes: ['u4', 'u5'],
        downvotes: ['u6'],
        comments: [
            {
                _id: 'c2',
                content: 'Use a scratching post and reward your cat when it uses the post. You can also cover furniture with a protective sheet for a few weeks.',
                author: { name: 'Rahul' },
                createdAt: '2026-04-11T15:30:00.000Z'
            },
            {
                _id: 'c3',
                content: 'Catnip on the post helps a lot, and trim the nails regularly.',
                author: { name: 'Simran' },
                createdAt: '2026-04-11T16:00:00.000Z'
            }
        ],
        createdAt: '2026-04-11T14:00:00.000Z'
    },
    {
        _id: 'demo-3',
        title: 'Is it safe to bathe a puppy every week?',
        content: 'My puppy gets dirty quickly. I heard bathing too often can harm their skin. How often should I bathe a puppy?',
        tags: ['puppy', 'health', 'care'],
        author: { name: 'Karan' },
        upvotes: ['u7'],
        downvotes: [],
        comments: [
            {
                _id: 'c4',
                content: 'Usually once a month is enough unless they get very dirty. Use a gentle puppy shampoo and dry them well.',
                author: { name: 'Meera' },
                createdAt: '2026-04-10T12:20:00.000Z'
            }
        ],
        createdAt: '2026-04-10T11:00:00.000Z'
    },
    {
        _id: 'demo-4',
        title: 'Can I mix dry and wet food for my senior dog?',
        content: 'My 10-year-old dog has some dental issues. Should I give a mix of wet and dry food or switch completely to soft food?',
        tags: ['senior-dog', 'food', 'health'],
        author: { name: 'Sana' },
        upvotes: ['u8', 'u9', 'u10', 'u11'],
        downvotes: [],
        comments: [
            {
                _id: 'c5',
                content: 'Mixing wet and dry food is good. Make sure the dry kibble is small and easy to chew, and check with your vet for any special diet.',
                author: { name: 'Vikram' },
                createdAt: '2026-04-09T08:50:00.000Z'
            }
        ],
        createdAt: '2026-04-09T08:00:00.000Z'
    },
    {
        _id: 'demo-5',
        title: 'How do I help a shy dog feel comfortable at home?',
        content: 'I adopted a rescue dog who is very scared of people and noise. What are the best steps to help build trust and confidence?',
        tags: ['rescue', 'behavior', 'comfort'],
        author: { name: 'Nisha' },
        upvotes: ['u12', 'u13'],
        downvotes: [],
        comments: [
            {
                _id: 'c6',
                content: 'Give them a safe space, move slowly, and use treats during calm moments. Avoid forcing attention until the dog chooses to come to you.',
                author: { name: 'Ankit' },
                createdAt: '2026-04-08T19:10:00.000Z'
            }
        ],
        createdAt: '2026-04-08T18:00:00.000Z'
    }
];

const Community = () => {
    const [posts, setPosts] = useState(dummyPosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedPost, setExpandedPost] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        const tokens = query.split(/\s+/).filter(Boolean);
        return tokens.some(token => {
            const titleMatch = post.title?.toLowerCase().includes(token);
            const contentMatch = post.content?.toLowerCase().includes(token);
            const tagMatch = (post.tags || []).some(tag => tag.toLowerCase().includes(token));
            const authorMatch = (post.author?.name || '').toLowerCase().includes(token);
            return titleMatch || contentMatch || tagMatch || authorMatch;
        });
    });

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/posts');
            if (Array.isArray(response.data) && response.data.length > 0) {
                setPosts([...response.data, ...dummyPosts]);
            }
        } catch (error) {
            setError('Failed to fetch posts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Please log in to post in the community.');
                setLoading(false);
                return;
            }
            const response = await axios.post('http://localhost:4000/api/posts', {
                ...newPost,
                tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : []
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts([response.data, ...posts]);
            setNewPost({ title: '', content: '', tags: '' });
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create post');
        }
        setLoading(false);
    };

    const handleVote = async (postId, type) => {
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Please log in to vote on posts.');
                return;
            }
            const response = await axios.post(`http://localhost:4000/api/posts/${postId}/${type}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to vote');
        }
    };

    const toggleExpanded = async (postId) => {
        if (expandedPost === postId) {
            setExpandedPost(null);
        } else {
            if (postId.startsWith('demo-')) {
                // For dummy posts, just expand without fetching
                setExpandedPost(postId);
            } else {
                try {
                    const response = await axios.get(`http://localhost:4000/api/posts/${postId}`);
                    setPosts(posts.map(post => post._id === postId ? response.data : post));
                    setExpandedPost(postId);
                } catch (error) {
                    setError('Failed to load comments');
                }
            }
        }
    };

    const handleCommentSubmit = async (postId, e) => {
        e.preventDefault();
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Please log in to comment.');
                return;
            }
            const response = await axios.post(`http://localhost:4000/api/posts/${postId}/comments`, { content: newComment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: [...post.comments, response.data] };
                }
                return post;
            }));
            setNewComment('');
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add comment');
        }
    };

    return (
        <div className="community-container">
            <h1>Pet Adoption Community</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search questions, answers, tags, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="new-post-form">
                <h2>Ask a Question</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Question Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Describe your question or share your experience..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Question'}
                    </button>
                </form>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="posts-list">
                {filteredPosts.length === 0 ? (
                    <div className="no-results">No community posts match your search.</div>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post._id} className="post-card">
                            <div className="post-votes">
                                <button onClick={() => handleVote(post._id, 'upvote')}>↑</button>
                                <span>{(post.upvotes || []).length - (post.downvotes || []).length}</span>
                                <button onClick={() => handleVote(post._id, 'downvote')}>↓</button>
                            </div>
                            <div className="post-content">
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <div className="post-tags">
                                    {(post.tags || []).map((tag) => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="post-author">
                                    By {(typeof post.author === 'string' ? post.author : post.author?.name) || 'Anonymous'} • {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <button onClick={() => toggleExpanded(post._id)} className="view-comments-btn">
                                    {expandedPost === post._id ? 'Hide Comments' : `View Comments (${(post.comments || []).length})`}
                                </button>
                                {expandedPost === post._id && (
                                    <div className="comments-section">
                                        <h4>Comments</h4>
                                        {(post.comments || []).length === 0 ? (
                                            <div className="comment empty-comment">
                                                <p>No comments yet. Be the first to answer this question!</p>
                                            </div>
                                        ) : (
                                            (post.comments || []).map((comment) => (
                                                <div key={comment._id} className="comment">
                                                    <p>{comment.content}</p>
                                                    <small>
                                                        By {comment.author?.name || 'Anonymous'} • {new Date(comment.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            ))
                                        )}
                                        <form onSubmit={(e) => handleCommentSubmit(post._id, e)} className="comment-form">
                                            <textarea
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                required
                                            />
                                            <button type="submit">Comment</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Community;