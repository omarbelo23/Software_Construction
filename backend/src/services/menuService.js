import menuRepo from "../repositories/menuRepository.js";

export default {
    listMenu: () => menuRepo.listAll()
};
