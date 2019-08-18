const mongoose = require('mongoose');

let ConfigSchema = new mongoose.Schema({
	url: {
		type: String,
		unique: true,
		required: true,
		maxLength: 1000
	},
	period: {
		type: Number,
		min: 5000,
		required: true
	},
	images: [{ type: String }]
});

let Config = mongoose.model('Config', ConfigSchema);

module.exports = {
	create: config => Config.create(config),
	find: query => Config.find(query),
	findById: id => Config.findById(id),
	remove: id => Config.deleteOne({ _id: id }).catch(err => console.error(err)),
	findOneAndUpdate: (query, update, cb = () => {}) => Config.findOneAndUpdate(query, update, { useNewUrlParser: true }, cb),
	Config,
};