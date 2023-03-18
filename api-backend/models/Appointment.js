const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    professionalId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: Array,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;