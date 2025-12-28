'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  QrCode,
  Search,
  LogOut,
  Building,
  Clock,
  User,
} from 'lucide-react';
import { FortressGateIcon } from '@/components/icons';
import VisitorRegistrationForm from '@/components/visitor-registration-form';
import { currentVisitorsData, personnelData } from '@/lib/data';
import type { Visitor, Personnel } from '@/lib/data';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(img => img.id === id);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const getPersonnelById = (id: string): Personnel | undefined =>
    personnelData.find((p) => p.id === id);

  const filteredVisitors = currentVisitorsData.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPersonnelById(visitor.visitingPersonnelId)?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  
  const guardAvatar = getImage('guard-avatar');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <FortressGateIcon className="h-6 w-6 text-primary" />
          <h1>FortressGate</h1>
        </div>
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
                <p className="font-medium">Officer Daniels</p>
                <p className="text-xs text-muted-foreground">Gate Guard</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Gate Guard Dashboard
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            size="lg"
            className="h-28 text-lg"
            onClick={() => setShowRegistrationForm(true)}
          >
            <UserPlus className="mr-4 h-8 w-8" />
            Register New Visitor
          </Button>
          <Button size="lg" variant="secondary" className="h-28 text-lg">
            <QrCode className="mr-4 h-8 w-8" />
            Scan QR Code
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Current Visitors ({filteredVisitors.length})</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search visitors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredVisitors.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredVisitors.map((visitor) => {
                  const personnel = getPersonnelById(visitor.visitingPersonnelId);
                  const visitorImage = getImage(visitor.photoId);
                  return (
                    <Card key={visitor.id} className="flex flex-col overflow-hidden">
                      <CardHeader className="flex flex-row items-center gap-4 p-4">
                        {visitorImage && <Image
                          src={visitorImage.imageUrl}
                          alt={visitor.name}
                          width={80}
                          height={80}
                          className="rounded-full border"
                          data-ai-hint={visitorImage.imageHint}
                        />}
                        <div className="grid gap-1">
                          <p className="text-lg font-semibold">{visitor.name}</p>
                          <Badge
                            variant={
                              visitor.status === 'Overstaying'
                                ? 'destructive'
                                : 'default'
                            }
                            className="w-fit"
                          >
                            {visitor.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-2 text-sm p-4 pt-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            Visiting:{" "}
                            <span className="font-medium text-foreground">{personnel?.name}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {personnel?.block}, {personnel?.room}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>Checked in at: {visitor.timeIn}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-auto border-t bg-muted/50 p-2 dark:bg-card">
                        <Button className="w-full" variant="outline">
                          Check Out
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
                    <p className="text-lg font-medium">No visitors found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or register a new visitor.</p>
                </div>
            )}
          </CardContent>
        </Card>
        <VisitorRegistrationForm
          open={showRegistrationForm}
          onOpenChange={setShowRegistrationForm}
        />
      </main>
    </div>
  );
}
