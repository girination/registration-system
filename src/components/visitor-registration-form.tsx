'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';


// This should match the type in dashboard.tsx and your data structure
type Personnel = {
  id: string;
  name: string;
  rank: string;
  facility: string;
  block: string;
  room: string;
};


const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  idNumber: z.string().optional(),
  personnelId: z.string({ required_error: 'Please select a person to visit.' }),
  purpose: z.string().min(3, 'Purpose of visit is required.'),
  duration: z.string({ required_error: 'Please select a visit duration.' }),
  vehicleDetails: z.string().optional(),
});

type VisitorRegistrationFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personnelData: Personnel[];
  isLoadingPersonnel: boolean;
};

export default function VisitorRegistrationForm({
  open,
  onOpenChange,
  personnelData,
  isLoadingPersonnel,
}: VisitorRegistrationFormProps) {
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      purpose: '',
      vehicleDetails: '',
    },
  });

  const selectedPersonnel = personnelData?.find(p => p.id === form.watch('personnelId'));
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Firestore is not available.",
      });
      return;
    }
    try {
      const visitorsColRef = collection(firestore, 'visitors');
      addDocumentNonBlocking(visitorsColRef, {
        name: values.fullName,
        visitingPersonnelId: values.personnelId,
        timeIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: 'On-site',
        createdAt: serverTimestamp(),
        ...values
      });

      toast({
        title: 'Visitor Registered',
        description: `${values.fullName} has been successfully registered.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error registering visitor:", error)
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred while registering the visitor.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            form.reset();
        }
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Visitor</DialogTitle>
          <DialogDescription>
            Fill in the details for the new visitor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personnelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person to Visit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingPersonnel}>
                        <SelectValue placeholder={isLoadingPersonnel ? "Loading personnel..." : "Select from personnel directory"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personnelData?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.rank})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedPersonnel && (
              <div className="rounded-md border bg-muted p-3 text-sm">
                <p className="font-medium text-muted-foreground">Visit Location:</p>
                <div className="flex items-center gap-2 text-foreground">
                  <Building className="h-4 w-4" />
                  <span>{selectedPersonnel.facility}, {selectedPersonnel.block}, {selectedPersonnel.room}</span>
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Official meeting, Personal visit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Visit Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger>
                          <SelectValue placeholder="Select expected duration" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="1 hour">1 Hour</SelectItem>
                          <SelectItem value="2 hours">2 Hours</SelectItem>
                          <SelectItem value="4 hours">4 Hours</SelectItem>
                          <SelectItem value="All day">All Day</SelectItem>
                      </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Details <span className="text-muted-foreground">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Toyota, ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 -mx-1 px-1">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : 'Register Visitor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
