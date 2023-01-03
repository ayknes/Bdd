const mysql = require("mysql");

console.log(process.env.DB_HOST);
// Connection Pool
let connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
	// User the connection
	connection.query(
		'SELECT * FROM client',
		(err, rows) => {
			// When done with the connection, release it
			if (!err) {
				// let removedUser = req.query.removed;
				// res.render("home", { rows, removedUser });
                res.render("home", { rows });
			} else {
				console.log(err);
			}
			console.log("The data from client table: \n", rows);
		}
	);
};

// // Find User by Search
// exports.find = (req, res) => {
// 	let searchTerm = req.body.search;
// 	// User the connection
// 	connection.query(
// 		"SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
// 		["%" + searchTerm + "%", "%" + searchTerm + "%"],
// 		(err, rows) => {
// 			if (!err) {
// 				res.render("home", { rows });
// 			} else {
// 				console.log(err);
// 			}
// 			console.log("The data from user table: \n", rows);
// 		}
// 	);
// };

exports.form = (req, res) => {
	res.render("add-client");
};

// Add new user
exports.create = (req, res) => {
	const {
		nomClient,
		adresse,
		facebook,
		instagram,
		email,
		phone,
		idMembership,
		points,
		expiryDate,
	} = req.body;
	// User the connection
	console.log(req.body);
	connection.query(
		//TODO : search the added client id and then add to clientmembership table the points and expiryDate
		"INSERT INTO client SET nomClient = ?, adresse = ?, facebook = ?, instagram = ?, email = ?,phone = ?;",
		[nomClient, adresse, facebook, instagram, email, phone],
		(err, rows) => {
			if (!err) {
				res.render("add-client", {
					alert: "Client added successfully.",
				});
			} else {
				console.log(err);
			}
			console.log("The data from user table: \n", rows);
		}
	);
};

// Edit user
exports.edit = (req, res) => {
	// User the connection
	connection.query(
		"SELECT * FROM client natural join clientmembership WHERE noclient=?",
		[req.params.id],
		(err, rows) => {
			if (!err) {
				res.render("edit-client", { rows });
			} else {
				console.log(err);
			}
			console.log("The data from client table: \n", rows);
		}
	);
};

// Update User
exports.update = (req, res) => {
	const {
		nomClient,
		adresse,
		facebook,
		instagram,
		email,
		phone,
		idMembership,
		points,
		expiryDate
	} = req.body;
	// User the connection
	connection.query(
		"UPDATE client SET  nomClient = ?, adresse = ?, facebook = ?, instagram = ?, email = ?,phone = ? WHERE noclient = ?;",
		[nomClient, adresse, facebook, instagram, email, phone, req.params.id],
		(err, rows) => {
			if (!err) {
				// User the connection
				connection.query(
					"SELECT * FROM client WHERE noclient = ?",
					[req.params.id],
					(err, rows) => {
						// When done with the connection, release it

						if (!err) {
							res.render("edit-client", {
								rows,
								alert: `${nomClient} has been updated.`,
							});
						} else {
							console.log(err);
						}
						console.log("The data from client table: \n", rows);
					}
				);
			} else {
				console.log(err);
			}
			console.log("The data from user table: \n", rows);
		}
	);
};

// // Delete User
// exports.delete = (req, res) => {
// 	// Delete a record

// 	// User the connection
// 	// connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

// 	//   if(!err) {
// 	//     res.redirect('/');
// 	//   } else {
// 	//     console.log(err);
// 	//   }
// 	//   console.log('The data from user table: \n', rows);

// 	// });

// 	// Hide a record

// 	connection.query(
// 		"UPDATE user SET status = ? WHERE id = ?",
// 		["removed", req.params.id],
// 		(err, rows) => {
// 			if (!err) {
// 				let removedUser = encodeURIComponent(
// 					"User successeflly removed."
// 				);
// 				res.redirect("/?removed=" + removedUser);
// 			} else {
// 				console.log(err);
// 			}
// 			console.log("The data from beer table are: \n", rows);
// 		}
// 	);
// };

// // View Users
// exports.viewall = (req, res) => {
// 	// User the connection
// 	connection.query(
// 		"SELECT * FROM user WHERE id = ?",
// 		[req.params.id],
// 		(err, rows) => {
// 			if (!err) {
// 				res.render("view-user", { rows });
// 			} else {
// 				console.log(err);
// 			}
// 			console.log("The data from user table: \n", rows);
// 		}
// 	);
// };
