import { seedFamilyMembers } from './family-members';

export const seed = async () => {
  await seedFamilyMembers();
};

seed();
