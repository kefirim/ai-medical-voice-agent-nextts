"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

export default function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [messages, setMessages] = useState<{ role: string; transcript: string }[]>([]);
  const vapiRef = useRef<any>(null);

  // Initialiser Vapi
  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

    vapi.on("call-start", () => {
      setCallStarted(true);
      console.log("Call started");
    });

    vapi.on("call-end", () => {
      setCallStarted(false);
      console.log("Call ended");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
        setMessages((prev) => [...prev, { role: message.role, transcript: message.transcript }]);
      }
    });

    vapiRef.current = vapi;

    return () => {
      if (vapiRef.current) {
        vapiRef.current.destroy();
        vapiRef.current = null;
      }
    };
  }, []);

  // Charger les données de session
  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    }
  };

  const StartCall = () => {
    vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
  };

  const EndCall = () => {
    vapiRef.current?.stop(); // Pour la version actuelle de @vapi-ai/web
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
          />
          {callStarted ? "Connected" : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10 w-full">
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={sessionDetail.selectedDoctor.specialist ?? ""}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />

          <h2 className="mt-2 text-lg">{sessionDetail.selectedDoctor.specialist}</h2>
          <p className="text-sm text-gray-400">AI Medical Agent</p>

          {/* Zone des messages */}
        {/* Zone des messages - sans scroll, style fluide et responsive */}
<div className="mt-10 w-full flex flex-col gap-3">
  {messages.slice(-8).map((msg, index) => (
    <div
      key={index}
      className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-sm ${
        msg.role === "assistant"
          ? "bg-blue-100 text-black self-start"
          : "bg-gray-200 text-gray-900 self-end"
      }`}
    >
      <strong className="block mb-1 text-xs text-gray-500">
        {msg.role === "assistant" ? "Assistant" : "You"}
      </strong>
      <p className="break-words">{msg.transcript}</p>
    </div>
  ))}
</div>


          {!callStarted ? (
            <Button className="mt-10" onClick={StartCall}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Start Call
            </Button>
          ) : (
            <Button className="mt-10" variant="destructive" onClick={EndCall}>
              <PhoneOff className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
