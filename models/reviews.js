const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:String,
    rating:{
        type:Number
    },
    author:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;