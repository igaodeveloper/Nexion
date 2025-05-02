import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, add, parse, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample event data
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "meeting" | "task" | "reminder";
  participants?: string[];
  description?: string;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    type: "meeting",
    start: new Date(),
    end: new Date()
  });
  
  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: "1",
        title: "Reunião de Design",
        start: add(new Date(), { days: 1, hours: 2 }),
        end: add(new Date(), { days: 1, hours: 3 }),
        type: "meeting",
        participants: ["John Doe", "Jane Smith", "Alex Johnson"],
        description: "Discussão sobre o novo design system"
      },
      {
        id: "2",
        title: "Entrega do Projeto",
        start: add(new Date(), { days: 3 }),
        end: add(new Date(), { days: 3 }),
        type: "task",
        description: "Prazo final para entrega do projeto Nexion"
      },
      {
        id: "3",
        title: "Call com cliente",
        start: add(new Date(), { days: -2, hours: 1 }),
        end: add(new Date(), { days: -2, hours: 2 }),
        type: "meeting",
        participants: ["John Doe", "Cliente ABC"],
        description: "Apresentação do progresso do projeto"
      },
      {
        id: "4",
        title: "Review de código",
        start: new Date(),
        end: new Date(),
        type: "task",
        description: "Review do PR #234"
      }
    ];
    
    setEvents(mockEvents);
  }, []);
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth);
  
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prevMonth => {
      if (direction === "prev") {
        return add(prevMonth, { months: -1 });
      } else {
        return add(prevMonth, { months: 1 });
      }
    });
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => 
      isSameDay(event.start, date)
    );
  };
  
  const handleAddEvent = () => {
    // In a real app, you would call an API here
    const newEventWithId = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9),
      start: selectedDate,
      end: selectedDate
    } as CalendarEvent;
    
    setEvents([...events, newEventWithId]);
    setIsAddingEvent(false);
    setNewEvent({
      title: "",
      description: "",
      type: "meeting",
      start: new Date(),
      end: new Date()
    });
  };
  
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300";
      case "task":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "reminder":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendário</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateMonth("prev")}
              className="rounded-r-none border-r-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="rounded-none px-4 font-medium"
            >
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateMonth("next")}
              className="rounded-l-none border-l-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsAddingEvent(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 p-4 shadow-md">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="text-center py-2 font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days of the week before the first day of the month */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="border border-transparent p-1 h-24 bg-muted/30 rounded-md"></div>
            ))}
            
            {daysInMonth.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div
                  key={index}
                  className={cn(
                    "border p-1 h-24 transition-colors relative cursor-pointer rounded-md",
                    !isSameMonth(day, currentMonth) ? "bg-muted/20 text-muted-foreground" : "hover:bg-accent/10",
                    isSameDay(day, selectedDate) ? "ring-2 ring-primary ring-offset-2" : "",
                    isToday(day) ? "bg-accent/5 font-medium" : ""
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-sm w-7 h-7 flex items-center justify-center rounded-full",
                      isToday(day) ? "bg-primary text-primary-foreground" : ""
                    )}>
                      {format(day, 'd')}
                    </span>
                    {isToday(day) && (
                      <span className="text-xs font-medium text-primary">Hoje</span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1 max-h-[70px] overflow-hidden">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          getEventTypeColor(event.type)
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Event List for Selected Date */}
        <Card className="p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            {isToday(selectedDate) && (
              <Badge variant="outline" className="bg-primary/10 text-primary">Hoje</Badge>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event, idx) => (
                <div key={idx} className="p-3 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={cn(getEventTypeColor(event.type))}
                    >
                      {event.type === "meeting" ? "Reunião" : event.type === "task" ? "Tarefa" : "Lembrete"}
                    </Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" />
                    <span>{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</span>
                  </div>
                  {event.participants && event.participants.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {event.participants.slice(0, 3).map((person, i) => (
                          <Avatar key={i} className="h-6 w-6 border border-background">
                            <AvatarFallback className="text-[10px]">
                              {person.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {event.participants.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                            +{event.participants.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum evento para esta data</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsAddingEvent(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Evento
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>
              Adicione um novo evento para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                placeholder="Título do evento"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Evento</Label>
              <Select 
                value={newEvent.type} 
                onValueChange={(value) => setNewEvent({...newEvent, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="reminder">Lembrete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time">Início</Label>
                <Input 
                  id="start-time" 
                  type="time"
                  value="09:00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time">Fim</Label>
                <Input 
                  id="end-time" 
                  type="time"
                  value="10:00"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                placeholder="Detalhes do evento"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Cancelar</Button>
            <Button onClick={handleAddEvent}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 