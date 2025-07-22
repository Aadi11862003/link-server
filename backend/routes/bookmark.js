import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

const fetchdata = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $('title').text();
    const ogTitle = $('meta[property="og:title"]').attr('content') || title;
    const favicon = $('link[rel="icon"]').attr('href') || '/favicon.ico';
    const fullFavicon = favicon.startsWith('http') ? favicon : new URL(favicon, url).href;
    return { title: ogTitle, favicon: fullFavicon };
};

const getSummary = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const paragraphs = $('p').map((i, el) => $(el).text()).get();
        const summary = paragraphs.slice(0, 3).join(' ').trim();
        return summary || 'Summary not found';
    } catch (err) {
        console.error('Error in getSummary:', err.message);
        return 'Summary fetch failed';
    }
};

// POST: Add bookmark
router.post('/add', async (req, res) => {
    const { url } = req.body;
    try {
        const { title, favicon } = await fetchdata(url);
        const summary = await getSummary(url);
        const bookmark = await Bookmark.create({ url, title, favicon, summary });
        res.json(bookmark);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add bookmark' });
    }
});

// GET: Fetch all bookmarks
router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// DELETE: Delete a bookmark by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Bookmark.findByIdAndDelete(id);
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

export default router;
