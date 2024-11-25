import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://skycars-admin:HEH8ZtRbVN9oxOrG@skycars.1ceyw.mongodb.net/?retryWrites=true&w=majority&appName=SkyCars'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

export default mongoose 