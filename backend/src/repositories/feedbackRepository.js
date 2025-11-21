import Feedback from "../models/Feedback.js";

export default {
    create: (data) => Feedback.create(data),
    findAll: () => Feedback.find()
};
