const express = require('express');
const configRoute = require('./routes/config');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const {startPeriodicSS} = require('./utils');

const dir = path.join(__dirname, 'storage');
const mongoose = require('mongoose');
// Connection URL
const url = 'mongodb://localhost:27017/ss-control';

// Use connect method to connect to the server
mongoose.connect(url, {useNewUrlParser: true});
const app = express();

app.use(cors({
	origin: 'http://localhost:3001'
}));
app.use(express.static(dir));
app.use('/storage', express.static('storage'));
app.use(bodyParser.json());
app.use((req, res, next) => {
	console.log(`Request comes from ${req.originalUrl} on ${new Date().toString()}`);
	next()
});
app.use(configRoute);
app.use(express.static('public'));
app.use((req, res, next) => {
	res.status(404).send('404 Not Found');
});
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.sendFile(path.join(__dirname, '../public/500.html'));
});
startPeriodicSS();

const PORT = process.env.POST || 3000;
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));