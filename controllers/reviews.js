const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// to create review
module.exports.createReview = async (req, res) => {
    let {id}= req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    console.log(req.body.reviews);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save()
    req.flash("success", "New Reviews Created!")
    res.redirect(`/listings/${listing._id}`);   
};

// delete review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Reviews Deleted!")
    res.redirect(`/listings/${id}`)
};