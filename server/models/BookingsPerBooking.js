db.registerModel({
  model: 'TicketsPerBooking',
  collection: 'tickets',
  apiRoute: 'ticketsperbooking',
  readOnly: true,
  schemaPropertiesFrom: 'Booking',
  addHooks(schema) {
    schema.virtual('tickets', {
      ref: 'Ticcket',
      localField: '_id',
      foreignField: 'bookingId'
    });
    schema.pre('find', function () {
      this.populate('ticket', { __v: 0 });
    });
  }
});
