const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({

    title: { type: String, required: 'title is required',trim:true },
    body: { type: String, required: 'body is required' ,trim:true},
    authorId: {
        type: ObjectId, required: 'author id is required', ref: 'myAuthor'
    },
    tags: [String],
    category: { type: String, required: true },
    subcategory: [String],
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isPublished: {
        type: Boolean, default: false
    },
    publishedAt: { type: Date }
})
module.exports = mongoose.model('myblog', blogSchema)