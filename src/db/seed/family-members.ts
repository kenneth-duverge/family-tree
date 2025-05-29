// This file is used to seed the database with family members
// It is run with `bun run db:seed`

import { db } from '../../db';

import familyMembersData from '../data/family-members.json';
import { familyMembers } from '../schema/family-members';

export const seedFamilyMembers = async () => {
  await db.insert(familyMembers).values(familyMembersData);
};
