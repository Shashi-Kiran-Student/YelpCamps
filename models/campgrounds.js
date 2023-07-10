/////////////////////////////////////////////////////////////////
///////All The Requirements and Dependencies Are Here////////////
/////////////////////////////////////////////////////////////////
const express = require('express');
const { func } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});
const opts = {toJSON:{virtuals:true}}

imageSchema.virtual('thumb')
    .get(function () {
        return this.url.replace('/upload', '/upload/w_200');
    })

const campgroundSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    images: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

// const campgroundSchema = new Schema(campSchema)

campgroundSchema.virtual('properties.popup')
    .get(function () {
        return `<a href="/campgrounds/${this.id}">'${this.title}'</a>`
    })

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;