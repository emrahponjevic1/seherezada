import { useState, type ReactNode } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export function DevViewportSwitcher({ children }: { children: ReactNode }) {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop" | "full">("full");

  // Only show this switcher in development, but for simplicity here we just render it.
  
  const getWidthClass = () => {
    switch (viewport) {
      case "mobile": return "max-w-[390px] h-[844px] rounded-[3rem] border-[8px] border-black my-8 overflow-y-auto shadow-2xl"; // iPhone 14 size
      case "tablet": return "max-w-[768px] h-[1024px] rounded-3xl border-[8px] border-black my-8 overflow-y-auto shadow-2xl"; // iPad size
      case "desktop": return "max-w-[1440px] h-[900px] rounded-xl border-[8px] border-black my-8 overflow-y-auto shadow-2xl"; // Desktop size
      default: return "w-full min-h-screen";
    }
  };

  return (
    <div className={`min-h-screen w-full ${viewport !== "full" ? "bg-zinc-900 py-12 flex justify-center items-start overflow-y-auto" : "bg-background"}`}>
      
      {/* Pill Bar - moved to bottom-left corner to avoid overlapping header nav links */}
      <div className="fixed bottom-6 left-6 z-[9999] bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-2 flex gap-2 items-center shadow-2xl">
        <button 
          onClick={() => setViewport("mobile")} 
          className={`p-2 rounded-full transition-colors ${viewport === "mobile" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
          title="Mobile View"
        >
          <Smartphone size={18} />
        </button>
        <button 
          onClick={() => setViewport("tablet")} 
          className={`p-2 rounded-full transition-colors ${viewport === "tablet" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
          title="Tablet View"
        >
          <Tablet size={18} />
        </button>
        <button 
          onClick={() => setViewport("desktop")} 
          className={`p-2 rounded-full transition-colors ${viewport === "desktop" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
          title="Desktop View"
        >
          <Monitor size={18} />
        </button>
        <div className="w-px h-6 bg-white/20 mx-1"></div>
        <button 
          onClick={() => setViewport("full")} 
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewport === "full" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
        >
          100%
        </button>
      </div>

      {/* App Container */}
      <div className={`relative bg-background transition-all duration-500 ease-in-out origin-top ${getWidthClass()}`}>
        {children}
      </div>
    </div>
  );
}
