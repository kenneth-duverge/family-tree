import type React from 'react';
import { User } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { FamilyMember } from '@/db/schema/family-members';

interface FamilyMemberProps {
  member: FamilyMember;
  style?: React.CSSProperties;
}

export function FamilyMember({ member, style }: FamilyMemberProps) {
  return (
    <Card className="w-52" style={style}>
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
          <p className="text-sm text-muted-foreground">
            {member.dob} {member.dod ? `- ${member.dod}` : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
