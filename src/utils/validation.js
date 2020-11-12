const Joi = require('joi');

const registerValidation = (data) => {
	const schema = Joi.object({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

const createLinkTokenValidation = (data) => {
	const schema = Joi.object({
		client_id: Joi.string().required(),
		client_user_id: Joi.string().required(),
		secret: Joi.string().required(),
	});

	return schema.validate(data);
};

const createAccessTokenValidation = (data) => {
	const schema = Joi.object({
		client_id: Joi.string().required(),
		secret: Joi.string().required(),
		public_token: Joi.string().required(),
	});

	return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.createLinkTokenValidation = createLinkTokenValidation;
module.exports.createAccessTokenValidation = createAccessTokenValidation;
