import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({cookies}) => {
  cookies.delete("session",{path:"/",secure:true});
  throw redirect(300,"/");
}