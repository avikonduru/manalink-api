const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//Import Routes
const authRoute = require('./routes/auth');
const accessRoute = require('./routes/access');
const clinicalRoute = require('./routes/clinical');
const connectRoute = require('./routes/connect');

dotenv.config();

//Connect Database
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());

//Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/access', accessRoute);
app.use('/api/clinical', clinicalRoute);
app.use('/api/connect', connectRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
