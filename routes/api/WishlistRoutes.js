const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const router = express.Router()
router.use(bodyParser.json());

const wishlistCollection = require("../../models/Wishlist");
const app = require('../../app');
const { routes } = require('../../app');

router.get("/:userId", (req, res) => {
    // retrieve all the wishlisted courses of user with userId provided in the url
    const userId = req.params.userId;
    wishlistCollection.find({userId: userId}).exec().then(result => {
        return res.status(200).json({
            success: true,
            wishlist: result
        });
    }).catch(error => {
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        })
    });
});

router.post("/add", (req, res) => {
    const wishlist = new wishlistCollection({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        courseId: req.body.courseId
    });
    wishlist.save().then(result => {
        return res.status(201).json({
            message: "Wishlist added.",
            success: true
        });
    }).catch(error => {
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        })
    });
});

router.get("/check/:userId/:courseId", (req, res) => {
    const userId = req.params.userId;
    const courseId = req.params.courseId;
    wishlistCollection.findOne({userId: userId, courseId: courseId}).exec().then(result => {
        return res.status(200).json({
            success: true,
            isWishlisted: (result!=null)
        });
    }).catch(error => {
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    });
});

router.delete("/:userId/:courseId", (req, res) => {
    // removes course with given courseId from the wishlist of user with provided userId
    const userId = req.params.userId;
    const courseId = req.params.courseId;
    wishlistCollection.deleteOne({userId: userId, courseId: courseId}).exec().then(result => {
        if(!result) {
            return res.status(404).json({
                message: "The selected course is not wishlisted.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Removed course from wishlist.",
            success: true
        });
    }).catch(error => {
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    })
});

module.exports = router