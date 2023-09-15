import { Request, Response, Router } from 'express';

const router = Router();

router.post('/query', (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ message: 'Got POST' });
});

export default router;