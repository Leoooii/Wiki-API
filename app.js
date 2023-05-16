//jshint esversion:6
//////server

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

////database

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {
  useNewurlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model('Article', articleSchema);

/////////////////////Requests Targetting all Articles////////////

app
  .route('/articles')
  .get(function (req, res) {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(function () {
        res.send('Succesfully added a new article');
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany()
      .then(function () {
        res.send('Succesfully deleted all the articles');
      })
      .catch(function (err) {
        res.send(err);
      });
  });

/////////////////////Requests Targetting specific Articles////////////

app
  .route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }).then(function (
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('no articles matching the title was found');
      }
    });
  })
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    ).then(function () {
      res.send('Succesfully updated article');
    });
  })
  .patch(function (req, res) {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(function () {
        res.send('succesfullt updated article');
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(function () {
        res.send('succesfully deleted the coresponding article');
      })
      .catch(function (err) {
        res.send(err);
      });
  });

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
