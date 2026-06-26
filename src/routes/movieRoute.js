import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    res.json([1, 2, 3, 4, 5, 10]);
});

export default router;
