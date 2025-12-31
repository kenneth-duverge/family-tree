import type { FamilyMember } from '@/db/schema/family-members';

type Position = FamilyMember['position'];

interface TreeConnectorProps {
  from: Position;
  to: Position;
}

export function TreeConnector({ from, to }: TreeConnectorProps) {
  // Calculate the path for the connector line
  const path = `M ${from.x} ${from.y + 40} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${
    (from.y + to.y) / 2
  }, ${to.x} ${to.y - 40}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: -1,
      }}
    >
      <path d={path} stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 2" />
    </svg>
  );
}
