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

const EMPTY = { name: '', role: '', credentials: '', photo: '', featured: false, order: 0, published: true };
const pick = ({ name, role, credentials, photo, featured, order, published }) => ({ name, role, credentials, photo, featured, order, published });

function MemberForm({ id, initial }) {
  const router = useRouter();
  const [form, setForm] = useState(() => pick(initial));
  const { run, busy, error } = useSubmit();
  const [success, setSuccess] = useState('');
  const field = (key) => ({ name: key, value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });
  const toggle = (key) => ({ name: key, checked: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.checked })) });

  const submit = async () => {
    setSuccess('');
    const body = { ...form, order: Number(form.order) || 0 };
    const res = await run(() => (id ? apiSecure.put(`/team/${id}`, body) : apiSecure.post('/team', body)));
    if (!res) return;
    if (id) {
      setForm(pick(res.data.data));
      setSuccess(res.data.message);
    } else {
      router.push('/dashboard/team');
    }
  };

  return (
    <EditorShell
      title={id ? `Edit: ${initial.name}` : 'Add team member'}
      backHref="/dashboard/team"
      backLabel="Team"
      isNew={!id}
      busy={busy}
      error={error}
      success={success}
      onSubmit={submit}
    >
      <Card title="Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" required maxLength={120} {...field('name')} />
          <Input label="Role" required maxLength={120} placeholder="Consultant (ETP & STP)" {...field('role')} />
          <Input label="Credentials" maxLength={200} placeholder="BSc Engineer (Civil)" {...field('credentials')} />
          <Input label="Display order" type="number" {...field('order')} />
        </div>
        <div className="mt-4">
          <ImageField
            label="Photo"
            name="photo"
            value={form.photo}
            onChange={(photo) => setForm((f) => ({ ...f, photo }))}
            hint="Optional — a square photo works best. Initials are shown without one."
            aspect="aspect-square"
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Checkbox label="Featured" description="Shown in the large card. Only one member can be featured." {...toggle('featured')} />
          <Checkbox label="Show on website" {...toggle('published')} />
        </div>
      </Card>
    </EditorShell>
  );
}

// id = member id to edit, or undefined for a new member
export default function TeamEditor({ id }) {
  const { data, loading, error } = useApi(id ? `/team/${id}` : null, { select: (res) => res.data });
  if (id && (loading || error || !data)) {
    return <EditorShell title="Edit team member" backHref="/dashboard/team" backLabel="Team" loading={loading} loadError={error || (!loading && 'Team member not found.')} />;
  }
  return <MemberForm key={id || 'new'} id={id} initial={data || EMPTY} />;
}
