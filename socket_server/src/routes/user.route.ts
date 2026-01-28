import { Router } from "express"
import { 
    setUserController, 
    updateUserController,
    findUserController,
    mapIsEmptyController, 
    allMapUsersController 
} from "../controllers/user.controller.js"

const router: Router = Router();

router.route('/set').post(setUserController);
router.route('/update').put(updateUserController);
router.route('/find/:id').get(findUserController);
router.route('/is-empty').get(mapIsEmptyController);
router.route('/all-users').get(allMapUsersController);

export default router;