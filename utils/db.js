import mongoose from 'mongoose';
import keys from '../configs/keys.js';

const setupDB =()=>{
  mongoose.connect(keys.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=> console.log('MongoDB connected'))
  .catch((err)=> console.log(err));
}

export default setupDB;
