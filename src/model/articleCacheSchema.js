const mongoose = require("mongoose")
const Schema = mongoose.Schema

const articleCacheSchema = new Schema({
    articleURLId: String,
    targetLanguageTranslation: String,
    dateCreated: Date,
    userId: String,
    translatedArticleContent: Object,
    cached: Boolean
})

const ArticleCache = mongoose.model("articlesDB", articleCacheSchema)

module.exports = ArticleCache
