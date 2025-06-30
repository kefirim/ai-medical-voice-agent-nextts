
import { openai } from "@/config/OpenAiModel";

import { AIDoctorAgents } from "@/shared/list";

import { NextRequest, NextResponse } from "next/server";

// 🔧 Fonction pour compléter les docteurs depuis la liste réelle
function normalizeDoctorList(aiDoctors: any[]) {
  return aiDoctors.map((aiDoc) => {
    const full = AIDoctorAgents.find(
      (doc) => doc.specialist === aiDoc.specialist
    );

    return full
      ? full
      : {
          id: -1,
          specialist: aiDoc.specialist || "Unknown",
          description: aiDoc.description || "No description available.",
          image: "/default-doctor.png",
          agentPrompt: aiDoc.agentPrompt || "",
          voiceId: "default",
          subscriptionRequired: false,
        };
  });
}

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    // 🔹 On limite les données envoyées à l’IA
    const slimAgents = AIDoctorAgents.map(({ specialist, agentPrompt }) => ({
      specialist,
      agentPrompt,
    }));

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: JSON.stringify(slimAgents),
        },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}. Based on these symptoms, suggest a list of doctors. Return only a valid JSON array.`,
        },
      ],
    });

    const rawResp = completion.choices[0].message?.content || "";
    const cleanedResp = rawResp.trim().replace(/```json|```/g, "");

    // ❗ Corrige le contenu avec les données complètes
    const suggestedDoctors = JSON.parse(cleanedResp);
    const completedDoctors = normalizeDoctorList(suggestedDoctors);

    return NextResponse.json(completedDoctors);
  } catch (e: any) {
    console.error("AI error:", e);
    return NextResponse.json(
      { error: e.message || "Unknown AI error" },
      { status: 500 }
    );
  }
}



   
