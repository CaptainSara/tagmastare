const Mongoose = require("mongoose");


db.registerModel({
  model: 'Booking',
  collection: 'booking',
  apiRoute: 'booking',
  readOnly: false,
  schemaProperties: {
    ticketAmount: { type: Number, required: true },
    routeId: { type: Mongoose.SchemaTypes.ObjectId, ref: 'trainRoute', required: true },
    totalPrice: { type: Number, required: true },
    customer: { type: Mongoose.SchemaTypes.ObjectId, ref: 'customers', required: false },
  },
  addHooks(schema) { }
}) 