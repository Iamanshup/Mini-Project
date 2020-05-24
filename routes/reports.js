const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Item = mongoose.model("Items");
const Boat = mongoose.model("Boats");
const {
  ensureAuthenticated
} = require("../helpers/auth");
router.route("/").get(ensureAuthenticated, (req, res) => {
    if (!req.user.isAdmin) {
      req.flash(
        "error_msg",
        "You are not authorized to do that."
      );
      return res.redirect("/");
    }
    res.render("reports/search");
  })
  .post(ensureAuthenticated, (req, res) => {
    if (!req.user.isAdmin) {
      req.flash(
        "error_msg",
        "You are not authorized to do that."
      );
      return res.redirect("/");
    }
    // console.log(req.body);
    let report = req.body.report;
    let start_date = new Date(req.body.start_date).toISOString();
    let end_date = new Date(req.body.end_date).toISOString()

    console.log(report, start_date, end_date);
    if (report == "boats") {
      Boat.find({
        date_created: {
          $gte: start_date,
          $lte: end_date
        }
      }).then(boats => {
        console.log(boats);
        res.render("reports/results", {
          boats: boats
        });
      });
    } else if (report == "items") {
      Item.find({
        date_created: {
          $gte: start_date,
          $lte: end_date
        }
      }).then(items => {
        console.log(items);
        res.render("reports/results", {
          items: items
        });
      });
    }
  });
// router.route("/about").get((req, res) => {
//   res.render("index/about");
// });

// router.route("/dashboard").get(ensureAuthenticated, (req, res) => {
//   Item.find({ user: req.user.id }).then(items => {
//     res.render("index/dashboard", {
//       items: items
//     });
//   });
// });

// router.route("/about").get((req, res) => {
//   res.send("index/about");
// });
module.exports = router;