'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  Search,
  LogOut,
  User,
  Loader2,
  Users,
} from 'lucide-react';
import { FortressGateIcon } from '@/components/icons';
import { useFirestore, useCollection, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AddPersonnelForm from '@/components/add-personnel-form';

type Personnel = {
  id: string;
  name: string;
  rank: string;
  forceId: string;
  department: string;
  facility: string;
  block: string;
  room: string;
  status: 'Active' | 'On Leave' | 'Transferred';
};

export default function PersonnelClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPersonnelForm, setShowAddPersonnelForm] = useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const personnelQuery = useMemoFirebase(() => firestore ? collection(firestore, 'personnel') : null, [firestore]);
  const { data: personnelData, isLoading: isLoadingPersonnel } = useCollection<Personnel>(personnelQuery);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  const filteredPersonnel = useMemo(() => {
    if (!personnelData) return [];
    return personnelData.filter(
      (person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [personnelData, searchQuery]);
  
  const guardAvatar = PlaceHolderImages.find(img => img.id === 'guard-avatar');

  if (isUserLoading || !user || user.isAnonymous) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <FortressGateIcon className="h-6 w-6 text-primary" />
          <h1>FortressGate</h1>
        </div>
        <nav className="ml-8 flex items-center gap-4 text-sm font-medium">
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          <Link href="/personnel" className="text-primary">Personnel</Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {guardAvatar && <AvatarImage src={guardAvatar.imageUrl} alt="Security Guard" data-ai-hint={guardAvatar.imageHint} />}
                  <AvatarFallback>SG</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="font-medium">{user?.email || "Officer"}</p>
                <p className="text-xs text-muted-foreground">Gate Guard</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/personnel')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Personnel</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Personnel Management ({isLoadingPersonnel ? 0 : filteredPersonnel.length})</CardTitle>
            <div className='flex gap-2'>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search personnel..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowAddPersonnelForm(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Personnel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingPersonnel ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPersonnel.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.rank}</TableCell>
                      <TableCell>{person.department}</TableCell>
                      <TableCell>{person.facility}, {person.block}, {person.room}</TableCell>
                      <TableCell>{person.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
                <p className="text-lg font-medium">No personnel found</p>
                <p className="text-sm text-muted-foreground">Try adding your first personnel record.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <AddPersonnelForm open={showAddPersonnelForm} onOpenChange={setShowAddPersonnelForm} />
      </main>
    </div>
  );
}
