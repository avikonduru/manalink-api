const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');

//Model
const Client = require('../models/Client');

router.post('/register', async (req, res) => {
	//Validate incoming request
	const { error } = registerValidation(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	//Validate if email already exists
	const emailExist = await Client.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(400).send('Email given is already used');
	}

	//Hash password and secret
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//Create new client
	const client = new Client({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: hashedPassword,
		secret: nanoid(),
	});

	try {
		const newClient = await client.save();
		res.send(newClient);
	} catch (err) {
		res.status(400).send(err);
	}
});

// router.post('/login', async (req, res) => {
// 	//Validate incoming request
// 	const { error } = loginValidation(req.body);
// 	if (error) {
// 		return res.status(400).send(error.details[0].message);
// 	}

// 	//Validate if email already exists
// 	const client = await Client.findOne({ email: req.body.email });
// 	if (!client) {
// 		return res.status(400).send('Email or password is incorrect');
// 	}

// 	//Check if correct password
// 	const validPassword = await bcrypt.compare(
// 		req.body.password,
// 		client.password
// 	);
// 	if (!validPassword) {
// 		return res.status(400).send('Email or password is incorrect');
// 	}

// 	try {
// 		const decoded = jwt.verify({ id: client._id }, process.env.TOKEN_SECRET);
// 		res.header('auth-token', token).send(token);
// 	} catch (err) {
// 		res.status(400).send(err);
// 	}
// });

module.exports = router;
