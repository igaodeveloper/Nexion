import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Home, LayoutDashboard, FileText, CalendarDays, MessageCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document, User } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export interface Tab {
  id: string;
  title: string;
  icon?: React.ReactNode;
  path: string;
  favicon?: string;
  closable?: boolean;
  documentId?: number;
}

interface BrowserTabsProps {
  onTabChange?: (tab: Tab) => void;
}

const STORAGE_KEY = 'nexion_browser_tabs';

export function BrowserTabs({ onTabChange }: BrowserTabsProps) {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [recentlyClosedTabs, setRecentlyClosedTabs] = useState<Tab[]>([]);

  // Fetch recent documents
  const { data: recentDocuments } = useQuery<Document[]>({
    queryKey: ['/api/documents/recent'],
  });

  // Default tabs
  const defaultTabs: Tab[] = [
    { id: 'dashboard', title: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/', closable: false },
    { id: 'calendar', title: 'Calendário', icon: <CalendarDays className="h-4 w-4" />, path: '/calendar', closable: true },
    { id: 'messages', title: 'Mensagens', icon: <MessageCircle className="h-4 w-4" />, path: '/messages', closable: true },
  ];

  // Initialize tabs
  useEffect(() => {
    const savedTabs = localStorage.getItem(STORAGE_KEY);
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        
        // Convert saved tabs to Tab objects with React nodes
        const restoredTabs = parsedTabs.map((tab: any) => {
          // Restore icon based on path or type
          let icon;
          if (tab.path === '/') {
            icon = <LayoutDashboard className="h-4 w-4" />;
          } else if (tab.path.startsWith('/documents/')) {
            icon = <FileText className="h-4 w-4" />;
          } else if (tab.path === '/calendar') {
            icon = <CalendarDays className="h-4 w-4" />;
          } else if (tab.path === '/messages') {
            icon = <MessageCircle className="h-4 w-4" />;
          } else {
            icon = <FileText className="h-4 w-4" />;
          }
          
          return { ...tab, icon };
        });
        
        setTabs(restoredTabs);
        
        // Find active tab based on current location
        const currentTab = restoredTabs.find((tab: Tab) => tab.path === location);
        if (currentTab) {
          setActiveTabId(currentTab.id);
        } else {
          // If no tab matches current location, add a new one
          handleAddTab(location);
        }
      } catch (error) {
        console.error('Error parsing saved tabs:', error);
        setTabs(defaultTabs);
        setActiveTabId('dashboard');
      }
    } else {
      // No saved tabs, use defaults
      setTabs(defaultTabs);
      setActiveTabId('dashboard');
    }
  }, []);

  // Save tabs to localStorage when they change
  useEffect(() => {
    if (tabs.length > 0) {
      // Create a copy without React node properties
      const tabsToSave = tabs.map(({ icon, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabsToSave));
    }
  }, [tabs]);

  // Update active tab when location changes
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location);
    if (currentTab) {
      setActiveTabId(currentTab.id);
    } else if (location !== '/' && location !== '/login' && location !== '/register') {
      // Add new tab for new locations (except some special pages)
      handleAddTab(location);
    }
  }, [location, tabs]);

  const handleAddTab = (path: string = '/') => {
    // Default title and icon
    let title = 'Nova Aba';
    let icon = <FileText className="h-4 w-4" />;
    let documentId;

    // Handle document paths
    if (path.startsWith('/documents/')) {
      const id = parseInt(path.split('/').pop() || '0');
      documentId = id;
      
      // Try to find document title
      if (recentDocuments) {
        const document = recentDocuments.find(doc => doc.id === id);
        if (document) {
          title = document.title;
        } else {
          title = 'Documento';
        }
      } else {
        title = 'Documento';
      }
    } else if (path === '/') {
      title = 'Dashboard';
      icon = <LayoutDashboard className="h-4 w-4" />;
    } else if (path === '/calendar') {
      title = 'Calendário';
      icon = <CalendarDays className="h-4 w-4" />;
    } else if (path === '/messages') {
      title = 'Mensagens';
      icon = <MessageCircle className="h-4 w-4" />;
    }

    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title,
      icon,
      path,
      closable: true,
      documentId
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setLocation(path);
    
    if (onTabChange) {
      onTabChange(newTab);
    }
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTabId(tab.id);
    setLocation(tab.path);
    
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose) return;
    
    // Add to recently closed
    setRecentlyClosedTabs(prev => [tabToClose, ...prev.slice(0, 9)]);
    
    // Remove the tab
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If closing the active tab, activate another one
    if (activeTabId === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[newTabs.length - 1];
      setActiveTabId(newActiveTab.id);
      setLocation(newActiveTab.path);
      
      if (onTabChange) {
        onTabChange(newActiveTab);
      }
    }
  };

  const handleReopenTab = (tab: Tab) => {
    setTabs(prev => [...prev, tab]);
    setActiveTabId(tab.id);
    setLocation(tab.path);
    setRecentlyClosedTabs(prev => prev.filter(t => t.id !== tab.id));
    
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex items-center border-b bg-card overflow-x-auto">
      <div className="flex-1 flex items-center">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center min-w-40 max-w-60 px-3 py-2 border-r border-border",
              "hover:bg-accent/50 cursor-pointer",
              activeTabId === tab.id ? "bg-accent/50" : "bg-transparent"
            )}
            onClick={() => handleTabClick(tab)}
          >
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              {tab.favicon ? (
                <img src={tab.favicon} alt="" className="h-4 w-4" />
              ) : tab.icon}
              <span className="truncate">{tab.title}</span>
            </div>
            
            {tab.closable && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-2 opacity-50 hover:opacity-100 hover:bg-accent" 
                onClick={(e) => handleCloseTab(e, tab.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem onClick={() => handleAddTab('/')}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddTab('/calendar')}>
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Calendário</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddTab('/messages')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Mensagens</span>
            </DropdownMenuItem>
            
            {recentDocuments && recentDocuments.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-xs text-muted-foreground">Documentos Recentes</div>
                {recentDocuments.slice(0, 5).map(doc => (
                  <DropdownMenuItem key={doc.id} onClick={() => handleAddTab(`/documents/${doc.id}`)}>
                    <div className="mr-2 text-lg">{doc.emoji || '📄'}</div>
                    <span className="truncate">{doc.title}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            
            {recentlyClosedTabs.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-xs text-muted-foreground">Abas Fechadas Recentemente</div>
                {recentlyClosedTabs.slice(0, 5).map(tab => (
                  <DropdownMenuItem key={tab.id} onClick={() => handleReopenTab(tab)}>
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="truncate">{tab.title}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 