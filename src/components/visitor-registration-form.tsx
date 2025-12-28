'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
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
import { Separator } from '@/components/ui/separator';
import { Loader2, Camera, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { personnelData } from '@/lib/data';
import type { Personnel } from '@/lib/data';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  idNumber: z.string().optional(),
  address: z.string().optional(),
  photoUri: z.string().optional(),
  personnelId: z.string({ required_error: 'Please select a person to visit.' }),
  purpose: z.string().min(3, 'Purpose of visit is required.'),
  duration: z.string({ required_error: 'Please select a visit duration.' }),
  vehicleDetails: z.string().optional(),
});

type VisitorRegistrationFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VisitorRegistrationForm({
  open,
  onOpenChange,
}: VisitorRegistrationFormProps) {
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      address: '',
      photoUri: '',
      purpose: '',
      vehicleDetails: '',
    },
  });

  const selectedPersonnel = personnelData.find(p => p.id === form.watch('personnelId'));

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const idDataUri = reader.result as string;
        form.setValue('photoUri', idDataUri);

        const response = await fetch('/api/ai', {
          method: 'POST',
          body: JSON.stringify({
            flow: 'scanVisitorIdFlow',
            input: { idDataUri },
          }),
        });
        
        const result = await response.json();

        if (response.ok && result.output) {
          const { name, idNumber, address } = result.output;
          form.setValue('fullName', name, { shouldValidate: true });
          form.setValue('idNumber', idNumber);
          form.setValue('address', address);
          toast({
            title: 'Scan Successful',
            description: 'Visitor details have been extracted.',
          });
        } else {
            throw new Error(result.error || 'Failed to scan ID');
        }
      } catch (error) {
        console.error('Error scanning ID:', error);
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: 'Could not extract info. Please enter details manually.',
        });
      } finally {
        setIsScanning(false);
      }
    };
    reader.onerror = () => {
        setIsScanning(false);
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the selected file."
        });
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Visitor Registered',
      description: `${values.fullName} has been successfully registered.`,
    });
    onOpenChange(false);
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
            Scan an ID for quick entry or fill in the details manually.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <Input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <Button type="button" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isScanning}>
              {isScanning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning ID...</> : <><Camera className="mr-2 h-4 w-4" /> Scan Visitor ID</>}
            </Button>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
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
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto-filled from scan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="photoUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
                       <div className="w-full h-10 flex items-center">
                         {field.value ? <Image src={field.value} alt="Visitor photo" width={40} height={40} className="rounded-md border" /> : <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center"><User className="h-6 w-6 text-muted-foreground"/></div>}
                       </div>
                    </FormItem>
                  )}
                />
            </div>

            <Separator />
            
            <FormField
              control={form.control}
              name="personnelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person to Visit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select from personnel directory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personnelData.map((p) => (
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
