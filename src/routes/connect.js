const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
	const { link_token, institution_id } = req.body;

	try {
		const decoded_link_token = jwt.verify(link_token, process.env.TOKEN_SECRET);

		const payload = {
			user_id: decoded_link_token.user_id,
			institution_id: institution_id,
		};

		const public_token = jwt.sign(payload, process.env.TOKEN_SECRET, {
			expiresIn: 3600,
		});

		res.send({ public_token: public_token });
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
