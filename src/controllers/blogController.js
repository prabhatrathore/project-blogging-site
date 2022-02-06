const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')


const createBlog = async function (req, res) {
    try {
        //authorisation
        let id = req.body.authorId;
        let decodeId = req.decodedtoken.userId;
        if (decodeId == id) {
            if (req.body.isPublished == true) {
                req.body.publishedAt = Date.now()
            }
            let authorData = await authorModel.findOne({ _id: id })
            if (authorData) {
                let body = req.body;
                let data = await blogModel.create(body);
                res.status(201).send({ status: true, data: data })
            }
        }
        else {
            res.status(400).send({ status: false, msg: 'authorisation failed' })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const fetchBlogs = async function (req, res) {
    try {
        const queryParams = req.query
        let getQuery = { isDeleted: false, isPublished: true, deletedAt: null }
        if (req.query.authorId) {
            getQuery.authorId = queryParams.authorId
        }
        if (req.query.tags) {
            getQuery.tags = queryParams.tags
        }
        if (req.query.category) {
            getQuery.category = queryParams.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = queryParams.subcategory
        }
        let blog = await blogModel.find(getQuery)
        if (blog.length == 0) {
            res.status(404).send({ status: false, data: "blog not found!!" })
        }
        else {
            res.status(200).send({ status: true, msg: blog })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

const updateBlog = async function (req, res) {
    try {
        let decodeId = req.decodedtoken.userId;
        let blogId = req.params.blogId;
        let blogUser = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogUser) {
            return res.status(404).send({ status: false, msg: 'invalid blog id or blog is deleted' })
        }
        let authorId = blogUser.authorId;
        if (decodeId == authorId) {
            let body = req.body;
            let id = req.params.blogId;
            if (body.hasOwnProperty("isPublished") == true) {
                let updatedValue = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
                    $set:
                    {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        isPublished: req.body.isPublished,
                        publishedAt: Date.now(),
                        updatedAt: Date.now()
                    },
                    $push: {
                        tags: req.body.tags,
                        subcategory: req.body.subcategory
                    }
                }, { new: true })

                res.status(200).send({ status: true, data: updatedValue });
            }
            else {
                let updatedValue = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
                    $set:
                    {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        updatedAt: Date.now()
                    },
                    $push: {
                        tags: req.body.tags,
                        subcategory: req.body.subcategory
                    }
                }, { new: true })
                res.status(200).send({ status: true, data: updatedValue });
            }
        }

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

const deleteById = async function (req, res) {
    try {
        let decodeId = req.decodedtoken.userId;
        let blogId = req.params.blogId;
        let blogUser = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogUser) {
            return res.status(404).send({ status: false, msg: 'invalid blog id or this blog already  deleted ' })
        }
        let authorId = blogUser.authorId;
        if (decodeId == authorId) {
            let data = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
            res.status(200).send({ status: true, msg: `${blogId} this blog is deleted successfully` })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const deleteByQuery = async function (req, res) {
    try {
        let getQuery = {
            isDeleted: false
        }
        if (req.query.authorid) {
            getQuery.authorid = req.query.authorid
        }
        if (req.query.tags) {
            getQuery.tags = req.query.tags
        }
        if (req.query.category) {
            getQuery.category = req.query.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = req.query.subcategory
        }
        if (req.query.isPublished) {
            getQuery.isPublished = req.query.isPublished
        }
        let getAuthorId = await blogModel.find(getQuery)
        if (!getAuthorId) {
            res.status(400).send({ status: false, message: "invalid BlogId!!!" })
        }

        let blogsData = []
        for (let i = 0; i < getAuthorId.length; i++) {
            let deleteData = await blogModel.findOneAndUpdate(getQuery,
                { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

            blogsData.push(deleteData)
        }
        res.status(200).send({ msg: blogsData })


    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}
module.exports.createBlog = createBlog;
module.exports.fetchBlogs = fetchBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;
