"use client";

import countries from "../../../../data/countries.json";
import { Field, WizardShell, inputCls } from "@/components/wizard/WizardShell";
import { patchSection, useDraft } from "@/lib/wizard/store";

export default function ProfilePage() {
  const { profile } = useDraft();
  const set = (k: keyof typeof profile, v: string) => patchSection("profile", { [k]: v });

  return (
    <WizardShell section="profile" title="Personal information" description="Matches FORM 1 §1–4. Use the name on your passport.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Family name (surname)">
          <input className={inputCls} value={profile.familyName ?? ""} onChange={(e) => set("familyName", e.target.value)} />
        </Field>
        <Field label="Given name">
          <input className={inputCls} value={profile.givenName ?? ""} onChange={(e) => set("givenName", e.target.value)} />
        </Field>
        <Field label="Middle name (optional)">
          <input className={inputCls} value={profile.middleName ?? ""} onChange={(e) => set("middleName", e.target.value)} />
        </Field>
        <Field label="Date of birth" hint="YYYY-MM-DD. Must be born after 2001-03-01.">
          <input type="date" className={inputCls} value={profile.dateOfBirth ?? ""} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </Field>
        <Field label="Gender">
          <select className={inputCls} value={profile.gender ?? ""} onChange={(e) => set("gender", e.target.value)}>
            <option value="">—</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="X">Other / prefer not to say</option>
          </select>
        </Field>
        <Field label="Citizenship">
          <select className={inputCls} value={profile.citizenshipCountryCode ?? ""} onChange={(e) => set("citizenshipCountryCode", e.target.value)}>
            <option value="">—</option>
            {countries.countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Address country">
          <input className={inputCls} value={profile.addressCountry ?? ""} onChange={(e) => set("addressCountry", e.target.value)} />
        </Field>
        <Field label="Phone (with country code)">
          <input className={inputCls} value={profile.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Address line 1">
          <input className={inputCls} value={profile.addressLine1 ?? ""} onChange={(e) => set("addressLine1", e.target.value)} />
        </Field>
        <Field label="Address line 2 (optional)">
          <input className={inputCls} value={profile.addressLine2 ?? ""} onChange={(e) => set("addressLine2", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={profile.email ?? ""} onChange={(e) => set("email", e.target.value)} />
        </Field>
      </div>
    </WizardShell>
  );
}
