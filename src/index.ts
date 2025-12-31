import { serve } from 'bun';

import { familyMembers, familyMemberSchema } from './db/schema/family-members';

import { db } from './db';

import index from './index.html';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/family-members': {
      async GET(req) {
        const members = await db.select().from(familyMembers);
        return Response.json({
          members,
        });
      },
      async POST(req) {
        const body = await req.json();
        const parsed = familyMemberSchema.parse(body);
        const { id, ...memberData } = parsed;

        await db
          .insert(familyMembers)
          .values(memberData as unknown as typeof familyMembers.$inferInsert);

        return Response.json(
          {
            message: 'Member added',
          },
          {
            status: 201,
          }
        );
      },
    },

    '/api/hello': {
      async GET(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== 'production',
});

console.log(`🚀 Server running at ${server.url}`);
