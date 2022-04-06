const Post = require("../models/post").Post;
const Category = require("../models/category").Category;
const Comment = require("../models/comment").Comment;

module.exports = {
  index: (req, res) => {
    res.render("staff/index");
  },

  /* ADMIN POSTS ENDPOINTS */

  getPosts: (req, res) => {
    Post.find()
      .lean()
      .populate("category")
      .then((posts) => {
        res.render("staff/posts/index", { posts: posts });
      });
  },

  getCreatePostPage: (req, res) => {
    Category.find()
      .lean()
      .then((cats) => {
        res.render("staff/posts/create", { categories: cats });
      });
  },

  submitCreatePostPage: (req, res) => {
    const commentsAllowed = !!req.body.allowComments;

    // Check for any input file

    let filename = "";
    if (req.files == null) {
      req.flash("error-message", "Post created successfully");
      return false;
    } else {
      let file = req.files.uploadedFile;
      filename = file.name;
      let uploadDir = "./public/uploads/";

      file.mv(uploadDir + filename, (err) => {
        if (err) throw err;
      });
    }

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      allowComments: commentsAllowed,
      category: req.body.category,
      file: `/uploads/${filename}`,
    });

    newPost.save().then((post) => {
      req.flash("success-message", "Post created successfully.");
      res.redirect("/staff/posts");
    });
  },

  getEditPostPage: (req, res) => {
    const id = req.params.id;

    Post.findById(id)
      .lean()
      .then((post) => {
        Category.find().then((cats) => {
          res.render("staff/posts/edit", { post: post, categories: cats });
        });
      });
  },

  submitEditPostPage: (req, res) => {
    const commentsAllowed = !!req.body.allowComments;
    const id = req.params.id;
    Post.findById(id)
      .lean()
      .then((post) => {
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = commentsAllowed;
        post.description = req.body.description;
        post.category = req.body.category;

        post.save().then((updatePost) => {
          req.flash(
            "success-message",
            `The Post ${updatePost.title} has been updated.`
          );
          res.redirect("/staff/posts");
        });
      });
  },

  deletePost: (req, res) => {
    Post.findByIdAndDelete(req.params.id)
      .lean()
      .then((deletedPost) => {
        req.flash(
          "success-message",
          `The post ${deletedPost.title} has been deleted.`
        );
        res.redirect("/staff/posts");
      });
  },

  /* ALL CATEGORY METHODS*/
  getCategories: (req, res) => {
    Category.find()
      .lean()
      .then((cats) => {
        res.render("admin/category/index", { categories: cats });
      });
  },

  createCategories: (req, res) => {
    let categoryName = req.body.name;

    if (categoryName) {
      const newCategory = new Category({
        title: categoryName,
      });

      newCategory.save().then((category) => {
        res.status(200).json(category);
      });
    }
  },

  getEditCategoriesPage: async (req, res) => {
    const catId = req.params.id;

    const cats = await Category.find();

    Category.findById(catId)
      .lean()
      .then((cat) => {
        res.render("admin/category/edit", { category: cat, categories: cats });
      });
  },

  submitEditCategoriesPage: (req, res) => {
    const catId = req.params.id;
    const newTitle = req.body.name;

    if (newTitle) {
      Category.findById(catId)
        .lean()
        .then((category) => {
          category.title = newTitle;

          category.save().then((updated) => {
            res.status(200).json({ url: "/admin/category" });
          });
        });
    }
  },

  /* COMMENT ROUTE SECTION*/
  getComments: (req, res) => {
    Comment.find()
      .populate("user")
      .then((comments) => {
        res.render("admin/comments/index", { comments: comments });
      });
  },

  submitComment: (req, res) => {
    if (req.user) {
      Post.findById(req.body.id)
        .lean()
        .then((post) => {
          const newComment = new Comment({
            user: req.user.id,
            body: req.body.comment_body,
          });

          post.comments.push(newComment);
          post.save().then((savedPost) => {
            newComment.save().then((savedComment) => {
              req.flash(
                "success-message",
                "Your comment was submitted for review."
              );
              res.redirect(`/post/${post._id}`);
            });
          });
        });
    } else {
      req.flash("error-message", "Login first to comment");
      res.redirect("/login");
    }
  },
};
