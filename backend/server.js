import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import authRoutes from './routes/auth.js';
import bookmarkRoutes from './routes/bookmark.js';


dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());


connectDB();


// calling api
app.use('/api/auth',authRoutes);

app.use('/api/bookmark',bookmarkRoutes);


// calling all bookmarks
//app.use('/api/bookmarks', bookmarkRoutes); 



app.listen(port,()=>{
    console.log(`server is started on port ${port}`);
})