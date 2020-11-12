const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const {
	createLinkTokenValidation,
	createAccessTokenValidation,
} = require('../utils/validation');

//Model
const Client = require('../models/Client');
const User = require('../models/User');

router.post('/get_link_token', async (req, res) => {
	//Validate incoming request
	const { error } = createLinkTokenValidation(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	//Validate client_id
	const client = await Client.findById(req.body.client_id);
	if (!client) {
		return res.status(400).send('Invalid request');
	}

	//Validate secret
	if (client.secret != req.body.secret) {
		return res.status(400).send('Invalid request');
	}

	//Create new user
	const user = new User({
		client_user_id: req.body.client_user_id,
		client_id: req.body.client_id,
	});

	try {
		//Create link token using JWT
		const link_token = jwt.sign(
			{ user_id: user.id },
			process.env.TOKEN_SECRET,
			{
				expiresIn: 3600,
			}
		);

		//Save user
		await user.save();

		res.send({
			tokenResponse: {
				link_token: link_token,
			},
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/get_access_token', async (req, res) => {
	//Validate incoming request
	const { error } = createAccessTokenValidation(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	//Validate clientId
	const client = await Client.findById(req.body.client_id);
	if (!client) {
		return res.status(400).send('Invalid request');
	}

	//Validate secret
	if (client.secret != req.body.secret) {
		return res.status(400).send('Invalid request');
	}

	//Validate public token
	const decoded_public_token = jwt.verify(
		req.body.public_token,
		process.env.TOKEN_SECRET
	);
	const user = await User.findById(decoded_public_token.user_id);
	if (!user) {
		return res.status(400).send('Invalid request');
	}

	try {
		user.institution_id = decoded_public_token.institution_id;
		user.item_id = nanoid();
		const updatedUser = await user.save();

		//Create access token
		const payload = {
			type: 'access',
			mode: 'sandbox',
			user: updatedUser,
		};
		const access_token = jwt.sign(payload, process.env.TOKEN_SECRET);

		res.send({
			tokenResponse: {
				access_token: access_token,
				item_id: updatedUser.item_id,
			},
			error: false,
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
