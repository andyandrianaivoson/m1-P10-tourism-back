import mongoose from 'mongoose';
import keys from '../configs/keys.js';

const setupDB = (app) => {
  mongoose.connect(keys.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('MongoDB connected');
      app.listen(keys.app.port, () => {
        console.log(`Server is listening on port ${keys.app.port}`);
      });
    })
    .catch((err) => console.log(err));
}

export default setupDB;
