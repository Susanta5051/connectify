import * as z from 'zod'
import { userSocketMap } from '../lib/socket';

 const UserValidator = z.object({
    fullName: z.string().min(3),
    email:z.email(),
    password: z.string().min(8),
    bio:z.string().min(2),
 }).required();

 export default UserValidator;

 export type UserType = z.infer< typeof UserValidator>