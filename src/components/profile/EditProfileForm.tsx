import { useMemo, useRef, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials, cn } from '@/lib/utils';
import { PROFILE_ICONS, PROFILE_STRINGS, SOCIAL_OPTIONS, type SocialType } from '@/lib/constants';
import type { UserProfile, UpdateUserProfileRequest } from '@/types/user.types';
import { toast } from 'sonner';

interface SocialLink {
  id: string;
  type: SocialType;
  url: string;
}

interface EditProfileFormProps {
  user: UserProfile;
  fallbackAvatarUrl?: string;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (changes: UpdateUserProfileRequest) => void;
}

export function EditProfileForm({
  user,
  fallbackAvatarUrl,
  isSaving,
  onCancel,
  onSave,
}: EditProfileFormProps) {
  // ── Backend-persisted fields ──────────────────────────────
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Frontend-only fields (TODO backend) ───────────────────
  const [location, setLocation] = useState('');
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  const avatarSrc = avatarPreview ?? user.avatarUrl ?? fallbackAvatarUrl;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addSocial = (type: SocialType) => {
    setSocials((prev) => [...prev, { id: crypto.randomUUID(), type, url: '' }]);
  };

  const updateSocial = (id: string, url: string) => {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, url } : s)));
  };

  const removeSocial = (id: string) => {
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  const addChip = (
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const value = input.trim();
    if (!value) return;
    if (list.includes(value)) {
      setInput('');
      return;
    }
    setList([...list, value]);
    setInput('');
  };

  const removeChip = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((v) => v !== value));
  };

  // ── Dirty diff: only send changed persisted fields ────────
  const changes = useMemo<UpdateUserProfileRequest>(() => {
    const diff: UpdateUserProfileRequest = {};
    if (fullName !== user.fullName) diff.fullName = fullName;
    if (email !== user.email) diff.email = email;
    if (bio !== (user.bio ?? '')) diff.bio = bio;
    if (phoneNumber !== (user.phoneNumber ?? '')) diff.phoneNumber = phoneNumber;
    if (avatarFile) diff.avatar = avatarFile;
    return diff;
  }, [fullName, email, bio, phoneNumber, avatarFile, user]);

  const hasChanges = Object.keys(changes).length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) {
      toast.info('No changes to save.');
      return;
    }
    onSave(changes);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* ── Top action bar ───────────────────────────────────── */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          {PROFILE_STRINGS.BUTTONS.CANCEL}
        </Button>
        <Button
          type="submit"
          size="sm"
          className="bg-[#824892] hover:bg-[#6f3a80]"
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? 'Saving…' : PROFILE_STRINGS.BUTTONS.SAVE_CHANGES}
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* ── Avatar uploader ─────────────────────────────────── */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative block"
          >
            <Avatar className="size-28 ring-4 ring-[#824892]/20">
              <AvatarImage src={avatarSrc ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-[#824892] text-white text-2xl font-semibold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <img src={PROFILE_ICONS.CAMERA} alt="" className="size-6 brightness-0 invert" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* ── Persisted text fields ───────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          <Field iconSrc={PROFILE_ICONS.USER} label={PROFILE_STRINGS.FIELDS.FULL_NAME} required>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.FULL_NAME}
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field iconSrc={PROFILE_ICONS.EMAIL} label={PROFILE_STRINGS.FIELDS.EMAIL} required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.EMAIL}
                required
              />
            </Field>
            <Field
              iconSrc={PROFILE_ICONS.EMAIL}
              iconFallback="☎"
              label={PROFILE_STRINGS.FIELDS.PHONE_NUMBER}
            >
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.PHONE_NUMBER}
              />
            </Field>
          </div>

          <Field
            iconSrc={PROFILE_ICONS.LOCATION}
            label={PROFILE_STRINGS.FIELDS.LOCATION}
            hint={PROFILE_STRINGS.NOT_SAVED_HINT}
          >
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.LOCATION}
            />
          </Field>

          <Field iconSrc={PROFILE_ICONS.BIO} label={PROFILE_STRINGS.FIELDS.BIO}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.BIO}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </Field>
        </div>
      </div>

      {/* ── Social Links (frontend-only) ─────────────────────── */}
      <Section
        iconSrc={PROFILE_ICONS.LINK}
        title={PROFILE_STRINGS.FIELDS.SOCIAL_LINKS}
        hint={PROFILE_STRINGS.NOT_SAVED_HINT}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" className="gap-1 bg-[#824892] hover:bg-[#6f3a80]">
                <Plus className="size-3.5" />
                {PROFILE_STRINGS.BUTTONS.ADD}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              collisionPadding={16}
              className="w-48 rounded-2xl p-4 flex flex-col gap-4"
            >
              {SOCIAL_OPTIONS.map(({ type, label, icon }) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addSocial(type)}
                  className="group flex items-center gap-4 px-0 py-0 rounded-none focus:bg-transparent cursor-pointer"
                >
                  <img src={icon} alt="" className="size-6 shrink-0" />
                  <span className="text-base font-normal leading-5 text-[#1A1A1A] group-hover:text-[#824892] group-focus:text-[#824892]">
                    {label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {socials.length === 0 ? (
          <p className="text-xs text-[#9CA3AF]">No social links added.</p>
        ) : (
          <ul className="space-y-2">
            {socials.map((s) => {
              const opt = SOCIAL_OPTIONS.find((o) => o.type === s.type)!;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <img src={opt.icon} alt="" className="size-5 shrink-0" />
                  <Input
                    value={s.url}
                    onChange={(e) => updateSocial(s.id, e.target.value)}
                    placeholder={`${opt.label} — ${PROFILE_STRINGS.FIELD_PLACEHOLDERS.SOCIAL_URL}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(s.id)}
                    className="shrink-0 rounded-md p-2 text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#E11D48]"
                    aria-label="Remove social link"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ── Skills (frontend-only) ───────────────────────────── */}
      <Section
        iconSrc={PROFILE_ICONS.SKILLS}
        title={PROFILE_STRINGS.FIELDS.SKILLS}
        hint={PROFILE_STRINGS.NOT_SAVED_HINT}
      >
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addChip(skillInput, setSkillInput, skills, setSkills);
              }
            }}
            placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.SKILL}
          />
          <Button
            type="button"
            size="sm"
            className="gap-1 bg-[#824892] hover:bg-[#6f3a80]"
            onClick={() => addChip(skillInput, setSkillInput, skills, setSkills)}
          >
            <Plus className="size-3.5" />
            {PROFILE_STRINGS.BUTTONS.ADD}
          </Button>
        </div>
        <ChipList
          items={skills}
          onRemove={(v) => removeChip(v, skills, setSkills)}
          className="mt-3"
        />
      </Section>

      {/* ── Interests (frontend-only) ────────────────────────── */}
      <Section
        iconSrc={PROFILE_ICONS.INTERESTS}
        title={PROFILE_STRINGS.FIELDS.INTERESTS}
        hint={PROFILE_STRINGS.NOT_SAVED_HINT}
      >
        <div className="flex gap-2">
          <Input
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addChip(interestInput, setInterestInput, interests, setInterests);
              }
            }}
            placeholder={PROFILE_STRINGS.FIELD_PLACEHOLDERS.INTEREST}
          />
          <Button
            type="button"
            size="sm"
            className="gap-1 bg-[#824892] hover:bg-[#6f3a80]"
            onClick={() => addChip(interestInput, setInterestInput, interests, setInterests)}
          >
            <Plus className="size-3.5" />
            {PROFILE_STRINGS.BUTTONS.ADD}
          </Button>
        </div>
        <ChipList
          items={interests}
          onRemove={(v) => removeChip(v, interests, setInterests)}
          className="mt-3"
        />
      </Section>
    </form>
  );
}

// ─── Local subcomponents ─────────────────────────────────────

function Field({
  iconSrc,
  iconFallback,
  label,
  required,
  hint,
  children,
}: {
  iconSrc?: string;
  iconFallback?: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
        {iconSrc ? (
          <img src={iconSrc} alt="" className="size-4" />
        ) : iconFallback ? (
          <span className="text-[#824892]">{iconFallback}</span>
        ) : null}
        {label}
        {required && <span className="text-[#E11D48]">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-[#9CA3AF]">({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function Section({
  title,
  hint,
  action,
  iconSrc,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  iconSrc?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-semibold text-[#1A1A1A]">
          {iconSrc && <img src={iconSrc} alt="" className="size-4 shrink-0" />}
          <span>{title}</span>
          {hint && <span className="text-xs font-normal text-[#9CA3AF]">({hint})</span>}
        </h3>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

function ChipList({
  items,
  onRemove,
  className,
}: {
  items: string[];
  onRemove: (v: string) => void;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-fuchsia-800/10 to-fuchsia-700/10 px-3 py-1 text-xs font-medium text-[#824892] outline outline-fuchsia-800/30"
        >
          {v}
          <button
            type="button"
            onClick={() => onRemove(v)}
            className="rounded-full hover:text-[#E11D48]"
            aria-label={`Remove ${v}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
