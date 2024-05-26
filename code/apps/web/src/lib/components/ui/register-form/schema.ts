import {z} from "zod";

export const StudentCodeRegex = /u\d{8}/g
export const StudentNumberRegex = /\d{8}/g

export const registerFormSchema =  z.object({
  username : z.union([
    z.string().refine((studentCode) => StudentCodeRegex.test(studentCode)), 
    z.string().refine((studentNumber) => StudentNumberRegex.test(studentNumber)),
    z.string().email().endsWith("tuks.co.za")
  ]),
  firstname : z.string(),
  lastname : z.string(),
  password : z.string().min(8),
  confirm : z.string().min(8),
})


export type RegisterFormSchema = typeof registerFormSchema;