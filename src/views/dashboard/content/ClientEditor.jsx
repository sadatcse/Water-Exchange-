'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import EditorShell from '@/components/dashboard/EditorShell';
import ImageField from '@/components/dashboard/ImageField';
import { Input, Checkbox } from '@/components/forms/FormField';
import Card from '@/components/ui/Card';

const EMPTY = { name: '', logo: '', sector: '', order: 0, published: true };
const pick = ({ name, logo, sector, order, published }) => ({ name, logo, sector, order, published });

function ClientForm({ id, initial }) {
  const router = useRouter();
  const [form, setForm] = useState(() => pick(initial));
  const { run, busy, error } = useSubmit();
  const [success, setSuccess] = useState('');
  const field = (key) => ({ name: key, value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

  const submit = async () => {
    setSuccess('');
    const body = { ...form, order: Number(form.order) || 0 };
    const res = await run(() => (id ? apiSecure.put(`/clients/${id}`, body) : apiSecure.post('/clients', body)));
    if (!res) return;
    if (id) {
      setForm(pick(res.data.data));
      setSuccess(res.data.message);
    } else {
      router.push('/dashboard/clients');
    }
  };

  return (
    <EditorShell
      title={id ? `Edit: ${initial.name || 'client'}` : 'Add client'}
      backHref="/dashboard/clients"
      backLabel="Clients"
      isNew={!id}
      busy={busy}
      error={error}
      success={success}
      onSubmit={submit}
    >
      <Card title="Client">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Company name" maxLength={160} placeholder="Optional — shown under the logo" {...field('name')} />
          <Input label="Sector" maxLength={80} placeholder="Garments, Healthcare…" {...field('sector')} />
          <Input label="Display order" type="number" {...field('order')} />
        </div>
        <div className="mt-4">
          <ImageField
            label="Logo"
            name="logo"
            value={form.logo}
            onChange={(logo) => setForm((f) => ({ ...f, logo }))}
            required
            hint="A /images/clients/… path or a full https:// URL. A logo on a white or transparent background looks best."
            aspect="aspect-[2/1]"
          />
        </div>
        <Checkbox
          className="mt-4"
          label="Show on website"
          name="published"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
        />
      </Card>
    </EditorShell>
  );
}

// id = client id to edit, or undefined for a new client
export default function ClientEditor({ id }) {
  const { data, loading, error } = useApi(id ? `/clients/${id}` : null, { select: (res) => res.data });
  if (id && (loading || error || !data)) {
    return <EditorShell title="Edit client" backHref="/dashboard/clients" backLabel="Clients" loading={loading} loadError={error || (!loading && 'Client not found.')} />;
  }
  return <ClientForm key={id || 'new'} id={id} initial={data || EMPTY} />;
}
