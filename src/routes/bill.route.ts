import { Router } from "express";
import { issueBook, returnBook, bookHistory, getTotalRentBook, getBooksIssuedToPerson, getBooksIssuedInDateRange } from "../controllers/bill.controller";
import fetchuser from '../middleware/user.middleware';

const router = Router()

// router.use(fetchuser);

router.route('/issue').post(issueBook)
router.route('/return').post(returnBook)
router.route('/bookHistory').get(bookHistory)
router.route('/bookRent').get(getTotalRentBook)
router.route('/bookIssued').get(getBooksIssuedToPerson)
router.route('/bookDateRange').get(getBooksIssuedInDateRange)

export default router