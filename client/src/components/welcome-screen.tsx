import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Check, ArrowRight, ChevronRight, BarChart2, Users, CalendarRange, MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auto-progress through screens
  useEffect(() => {
    // Initial loading animation - longer for opening splash screen feel
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Auto advance screens
    const autoAdvanceTimer = setTimeout(() => {
      if (currentScreen < 4) {
        const interval = setInterval(() => {
          setCurrentScreen(prev => {
            const next = prev + 1;
            if (next >= 4) {
              clearInterval(interval);
              // Auto complete after last screen, but wait a bit longer
              setTimeout(() => onComplete(), 2000);
              return 4;
            }
            return next;
          });
        }, 4000);
        return () => clearInterval(interval);
      }
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(autoAdvanceTimer);
    };
  }, [currentScreen, onComplete]);

  // Skip all screens
  const handleSkip = () => {
    onComplete();
  };

  // Go to next screen
  const handleNext = () => {
    if (currentScreen < 4) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  // Features to showcase
  const features = [
    {
      icon: <BarChart2 className="w-12 h-12 text-indigo-500" />,
      title: "Visualize seus dados",
      description: "Dashboards interativos e relatórios detalhados para acompanhar o progresso do seu projeto."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-500" />,
      title: "Gerencie sua equipe",
      description: "Organize e acompanhe as atividades da sua equipe com facilidade e eficiência."
    },
    {
      icon: <CalendarRange className="w-12 h-12 text-indigo-500" />,
      title: "Agende suas atividades",
      description: "Planeje e organize todas as suas tarefas e eventos importantes em um calendário intuitivo."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-indigo-500" />,
      title: "Comunique-se facilmente",
      description: "Mantenha sua equipe conectada com mensagens instantâneas e compartilhamento de arquivos."
    }
  ];

  // Loading animation variants
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
    exit: { scale: 1.2, opacity: 0, transition: { duration: 0.5 } }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 2.5 } }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const featureVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }
  };

  // Render loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600/20 via-indigo-500/15 to-primary/20 z-50">
        <motion.div
          initial="initial"
          animate="animate"
          variants={logoVariants}
          className="mb-16"
        >
          <Logo size="xl" variant="full" />
        </motion.div>
        
        <div className="w-64 h-1.5 bg-gray-200/30 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            initial="initial"
            animate="animate"
            variants={progressVariants}
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
          className="text-muted-foreground text-lg"
        >
          Preparando seu ambiente de trabalho...
        </motion.p>

        <motion.div
          className="absolute -z-10 opacity-30"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            transition: { duration: 8, repeat: Infinity, ease: "linear" } 
          }}
        >
          <div className="w-[600px] h-[600px] rounded-full border-2 border-indigo-400/30" />
        </motion.div>
        <motion.div
          className="absolute -z-10 opacity-20"
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1],
            transition: { duration: 12, repeat: Infinity, ease: "linear" } 
          }}
        >
          <div className="w-[800px] h-[800px] rounded-full border-2 border-indigo-300/20" />
        </motion.div>
      </div>
    );
  }

  // Render welcome screens
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-indigo-600/10 via-indigo-500/15 to-primary/10 z-50">
      {/* Background animated elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-400/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Logo size="md" variant="full" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button variant="ghost" onClick={handleSkip}>Pular introdução</Button>
          </motion.div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatePresence mode="wait">
              {currentScreen === 0 && (
                <motion.div
                  key="welcome"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-6"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Bem-vindo ao <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-primary bg-clip-text text-transparent">Nexion</span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Sua plataforma completa para gerenciamento de projetos e equipes com uma experiência
                    moderna e intuitiva.
                  </p>
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90"
                      onClick={handleNext}
                    >
                      Começar
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {currentScreen > 0 && currentScreen <= 4 && (
                <motion.div
                  key={`feature-${currentScreen}`}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-6"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
                    {features[currentScreen - 1].icon}
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {features[currentScreen - 1].title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {features[currentScreen - 1].description}
                  </p>
                  <div className="pt-4 flex space-x-4">
                    <Button 
                      size="lg" 
                      className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90"
                      onClick={handleNext}
                    >
                      {currentScreen < 4 ? 'Próximo' : 'Entrar'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                key="image"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={featureVariants}
                className="hidden md:block relative h-[400px]"
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                  <img 
                    src={`/images/welcome-${currentScreen}.png`} 
                    alt="Feature illustration" 
                    className="w-full h-full object-cover opacity-90"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/6366f1/white?text=Nexion+Feature";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Footer with dots navigation */}
        <footer className="p-8 flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentScreen(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentScreen === index 
                    ? 'bg-indigo-600 w-10' 
                    : 'bg-gray-300 hover:bg-indigo-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
} 