import * as z from 'zod'

 const RegisterValidator = z.object({
    fullName: z.string().min(3),
    email:z.email(),
    password: z.string().min(8),
    bio:z.string().min(2),
 }).required();

 export default RegisterValidator;

 export type RegisterType = z.infer< typeof RegisterValidator>