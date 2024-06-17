const Listing = require("./models/listing.js");
const   Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// listing validation middleware
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }

};

// weather the user is logged in to the page or not middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // redirectUrl save 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

// if the user is signup the directly redirect to the loggedin middleware--- no need to logged in for another time
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// whether the user is the owner of the listing or not middleware
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         // Create an error object
//         const validationError = new ExpressError(400, error);

//         // Pass the error to the next middleware
//         return next(validationError);
//     } else {
//         next();
//     }
// };

// validation review middleware
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(error);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};