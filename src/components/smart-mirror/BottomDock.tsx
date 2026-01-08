import { useState } from "react";
import { Menu, Music, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeatureMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* FLOATING ICON */}
     <button
  onClick={() => setOpen(!open)}
  className={`
    fixed
    bottom-24 right-24
    z-50
    w-14 h-14
    rounded-full
    bg-white/5
    border border-white/10
    text-white
    flex items-center justify-center
    backdrop-blur
    animate-pulse-slow
    transition-all duration-200
    ${open ? "bg-white/10 scale-105" : "hover:bg-white/10 hover:scale-105"}
  `}
>
  <Menu size={30} strokeWidth={2} />
</button>


      {/* FEATURE POPUP */}
      {open && (
        <div
           className="fixed bottom-40 right-20 z-40
             w-64 rounded-2xl
             bg-black/85 backdrop-blur-xl
             border border-white/10
             p-4 space-y-3
             animate-slide-up"
        >
          <FeatureItem
            icon={<Music size={22} />}
            label="Music"
            onClick={() => {
              setOpen(false);
              // later: open music UI
            }}
          />

          <FeatureItem
            icon={<User size={22} />}
            label="Account"
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
          />
        </div>
      )}
    </>
  );
}

function FeatureItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4
                 px-4 py-3 rounded-xl
                 text-white text-lg
                 hover:bg-white/10 transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
