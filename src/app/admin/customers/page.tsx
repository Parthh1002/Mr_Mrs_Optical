'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Plus } from 'lucide-react';

export default function CustomersCRMPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Alice Smith', phone: '+1 555-0101', lastVisit: '2024-05-15', rightEyeSph: '-1.25', leftEyeSph: '-1.50' },
    { id: 2, name: 'Bob Johnson', phone: '+1 555-0202', lastVisit: '2024-05-16', rightEyeSph: '0.00', leftEyeSph: '+0.25' },
    { id: 3, name: 'Emma Davis', phone: '+1 555-0303', lastVisit: '2024-05-10', rightEyeSph: '-3.00', leftEyeSph: '-2.75' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Customer CRM</h2>
          <p className="text-muted-foreground">Manage patient history, prescriptions, and eye power data.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Customer
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Customer Database</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or phone..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Right Eye (SPH)</TableHead>
                <TableHead>Left Eye (SPH)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.lastVisit}</TableCell>
                  <TableCell className="text-primary font-mono bg-primary/5">{customer.rightEyeSph}</TableCell>
                  <TableCell className="text-primary font-mono bg-primary/5">{customer.leftEyeSph}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Eye size={16} />
                      View Profile
                    </Button>
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
