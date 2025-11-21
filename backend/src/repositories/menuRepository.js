import MenuItem from "../models/MenuItem.js";

export default {
    listAll: () => MenuItem.find(),
    create: (data) => MenuItem.create(data)
};
