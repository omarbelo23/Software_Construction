import authService from "../services/authService.js";

export default {
    signup: async (req, res) => {
        try {
            const user = await authService.signup(
                req.body.name,
                req.body.email,
                req.body.password
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
    }
};
