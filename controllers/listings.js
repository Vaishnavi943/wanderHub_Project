const Listing = require("../models/listing.js");

// index listing route-
module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings })
};

// new listing render-
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};

// show listing route-
module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path : "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    };
    res.render("listings/show.ejs", { listing })
});

// create new listing route
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    let savedListing = await newListing.save();
    // console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// render edit form of listing-
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    };

    let originalImageUrl =  listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250" );
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

// Update route (updates listing details)  
module.exports.updateListing =  async(req,res)=>{ 
    let {id} = req.params; 
    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing ); 
      
    if(typeof req.file !== "undefined"){ 
        let url = req.file.path; 
        let filename = req.file.filename; 
        updatedListing.image = {url,filename}  
        await updatedListing.save(); 
    } 
    req.flash("success","Listing Updated !!") 
    res.redirect(`/listings/${id}`) 
};

// delete listing route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};