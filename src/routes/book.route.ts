import { Router } from "express";
import { insertBook, getBook, bookByterm, bookRentRange, bookFilter, getBookByRefId } from "../controllers/book.controller";

const router = Router()

router.route('/').get(getBook)
router.route('/:bookRefId').get(getBookByRefId)
router.route('/insertBook').post(insertBook)
router.route('/search').get(bookByterm)
router.route('/rentRange').get(bookRentRange)
router.route('/filter').get(bookFilter)
router.route('/filter').get(bookFilter)




export default router