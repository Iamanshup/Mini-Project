const express = require("express");
const mongoose = require("mongoose");
const router = express();
const Boat = mongoose.model("Boats");
const passport = require("passport");
const {
  ensureAuthenticated
} = require("../helpers/auth");
router.route("/add").get(ensureAuthenticated, (req, res) => {
  if (!req.user.isAdmin) {
    req.flash(
      "error_msg",
      "You are not authorized to do that."
    );
    return res.redirect("/");
  }
  res.render("boats/add");
});
router
  .route("/")
  // .get((req, res) => {
  //   Boats.find().then(boats => {
  //     res.render("boats/index", {
  //       boats: boats
  //     });
  //   });
  // })

  .post(ensureAuthenticated, (req, res) => {
    const newBoat = new Boat({
      owner_name: req.body.owner_name,
      boat_number: req.body.boat_number,
      capacity: req.body.capacity,
    });
    newBoat
      .save()
      .then(newBoat => {
        console.log(newBoat);
        req.flash(
          "success_msg",
          "Congrats, new Boat Added."
        );
        res.redirect("/dashboard");
      })
      .catch(err => {
        req.flash(
          "error_msg",
          "Some error occurred. Please check all the fields."
        );
        res.redirect("/boats/add");
      });
  });
// router
//   .route("/login")
//   .get((req, res) => {
//     res.render("users/login");
//   })
//   .post((req, res, next) => {
//     passport.authenticate("local", {
//       successRedirect: "/dashboard",
//       failureRedirect: "/users/login",
//       failureFlash: true
//     })(req, res, next);
//   });

// router.get("/logout", ensureAuthenticated, (req, res) => {
//   req.logout();
//   req.flash("success_msg", "You are logged out");
//   res.redirect("/");
// });
module.exports = router;