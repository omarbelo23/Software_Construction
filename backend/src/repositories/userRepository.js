import User from "../models/User.js";

export default {
    create: (data) => User.create(data),
    findByEmail: (email) => User.findOne({ email }),
    findById: (id) => User.findById(id),
    findAll: () => User.find().select('-passwordHash'),
    deleteById: (id) => User.findByIdAndDelete(id)
};
