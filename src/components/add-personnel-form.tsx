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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  name: z.string().min(2, 'Full name is required.'),
  rank: z.string().min(2, 'Rank is required.'),
  forceId: z.string().min(1, 'Force/Personnel ID is required.'),
  department: z.string().min(2, 'Department is required.'),
  facility: z.string().min(2, 'Facility is required.'),
  block: z.string().min(2, 'Block is required.'),
  room: z.string().min(1, 'Room is required.'),
  status: z.enum(['Active', 'On Leave', 'Transferred']),
});

type AddPersonnelFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddPersonnelForm({
  open,
  onOpenChange,
}: AddPersonnelFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rank: '',
      forceId: '',
      department: '',
      facility: 'Military Camp Alpha',
      block: '',
      room: '',
      status: 'Active',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add personnel.',
      });
      return;
    }
    try {
      const personnelColRef = collection(firestore, 'personnel');
      
      const newPersonnelId = uuidv4();
      const personnelDocRef = doc(personnelColRef, newPersonnelId);

      addDocumentNonBlocking(personnelColRef, {
        id: newPersonnelId,
        userId: user.uid, // Associate with the logged-in user
        createdAt: serverTimestamp(),
        ...values,
      });

      toast({
        title: 'Personnel Added',
        description: `${values.name} has been successfully added to the directory.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error adding personnel:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "An error occurred while adding the personnel.",
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>
            Enter the details for the new employee or service member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Captain" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="forceId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Force ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., F12345" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department / Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Medical Corps" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="facility"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Facility</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Block C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 201" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select current status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Transferred">Transferred</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 -mx-1 px-1">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Personnel'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
