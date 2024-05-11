import {z} from "zod";

export const loginFormSchema =  z.object({
  username : z.string().max(9).min(9),
  password : z.string().min(8)
})


export type LoginFormSchema = typeof loginFormSchema;