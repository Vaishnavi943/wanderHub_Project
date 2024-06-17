const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { Cursor } = require("mongoose");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    // .get(wrapAsync(listingController.index))
    // .post(isLoggedIn,validateListing,  wrapAsync(listingController.createListing));
    // .post(upload.single("listing[image]"), (req, res) => {
    //     res.send(req.file);
    // }); ye nhi use krna hai



// router.route("/id")
// .get(wrapAsync(listingController.showListing))
// .put( isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
// .delete( isLoggedIn,wrapAsync(listingController.destroyListing));


// Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

// Show Route
router.get("/:id", wrapAsync(listingController.showListing))

// Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

//Update Route 
router.put("/:id", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

// router.put("/:id", validateListing, wrapAsync(async(req,res)=>{
//     let{id}= req.params;
//     let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing )
//     req.flash("success","Listing Updated !!")
//     res.redirect(`/listings/${id}`)
// }));

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;