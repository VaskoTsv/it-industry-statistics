const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('./middleware/cors.js');

const app = express();

// Add middleware
app.use(cors);
app.use(express.json({extended: true}));

// App routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes.js'));
app.use('/api/company', require('./routes/company.routes'));

async function connectDb() {
    try {
        mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    } catch (e) {
        console.log('Server error: ', e.message);
        process.exit(1);
    }
}

connectDb();

const PORT = config.get('port') || 5000;
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))


