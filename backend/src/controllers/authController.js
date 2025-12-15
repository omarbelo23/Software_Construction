import authService from "../services/authService.js";

export default {
    signup: async (req, res) => {
        try {
            const user = await authService.signup(
                req.body.name,
                req.body.email,
                req.body.password,
                req.body.adminCode
            );
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const data = await authService.login(req.body.email, req.body.password);
            res.json(data);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Admin: Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await authService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Admin: Delete a user
    deleteUser: async (req, res) => {
        try {
            await authService.deleteUser(req.params.id);
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
};
