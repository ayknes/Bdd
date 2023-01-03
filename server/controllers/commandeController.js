const mysql = require("mysql");

const moment = require("moment");
//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");

// Read HTML Template
var html = fs.readFileSync(
	path.join(__dirname, "../../views/invoice.hbs"),
	"utf8"
);
 



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
	connection.query("SELECT * FROM commande", (err, rows) => {
		// When done with the connection, release it
		if (!err) {
			// let removedUser = req.query.removed;
			// res.render("home", { rows, removedUser });
			res.render("listCommandes", { rows });
		} else {
			console.log(err);
		}
		console.log("The data from commande table: \n", rows);
	});
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
	connection.query("SELECT * FROM article", (err, rows) => {
		// When done with the connection, release it
		if (!err) {
			// let removedUser = req.query.removed;
			// res.render("home", { rows, removedUser });

			connection.query("SELECT * FROM client", (err2, rows2) => {
				// When done with the connection, release it
				if (!err) {
					// let removedUser = req.query.removed;
					// res.render("home", { rows, removedUser });
					res.render("add-commande", { rows, rows2 });
				} else {
					console.log(err2);
				}
			});
		} else {
			console.log(err);
		}
	});
};

// Add new user
exports.create = (req, res) => {
	const {
		status,
		date,
		dispatchedDate,
		noParcel,
		pointsGagne,
		articles,
		client,
	} = req.body;
	// User the connection
	console.log(articles);
	connection.query(
		"INSERT INTO commande SET status = ?, date = ?, dispatchedDate = ?, noParcel = ?, pointsGagne = ?, noclient = ?, totalCommande= 0;",
		[status, date, dispatchedDate, noParcel, pointsGagne, client],
		(err, rows) => {
			if (!err) {
				articles.forEach((article) => {
					connection.query(
						"select noCommande from commande where noclient=? and date = ?  ;",
						[client, date],
						(err2, commande) => {
							const noCommande = commande[0]["noCommande"];
							connection.query(
								"INSERT INTO commandeArticle SET noCommande = ?, noArticle = ?, qteArticle = 1, prixUnitaire = ?, remarque = '', articleStatus = 'other';",
								[noCommande, article, 101], //TODO : retreive the Prix of each product
								(err3, rows2) => {
									if (!err3) {
									} else {
										console.log(err3);
									}
								}
							);
						}
					);
				});

				res.render("add-commande", {
					alert: "commande added successfully.",
				});
			} else {
				console.log(err);
			}
			console.log("The data from commande table: \n", rows);
		}
	);
};

// Edit user
exports.edit = (req, res) => {
	// User the connection
	connection.query(
		"SELECT * FROM commande natural join commandeArticle natural join article  WHERE noCommande=?",
		[req.params.id],
		(err, rows) => {
			if (!err) {
				console.log(rows);
				const noCommande = rows[0]["noCommande"];
				const date = moment(rows[0]["date"]).utc().format("YYYY-MM-DD");

				const status = rows[0]["status"];
				const dispatchedDate = moment(rows[0]["dispatchedDate"])
					.utc()
					.format("YYYY-MM-DD");
				const noParcel = rows[0]["noParcel"];
				const pointsGagne = rows[0]["pointsGagne"];

				connection.query(
					"select * from article  ;",
					(err2, articles) => {
						res.render("edit-commande", {
							noCommande,
							date,
							status,
							dispatchedDate,
							noParcel,
							pointsGagne,
							rows,
							articles,
						});
					}
				);
			} else {
				console.log(err);
			}
			// console.log("The data from commande table: \n", rows);
		}
	);
};

//TODO: dnt forget to update the update date
// // Update User
// exports.update = (req, res) => {
// 	const {
// 		nomClient,
// 		adresse,
// 		facebook,
// 		instagram,
// 		email,
// 		phone,
// 		idMembership,
// 		points,
// 		expiryDate
// 	} = req.body;
// 	// User the connection
// 	connection.query(
// 		"UPDATE client SET  nomClient = ?, adresse = ?, facebook = ?, instagram = ?, email = ?,phone = ? WHERE noclient = ?;",
// 		[nomClient, adresse, facebook, instagram, email, phone, req.params.id],
// 		(err, rows) => {
// 			if (!err) {
// 				// User the connection
// 				connection.query(
// 					"SELECT * FROM client WHERE noclient = ?",
// 					[req.params.id],
// 					(err, rows) => {
// 						// When done with the connection, release it

// 						if (!err) {
// 							res.render("edit-client", {
// 								rows,
// 								alert: `${nomClient} has been updated.`,
// 							});
// 						} else {
// 							console.log(err);
// 						}
// 						console.log("The data from client table: \n", rows);
// 					}
// 				);
// 			} else {
// 				console.log(err);
// 			}
// 			console.log("The data from user table: \n", rows);
// 		}
// 	);
// };

// Delete User
exports.delete = (req, res) => {
	// Delete a record

	connection.query(
		"DELETE FROM commandeArticle WHERE noCommande = ?",
		[req.params.id],
		(err, rows) => {
			if (!err) {
				connection.query(
					"DELETE FROM commande WHERE noCommande = ?",
					[req.params.id],
					(err2, rows2) => {
						if (!err2) {
							res.redirect("/all");
						} else {
							console.log(err2);
						}
					}
				);
			} else {
				console.log(err);
			}
			console.log("The data from user table: \n", rows);
		}
	);

	// Hide a record
};

// View Users
exports.viewall = (req, res) => {
	// User the connection
	connection.query(
		"SELECT * FROM commande natural join commandeArticle natural join article inner join client on client.noClient = commande.noclient WHERE noCommande=?",
		[req.params.id],
		(err, rows) => {
			if (!err) {
				console.log(rows);

				res.render("view-commande", { rows });
			} else {
				console.log(err);
			}
			console.log("The data from commande table: \n", rows);
		}
	);
};


exports.getInvoice = (req, res) => {
	// User the connection
	
	

	connection.query(
		"SELECT * FROM commande natural join commandeArticle natural join article inner join client on client.noClient = commande.noclient WHERE noCommande=?",
		[req.params.id],
		(err, rows) => {
			if (!err) {
				var options = {
					format: "A4",
					orientation: "portrait",
					border: "10mm",
				};
				var document = {
					html: html,
					data: {
						rows: rows,
					},
					path: "./facture.pdf",
					type: "",
				};
				pdf.create(document, options)
					.then((ress) => {
						res.redirect("/all");
						console.log(res);
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				console.log(err);
			}
		}
	);
	
};
