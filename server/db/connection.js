const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/test-app');
        console.log(`MongoDB Connected with localhost:27017`);
    } catch (error) {
        console.error(`Error ${error}`);
    }
};

module.exports = connectDB; 