import { serve, sql } from 'bun';
import { z } from 'zod';
import index from './index.html';

const memberSchema = z.object({
  id: z.string().optional().default(Math.random().toString(36).substr(2, 9)),
  name: z.string(),
  birthYear: z.string(),
  parentId: z.string().nullable(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/members': {
      async GET(req) {
        const members = await sql`SELECT * FROM members`;
        return Response.json({
          members,
        });
      },
    },

    '/api/members/add': {
      async POST(req) {
        const { name, birthYear, parentId, position } = await req.json();
        const parsed = memberSchema.parse({ name, birthYear, parentId, position });

        await sql`INSERT INTO members (name, birthYear, parentId, position) VALUES (${parsed.name}, ${parsed.birthYear}, ${parsed.parentId}, ${parsed.position})`;

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
