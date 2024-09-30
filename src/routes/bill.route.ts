import { Router } from "express";
import { issueBook, returnBook, bookHistory, getTotalRentBook, getBooksIssuedToPerson, getBooksIssuedInDateRange, getTransactionGraph, getTransactionGraph_ } from "../controllers/bill.controller";
import fetchuser from '../middleware/user.middleware';

const router = Router()

// router.use(fetchuser);

router.route('/issue').post(issueBook)
router.route('/return').post(returnBook)
router.route('/bookHistory').get(bookHistory)
router.route('/bookRent').get(getTotalRentBook)
router.route('/bookIssued').get(getBooksIssuedToPerson)
router.route('/bookDateRange').get(getBooksIssuedInDateRange)
router.route('/graph').get(getTransactionGraph)
router.route('/graph2').get(getTransactionGraph_)

export default router