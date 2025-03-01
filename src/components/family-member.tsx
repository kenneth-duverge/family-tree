import type React from 'react';
import { User } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface Member {
  id?: string;
  name: string;
  birthYear: string;
  parentId?: string;
  position: { x: number; y: number };
  notes?: string;
  imageUrl?: string;
  gender?: string;
  deathYear?: string;
}

interface FamilyMemberProps {
  member: Member;
  style?: React.CSSProperties;
}

export function FamilyMember({ member, style }: FamilyMemberProps) {
  return (
    <Card className="w-40" style={style}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h3 className="font-medium truncate" title={member.name}>
            {member.name}
          </h3>
          <p className="text-sm text-muted-foreground">Born {member.birthYear}</p>
        </div>
      </CardContent>
    </Card>
  );
}
