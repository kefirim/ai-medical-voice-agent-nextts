"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>(""); // valeur initiale vide
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const router = useRouter()


  const OnClickNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    } finally {
      setLoading(false);
    }
  };

  
   const onStartConsultation= async()=>{
    setLoading(true);
    // Save All Info To Databse
      const result = await axios.post('/api/session-chat',{
        notes: note,
        selectedDoctor: selectedDoctor
    });
     console.log(result.data)
     if (result.data?.sessionId){
      console.log (result.data.sessionId);
      router.push('/dashboard/medical-agent/' + result.data.sessionId)
      
     }
     setLoading(false);
   }



  
     
       
  










  return (
    <Dialog>
     <DialogTrigger asChild>
  <Button className="mt-3">+ Start a Consultation</Button>
</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2 className="mt-2 mb-2 text-sm font-medium">
                  Add Symptoms or Any Other Details
                </h2>
                <Textarea
                  placeholder="Add detail here..."
                  className="h-[150px] mt-1"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select The Doctor</h2>
              <div className="grid grid-cols-2 gap-5">
                {suggestedDoctors.map((doctor, index) => (                                                                //@ts-ignore
                  <SuggestedDoctorCard doctorAgent={doctor} key={index} setSelectedDoctor={()=>setSelectedDoctor(doctor)} selectedDoctor={selectedDoctor} />
                ))}
              </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              onClick={OnClickNext}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
          <Button
  onClick={onStartConsultation}
  disabled={!selectedDoctor || loading}
  className="flex items-center gap-2"
>
  {loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      Start Consultation
      <ArrowRight className="h-4 w-4" />
    </>
  )}
</Button>


          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
