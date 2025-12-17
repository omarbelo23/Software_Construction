import MenuItem from "../models/MenuItem.js";

export default {
    listAll: () => MenuItem.find({}),

    create: (data) => MenuItem.create(data),

    update: (id, data) => MenuItem.findByIdAndUpdate(id, data, { new: true }),

    delete: (id) => MenuItem.findByIdAndDelete(id)
};
