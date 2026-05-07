import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Phone, MapPin, Navigation, Info, Mail, Calendar } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  specialty: string;
  rating: number;
  phone: string;
  email?: string;
  opening_hours?: string;
  isOpen?: boolean;
  wait_time_minutes: number;
}

const ClinicCard = ({ clinic, isSelected, onClick }: { clinic: Clinic, isSelected: boolean, onClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${clinic.phone}`;
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${isSelected ? 'surface-float ring-2 ring-emerald/20 editorial-shadow-hover' : 'surface-card'}`}
    >
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex-1">
          <h3 className="font-heading font-bold text-lg text-foreground mb-1 line-clamp-2 leading-snug">{clinic.name}</h3>
          <p className="text-[11px] text-on-surface-variant flex items-center gap-1 font-body">
            <MapPin className="h-3 w-3" />
            {clinic.address}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 ml-3">
          <div className="flex items-center gap-1 bg-amber-500/8 text-amber-600 px-2 py-1 rounded-lg text-[10px] font-heading font-bold">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {clinic.rating}
          </div>
          {clinic.isOpen !== undefined && (
            <div className={`text-[9px] uppercase font-heading font-black px-2 py-0.5 rounded-full ${clinic.isOpen ? 'badge-low' : 'badge-emergency'}`}>
              {clinic.isOpen ? '• Open Now' : '• Closed'}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald/8 flex items-center justify-center text-emerald">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] text-on-surface-variant uppercase font-heading font-bold tracking-[0.1em]">Wait Time</div>
            <div className={`text-sm font-heading font-bold ${clinic.wait_time_minutes < 15 ? 'text-emerald' : 'text-amber-600'}`}>
              {clinic.wait_time_minutes} mins
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lavender/8 flex items-center justify-center text-lavender">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] text-on-surface-variant uppercase font-heading font-bold tracking-[0.1em]">Distance</div>
            <div className="text-sm font-heading font-bold text-foreground">2.4 km</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-5 mt-5 space-y-4 relative z-10 border-t border-outline-variant/10"
          >
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-4 w-4 text-emerald mt-0.5" />
              <div className="leading-tight">
                <div className="font-heading font-bold text-[9px] text-on-surface-variant uppercase tracking-[0.1em] mb-1">Email</div>
                {clinic.email ? (
                  <a
                    href={`mailto:${clinic.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-foreground hover:text-emerald transition-colors font-body text-xs"
                  >
                    {clinic.email}
                  </a>
                ) : (
                  <span className="text-outline italic text-xs">Not available</span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Phone className="h-4 w-4 text-emerald mt-0.5" />
              <div className="leading-tight">
                <div className="font-heading font-bold text-[9px] text-on-surface-variant uppercase tracking-[0.1em] mb-1">Phone</div>
                {clinic.phone ? (
                  <a
                    href={`tel:${clinic.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-foreground hover:text-emerald transition-colors font-body text-xs"
                  >
                    {clinic.phone}
                  </a>
                ) : (
                  <span className="text-outline italic text-xs">Not available</span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Calendar className="h-4 w-4 text-emerald mt-0.5" />
              <div className="leading-tight">
                <div className="font-heading font-bold text-[9px] text-on-surface-variant uppercase tracking-[0.1em] mb-1">Hours</div>
                <span className="text-foreground font-body text-xs">{clinic.opening_hours || '24/7 Service'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-5 relative z-10">
        <span className="text-[10px] font-heading font-bold px-3 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-[0.1em]">
          {clinic.specialty}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleExpand}
            className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-emerald text-white editorial-shadow' : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'}`}
          >
            <Info className="h-4 w-4" />
          </button>
          <button 
            onClick={handleCall}
            className="text-lavender p-2 bg-lavender/8 hover:bg-lavender/15 rounded-xl transition-all"
            title="Call Clinic"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClinicCard;
