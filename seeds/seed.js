const Campground = require('../models/campgrounds');
const mongoose = require('mongoose');
const cities = require('./cities');
const titles = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/campgrounds')
	.then(msg => {
		console.log('PASS    Connected??')
	})
	.catch(error => {
		console.log('Failure    Something went wrong');
	})

const seedDB = async function () {
	await Campground.deleteMany({})
		.then(msg => {
			console.log('PASS	Deleted all database')
		})
		.catch(error => {
			console.log('Failure   Something went wrong deleting the database');
		});
	for (let i = 0; i < 25; i++) {
		const rand1000 = Math.floor(Math.random() * 1000);
		const rand18 = Math.floor(Math.random() * 18);
		const randPrice = Math.floor(Math.random() * 1000) + 1000;
		const camp = {
			location: `${cities[rand1000].city} ${cities[rand1000].state}`,
			geometry: {
				type: 'Point',
				coordinates:[
					cities[rand1000].longitude,
					cities[rand1000].latitude
				]
			},
			title: `${titles.descriptors[rand18]} ${titles.places[rand18]}`,
			price: randPrice,
			images: [{
				url: 'https://res.cloudinary.com/dhvjr5lyc/image/upload/v1686320769/YelpCamp/pxhea8fhhoitgib63rat.png',
				filename: 'YelpCamp/pxhea8fhhoitgib63rat',
			},
			{
				url: 'https://res.cloudinary.com/dhvjr5lyc/image/upload/v1686320770/YelpCamp/zwx6yf2pssqmb6rdp2pk.png',
				filename: 'YelpCamp/zwx6yf2pssqmb6rdp2pk',
			},
			{
				url: 'https://res.cloudinary.com/dhvjr5lyc/image/upload/v1686320772/YelpCamp/qxhlyhp8zbnr9oseg8kz.png',
				filename: 'YelpCamp/qxhlyhp8zbnr9oseg8kz',
			}],
			author: '647af8e72f091aef891ad70e',
			description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, eos fuga quis commodi aliquid rem soluta eum fugiat omnis enim corrupti inventore qui quod veniam eaque perferendis sunt explicabo animi Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem qui doloremque voluptatem deleniti quae modi laboriosam sed dolores, perspiciatis magni, voluptates architecto maiores perferendis labore totam unde, numquam facilis accusantium.`
		}
		await Campground.create(camp);
	}
}
seedDB()
	.then((msg) => {
		console.log('PASS    Seed Planted');
		mongoose.connection.close();
	})
	.catch(error => {
		console.log('Failure    Something went wrong', error);
		mongoose.connection.close();
	})