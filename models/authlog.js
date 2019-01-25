const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  time: Date,
  refreshToken: String
})

const Authlog = mongoose.model('Authlog', Schema)

exports.Authlog = Authlog