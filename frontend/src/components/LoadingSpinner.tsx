import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
    </div>
  );
};

export default LoadingSpinner;
