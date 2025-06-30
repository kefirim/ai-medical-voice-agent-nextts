import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";




export async function POST( req: NextRequest) {
    const {notes,selectedDoctor} = await req.json(); 
    const user = await currentUser()
    try{
      const sessionId=uuidv4()  
      const result=await db.insert(SessionChatTable).values({
       sessionId:sessionId,
       createdBy: user?.primaryEmailAddress?.emailAddress,
       notes: notes,
       selectedDoctor: selectedDoctor,
       createdOn: (new Date()).toString()

         //@ts-ignore
      }).returning({SessionChatTable})

          return NextResponse.json(result[0]?.SessionChatTable)  
    }catch(e){
        NextResponse.json(e)

    }
        
         }

 export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId manquant" }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(SessionChatTable)
      //@ts-ignore
      .where(eq(SessionChatTable.sessionId, sessionId));

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("Erreur GET /api/session-chat:", e);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}