const path = require('path');
const BlogPost = require('../models/BlogPost');

module.exports = (req, res) => {
    let image = req.files.image;
    let uploadPath = __dirname + '../public/assets/img' + image.name;
    image.mv(path.resolve(uploadPath), async (err) => {
        await BlogPost.create({
            ...req.body,
            image: '/assets/img' + image.name,
            userid: req.session.userId
        });
        res.redirect('/');
    })
}