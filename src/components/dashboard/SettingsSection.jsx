import Card from '@/components/ui/Card';

// Card with an icon header, body and optional footer (save buttons) — used on the Settings page
export default function SettingsSection({ icon: Icon, title, description, children, footer }) {
  return (
    <Card className="p-0">
      <div className="flex items-start gap-3 border-b border-line/10 px-5 py-4">
        <span className="rounded-lg bg-primary-50 p-2.5 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"><Icon /></span>
        <div>
          <h2 className="text-base">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
        </div>
      </div>
      <div className="px-5 py-5">{children}</div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line/10 px-5 py-3">{footer}</div>}
    </Card>
  );
}
