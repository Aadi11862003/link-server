import mongoose from 'mongoose';
const bookmarkSchema = new mongoose.Schema({
    url:String,
    title:String,
    favicon:String,
    summary:String,
    createdAt:{type:Date,default:Date.now},
});

const Bookmark = mongoose.model('Bookmark',bookmarkSchema);
export default Bookmark;