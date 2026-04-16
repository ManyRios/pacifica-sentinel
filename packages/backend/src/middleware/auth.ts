import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);

export const authPrivy = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if(!token) return res.status(401).json({error: 'No token provided'});

        const verifiedClaims = privy.verifyAuthToken(token);
        req.user = verifiedClaims;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}