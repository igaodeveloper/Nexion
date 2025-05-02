import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Send,
  Plus,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
  lastMessage?: string;
  unread?: number;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Carolina Silva",
    status: "online",
    lastMessage: "Oi! Como está o progresso do design?",
    unread: 0,
  },
  {
    id: "2",
    name: "Rafael Mendes",
    status: "online",
    lastMessage: "Vou revisar o código e te dou um feedback",
    unread: 1,
  },
  {
    id: "3",
    name: "Equipe de Design",
    status: "online",
    lastMessage: "Lucas: Pessoal, atualizei os mockups",
    unread: 0,
  },
  {
    id: "4",
    name: "Juliana Costa",
    status: "busy",
    lastMessage: "Precisamos revisar o cronograma",
    unread: 0,
  },
];

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    contacts[0],
  );
  const [inputMessage, setInputMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "offline":
        return "bg-slate-300";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-slate-300";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleSendMessage = () => {
    // In a real app, we would send the message to the API
    if (inputMessage.trim()) {
      console.log("Sending message:", inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">Mensagens</h2>
        </div>

        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar conversa..." className="pl-9 py-2" />
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                  selectedContact?.id === contact.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/40",
                  contact.unread && contact.unread > 0 ? "bg-accent/20" : "",
                )}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      getStatusColor(contact.status),
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{contact.name}</span>
                  </div>
                  {contact.lastMessage && (
                    <div className="flex items-center">
                      <p className="text-sm truncate text-muted-foreground">
                        {contact.lastMessage}
                      </p>
                      {contact.unread && contact.unread > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          <span className="text-[10px]">{contact.unread}</span>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      getStatusColor(selectedContact.status),
                    )}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.status === "online"
                      ? "Online"
                      : selectedContact.status === "busy"
                        ? "Ocupado"
                        : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Buscar na conversa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      Limpar conversa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 min-h-[200px]">
                {/* In a real app, this would be populated with actual messages */}
                <div className="flex justify-start">
                  <div className="bg-accent p-3 rounded-lg rounded-bl-none max-w-[70%]">
                    <p>{selectedContact.lastMessage}</p>
                    <div className="text-xs mt-1 text-muted-foreground">
                      10:30
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary p-3 rounded-lg rounded-br-none max-w-[70%] text-primary-foreground">
                    <p>Olá! Estou trabalhando nisso agora.</p>
                    <div className="text-xs mt-1 flex justify-end text-primary-foreground/80">
                      10:32 ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                className="flex-1"
                placeholder="Digite uma mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
}
