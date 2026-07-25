'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'Alice Smith', phone: '+1 555-0101', date: '2024-05-15', time: '10:00', purpose: 'Computerized Eye Testing', status: 'pending' },
    { id: 2, name: 'Bob Johnson', phone: '+1 555-0202', date: '2024-05-16', time: '14:30', purpose: 'Frame Consultation', status: 'approved' },
  ]);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Appointments</h2>
          <p className="text-muted-foreground">Manage and review patient appointments.</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.date} at {app.time}</TableCell>
                  <TableCell>{app.purpose}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {app.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleStatusUpdate(app.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                        <Button size="sm" onClick={() => handleStatusUpdate(app.id, 'rejected')} variant="destructive">Reject</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
