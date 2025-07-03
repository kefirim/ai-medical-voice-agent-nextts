"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { SessionDetail } from '../medical-agent/[sessionId]/page';
import moment from 'moment';

type Props = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: Props) {
  const report = record.report as any;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">View Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-3xl font-bold">Medical AI Voice Agent Report</h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Session Info:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Doctor:</strong> {report.agent || record.selectedDoctor?.specialist}</p>
                  <p><strong>Patient:</strong> {report.user || "Anonymous"}</p>
                  <p><strong>Date:</strong> {moment(new Date(report.timestamp || record.createdOn)).format("YYYY-MM-DD HH:mm")}</p>
                </div>
              </div>

              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Summary:</h3>
                <p><strong>Chief Complaint:</strong> {report.chiefComplaint}</p>
                <p><strong>Summary:</strong> {report.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Duration:</strong> {report.duration}</p>
                <p><strong>Severity:</strong> {report.severity}</p>
              </div>

              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Symptoms:</h3>
                <ul className="list-disc list-inside ml-4">
                  {report.symptoms?.map((symptom: string, idx: number) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Medications Mentioned:</h3>
                <ul className="list-disc list-inside ml-4">
                  {report.medicationsMentioned?.length > 0 ? (
                    report.medicationsMentioned.map((med: string, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside ml-4">
                  {report.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
