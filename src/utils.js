const Config = require('./models/config.js');
const webshot = require('node-webshot');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./storage/")
	},
	filename: (req, file,cb) => {
		cb(null, file.filename)
	}
});
const fileFilter = (req, file, cb) => {
	if(file.mimeType === "image/jpeg" || file.mimeType === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: fileFilter
});

exports.jobs = {};
exports.setPeriodicSS = (id, url, period) => {
	// set periodic job
	exports.jobs[id] = setInterval(() => {
		const currentTimestamp = new Date().valueOf();
		const imageName = "storage/" + id + "/" + currentTimestamp + ".png";
		webshot(url, imageName, function(err) {
			if(err != null) {
				console.error(err);
			} else {
				Config.findOneAndUpdate({ _id: id }, { $push: { images: imageName } }, console.log);
				upload.single(imageName);
				console.log(imageName + " uploaded");
			}
		});
	}, period);
};
exports.startPeriodicSS = async () => {
	try {
		const configs =	await Config.find({});
		console.log("startPeriodicSS");
		configs.forEach(({ _id, url, period }) => exports.setPeriodicSS(_id, url, period));
	} catch (e) {
		console.error(e);
	}
};