import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, action, icon = Inbox }) {
  const IconComponent = icon;
  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary/70 mb-4">
        <IconComponent className="w-8 h-8" aria-hidden />
      </div>
      {title && <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>}
      {description && <div className="text-primary/70 mb-6 max-w-md mx-auto">{description}</div>}
      {action}
    </div>
  );
}
