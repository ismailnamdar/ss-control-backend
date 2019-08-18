const express = require('express');
const status = require('http-status');
const Config = require('../models/config.js');
const { jobs, setPeriodicSS } = require('../utils');
const router = express.Router();

router.get('/config', async (req, res) => {
	try {
		const config = await Config.find({...req.body});
		res.status(200).json(config);
	} catch (e) {
		res.send(status[500]);
	}
});

router.post('/config', async (req, res) => {
	try {
		const { url, period } = req.body;
		if(Number.isInteger(period) && period >= 5000) {
			const config = await Config.create({ url, period });
			setPeriodicSS(config._id, url, period);
			res.status(200).json(config);
		} else {
			res.status(400).send("period must be integer and cant be lower than 5000 ms");
		}
	} catch(err) {
		res.send(status[500]);
	}
});

// TODO: delete images when deleted
router.delete('/config', async (req, res) => {
	try  {
		const { id } = req.body;
		const result = await Config.remove(id);
		clearInterval(jobs[id]);
		delete jobs[id];
		res.status(200).json(result);
	} catch (e) {
		console.error(e);
		res.send(status[500]);
	}
});

module.exports = router;