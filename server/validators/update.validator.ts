import * as z from 'zod'

 const UpdateValidator = z.object({
    fullName: z.string().min(3),
    bio:z.string().min(2),
 }).required();

 export default UpdateValidator;

 export type UserType = z.infer< typeof UpdateValidator>