import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export function Toast({ message, type = 'success' }) {
  const Icon = icons[type] || CheckCircle;
  const bg = type === 'error' ? 'bg-red-100 border-red-300 text-red-800' : type === 'info' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-green-100 border-green-300 text-green-800';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card animate-toast-in ${bg} transition-all duration-300`}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0" aria-hidden />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
