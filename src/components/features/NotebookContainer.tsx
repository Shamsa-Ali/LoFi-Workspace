import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Save, ArrowLeft } from "lucide-react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  updatedAt: any;
}

export function NotebookContainer() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesList);
      setLoading(false);
      
      if (selectedNote) {
        const updated = notesList.find(n => n.id === selectedNote.id);
        if (updated) setSelectedNote(updated);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "notes");
    });

    return () => unsubscribe();
  }, []);

  const handleCreateNote = async () => {
    if (!auth.currentUser) return;
    try {
      const newNote = {
        title: "Study Session Notes",
        content: "",
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "notes"), newNote);
      const note = { id: docRef.id, ...newNote } as Note;
      setSelectedNote(note);
      setIsEditing(true);
      setEditTitle(note.title);
      setEditContent(note.content);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "notes");
    }
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    try {
      await updateDoc(doc(db, "notes", selectedNote.id), {
        title: editTitle,
        content: editContent,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notes/${selectedNote.id}`);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "notes", id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
    }
  };

  const startEdit = () => {
    if (!selectedNote) return;
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setIsEditing(true);
  };

  return (
    <div className="bg-[#FDFCF0] shadow-natural rounded-2xl overflow-hidden flex h-full text-[#423a33] relative">
      {/* Binder Rings */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-none hidden md:flex">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-r from-[#d1d1d1] to-[#8c8c8c] border border-black/20 shadow-md"></div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-56 border-r border-[#d4cfbc] flex flex-col transition-all bg-[#FDFCF0]/50 backdrop-blur-sm",
        selectedNote && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-[#d4cfbc] flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#8B5E3C]">Notes</span>
          <Button onClick={handleCreateNote} size="icon" variant="ghost" className="hover:bg-[#8B5E3C]/10 text-[#8B5E3C] h-8 w-8">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                }}
                className={cn(
                  "p-2 rounded-lg cursor-pointer group transition-all relative border border-transparent",
                  selectedNote?.id === note.id ? "bg-[#e6e2d1] border-[#d4cfbc]" : "hover:bg-[#e6e2d1]/50"
                )}
              >
                <p className="font-bold text-xs truncate pr-6 text-[#5c5249]">{note.title}</p>
                <p className="text-[9px] text-[#8B5E3C] mt-0.5 italic">
                  {note.content.substring(0, 30) || "No content yet..."}
                </p>
                <button
                  onClick={(e) => handleDelete(note.id, e)}
                  className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor/Viewer */}
      <div className={cn(
        "flex-1 flex flex-col relative",
        !selectedNote && "hidden md:flex justify-center items-center text-[#8B5E3C]/30"
      )}>
        {selectedNote ? (
          <>
            <div className="p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-[#8B5E3C] h-8 w-8"
                  onClick={() => setSelectedNote(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="font-sans font-bold text-[9px] uppercase tracking-widest text-[#8B5E3C]">
                  {isEditing ? "Drafting" : "Journal Entry"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleSave} size="sm" className="h-8 bg-[#4A5D23] hover:bg-[#323f18] text-[#FDFCF0] rounded-full px-4 font-bold text-[10px]">
                    <Save className="w-3 h-3 mr-2" /> SAVE
                  </Button>
                ) : (
                  <Button onClick={startEdit} size="sm" variant="ghost" className="h-8 text-[#8B5E3C] hover:bg-[#8B5E3C]/10 rounded-full px-4 font-bold text-[10px]">
                    <Edit3 className="w-3 h-3 mr-2" /> EDIT
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 px-8 pb-8 lined-paper overflow-hidden">
              {isEditing ? (
                <div className="flex flex-col h-full pt-2">
                  <Input 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="bg-transparent border-none text-xl font-bold p-0 focus-visible:ring-0 text-[#8B5E3C] mb-4"
                    placeholder="Subject..."
                  />
                  <Textarea 
                    value={editContent} 
                    onChange={e => setEditContent(e.target.value)}
                    className="flex-1 bg-transparent border-none resize-none p-0 focus-visible:ring-0 text-base leading-[2rem] text-[#5c5249]"
                    placeholder="Tell your story..."
                  />
                </div>
              ) : (
                <ScrollArea className="h-full pr-4">
                  <div className="pt-2">
                    <h1 className="text-xl font-bold mb-3 text-[#8B5E3C]">{selectedNote.title}</h1>
                    <div className="markdown-body leading-[2rem] text-sm">
                      <ReactMarkdown>{selectedNote.content || "_Start typing your notes here..._"}</ReactMarkdown>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#8B5E3C]/20 flex items-center justify-center">
              <Plus className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-serif italic text-lg px-8 text-center">Capture your thoughts in the quiet loft</p>
          </div>
        )}
      </div>
    </div>
  );
}
