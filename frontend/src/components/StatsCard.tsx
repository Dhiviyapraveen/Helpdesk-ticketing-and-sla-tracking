import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'primary' | 'success' | 'warning' | 'destructive';
  delay?: number;
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatsCard = ({ title, value, icon, color, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: delay + 0.2 }}
            className="mt-1 text-3xl font-bold tracking-tight text-foreground"
          >
            {value}
          </motion.p>
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
