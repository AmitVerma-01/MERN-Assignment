import {Router} from "express"; 
import { getAllEmployees , addEmployee, getEmployee, updateEmployee, searchEmployee, checkNumberExistance, checkEmailExistance, deleteEmployee, getEmployeeCount } from "../controllers/employee.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { updateAvatar } from "../controllers/employee.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.js"

const router = Router();

router.use(verifyJWT)
router.route('/').get(getAllEmployees);
router.route('/add-employee').post(
    upload.single('avatar')
    ,addEmployee
);

router.route('/count').get(getEmployeeCount);
router.route('/search').get(searchEmployee);
router.route('/update-employee/:employeeId').put(updateEmployee);
router.route('/update-avatar').patch(upload.single('avatar'),updateAvatar);
router.route('/mobile/:mobileNumber').get(checkNumberExistance);
router.route('/email/:email').get(checkEmailExistance);
router.route('/:id').get(getEmployee).delete(deleteEmployee);

export default router