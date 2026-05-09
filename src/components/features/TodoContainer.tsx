import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: any;
}

export function TodoContainer() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setTodos([]);
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);
      const q = query(
        collection(db, "todos"),
        where("userId", "==", user.uid)
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const todoList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        
        const sortedTodos = todoList.sort((a, b) => {
          const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        
        setTodos(sortedTodos);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setError("Failed to sync your todos. Please try again later.");
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setNewTodo("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "todos");
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      await updateDoc(doc(db, "todos", todo.id), {
        completed: !todo.completed
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `todos/${todo.id}`);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `todos/${id}`);
    }
  };

  return (
    <Card className="bg-[#FDFCF0]/95 shadow-natural rounded-2xl text-[#423a33] w-full h-[300px] flex flex-col border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#8B5E3C]">To Do's</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3 pr-4">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-full bg-[#8B5E3C]/5 animate-pulse rounded" />
                ))}
              </div>
            ) : error ? (
              <p className="text-[10px] text-red-500 italic p-4 text-center bg-red-500/5 rounded-lg border border-red-500/10">
                {error}
              </p>
            ) : (
              <>
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group flex items-start gap-4 transition-all"
                  >
                    <button
                      onClick={() => toggleTodo(todo)}
                      className="mt-1 w-4 h-4 rounded border-2 border-[#8B5E3C]/30 flex items-center justify-center transition-colors"
                    >
                      {todo.completed && (
                        <div className="w-2 h-2 bg-[#8B5E3C] rounded-sm" />
                      )}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm transition-all leading-tight pt-0.5",
                      todo.completed && "text-[#8B5E3C]/40 line-through"
                    )}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#8B5E3C]/40 hover:text-red-700 transition-all pt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {todos.length === 0 && (
                  <div className="flex flex-col items-center gap-4 mt-8 opacity-20">
                    <CheckCircle2 className="w-12 h-12" />
                    <p className="text-sm font-serif italic">Your desk is clear</p>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={addTodo} className="mt-auto relative pt-4 border-t border-[#8B5E3C]/10">
          <Input
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="w-full bg-transparent border-none border-b border-[#8B5E3C]/20 text-xs py-2 focus-visible:ring-0 rounded-none px-0 placeholder:text-[#8B5E3C]/30 placeholder:italic"
          />
          <button 
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8B5E3C] font-bold text-xl cursor-pointer hover:scale-110 transition-transform"
          >
            +
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
