const userModel = require('../models/usermodel');

module.exports.verifyUser = (req, res) => {
	userModel.findOne({ confirmCode: req.params.confirmCode })
		.then((users) => {
			console.log("conformcode: " + confirmCode);
			console.log(users);
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.status = "Active";

			users.save((err) => {
		 		 if (err) {
					res.status(500).json({ message: err });
					return;
				  }
			});
		})
		.catch((e) => console.log("error", e));
};
