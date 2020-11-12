const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//Model
const User = require('../models/User');

router.get('/allergies', auth, async (req, res) => {
	try {
		res.send({
			createdAt: '2014-10-19T21:02:17.949Z',
			id: '544323ae5b48098829dcc437',
			name: 'Oxycodone',
			organization: {
				href: '/medical/organizations/53c050ac51c69003200aa998',
				id: '53c050ac51c69003200aa998',
				name: 'Cleveland Clinic',
			},
			patient: {
				name: 'Maxwell Forrest',
			},
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
