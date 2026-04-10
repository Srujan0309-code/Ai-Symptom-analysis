"use client";

import { motion } from "framer-motion";
import { Star, Clock, Phone, MapPin, Navigation, Filter } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  specialty: string;
  rating: number;
  phone: string;
  wait_time_minutes: number;
}

const ClinicCard = ({ clinic, isSelected, onClick }: { clinic: Clinic, isSelected: boolean, onClick: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 ${isSelected ? 'glass-dark border-primary-500 shadow-2xl shadow-primary-500/20' : 'glass border-white/5 hover:border-white/20'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl mb-1">{clinic.name}</h3>
          <p className="text-xs text-foreground/40 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {clinic.address}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-500 px-2 py-1 rounded-lg text-xs font-bold">
          <Star className="h-3 w-3 fill-yellow-500" />
          {clinic.rating}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-foreground/40 uppercase font-bold">Wait Time</div>
            <div className={`text-sm font-bold ${clinic.wait_time_minutes < 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {clinic.wait_time_minutes} mins
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-foreground/40 uppercase font-bold">Distance</div>
            <div className="text-sm font-bold">2.4 km</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-foreground/60 border border-white/5">
          {clinic.specialty}
        </span>
        <button className="text-primary-400 p-2 hover:bg-white/10 rounded-full transition-colors">
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ClinicCard;
