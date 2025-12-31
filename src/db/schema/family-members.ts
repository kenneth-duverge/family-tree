import { createSelectSchema } from 'drizzle-zod';

import { jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  name: text('name'),
  dob: text('dob'),
  dod: text('dod'),
  parentId: text('parent_id'),
  position: jsonb('position').$type<{ x: number; y: number }>(),
  notes: text('notes'),
  imageUrl: text('image_url'),
  gender: text('gender'),
});

export const familyMemberSchema = createSelectSchema(familyMembers);

export type FamilyMember = typeof familyMembers.$inferSelect;
