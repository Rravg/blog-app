const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const BlogPost = require('./models/BlogPost');

mongoose.connect('mongodb://localhost:27017/my_database', {
	family: 4
})
	.then(() => console.log("database conection succesfull"))
	.catch(err => console.log(err));

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.listen(4000, () => {
	console.log('app listening on port 4000');
})

app.get('/', async (req, res) => {
	const blogposts = await BlogPost.find({});
	res.render('index', { blogposts });
})

app.get('/about', (req, res) => {
	res.render('about');
})

app.get('/contact', (req, res) => {
	res.render('contact');
})

app.get('/post/:id', async (req, res) => {
	const blogpost = await BlogPost.findById(req.params.id);
	res.render('post', { blogpost });
})

app.get('/posts/new', (req, res) => {
	res.render('create');
})

app.post('/posts/store', (req, res) => {
	let image = req.files.image;
	image.mv(path.resolve(__dirname, 'public/assets/img', image.name), async (error) => {
		await BlogPost.create({
			...req.body,
			image: '/assets/img/' + image.name
		});
		res.redirect('/');
	})
})