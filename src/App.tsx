import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Background, BACKGROUNDS, BackgroundTheme } from "@/components/layout/Background";
import { Pomodoro } from "@/components/features/Pomodoro";
import { MusicPlayer } from "@/components/features/MusicPlayer";
import { TodoContainer } from "@/components/features/TodoContainer";
import { NotebookContainer } from "@/components/features/NotebookContainer";
import { LoginOverlay } from "@/components/auth/LoginOverlay";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(BACKGROUNDS[0]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 font-medium animate-pulse">Entering the Loft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full font-serif overflow-x-hidden selection:bg-[#8B5E3C]/30 text-[#423a33]">
      <Background currentTheme={currentTheme} setTheme={setCurrentTheme} />

      <AnimatePresence>
        {!user && <LoginOverlay />}
      </AnimatePresence>

      <main className="relative z-10 container mx-auto px-4 py-4 flex flex-col gap-6 min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold text-[#FDFCF0] tracking-tighter drop-shadow-2xl">
              Lofi Loft
            </h1>
            <p className="text-[#FDFCF0]/60 text-[9px] uppercase tracking-widest font-sans font-bold">Your focus sanctuary</p>
          </motion.div>

          {user && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-[#FDFCF0]/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C]/20 flex items-center justify-center overflow-hidden border border-white/10 p-0.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#FDFCF0] text-[11px] font-bold leading-none">{user.displayName || "Explorer"}</span>
                  <span className="text-[#FDFCF0]/40 text-[8px] uppercase tracking-tighter font-sans font-bold">Active Session</span>
                </div>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="text-[#FDFCF0]/40 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </header>

        {/* Desktop Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Timer, Player, Todos */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Pomodoro />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MusicPlayer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1"
            >
              <TodoContainer />
            </motion.div>
          </div>

          {/* Right Column: Notebook */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 h-[600px] lg:h-auto min-h-[500px]"
          >
            <NotebookContainer />
          </motion.div>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="relative z-10 container mx-auto px-4 pb-8 text-center text-[#FDFCF0]/20 text-[9px] font-sans font-bold uppercase tracking-[0.2em] mb-4">
        <p>Built for shamsa • Lo-fi loft experience © 2026</p>
      </footer>
    </div>
  );
}
