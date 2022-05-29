/**
 * Dependencies
 */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

/**
 * Controllers
 */
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const storePostController = require('./controllers/storePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');

/**
 * Middleware
 */
const validateMiddleWare = require('./middleware/validationMiddleware');

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
app.use('/posts/store', validateMiddleWare);

app.get('/', homeController);

app.get('/post/:id', getPostController);

app.get('/posts/new', newPostController);

app.get('/auth/register', newUserController);

app.get('/auth/login', loginController);

app.post('/posts/store', storePostController);

app.post('/users/register', storeUserController);

app.post('/users/login', loginUserController);

app.listen(4000, () => {
	console.log('app listening on port 4000');
})