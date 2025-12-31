'use client';

import { Maximize2, Plus, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Button } from '@/components/ui/button';

import { AddMemberForm } from '@/components/add-member-form';
import { FamilyMember } from '@/components/family-member';
import { TreeConnector } from '@/components/tree-connector';
import { useQuery } from '@tanstack/react-query';

interface Member {
  id?: string;
  name: string;
  dob: string;
  dod?: string;
  parentid?: string;
  position: { x: number; y: number };
  notes?: string;
  gender?: string;
  imageUrl?: string;
}

export default function FamilyTreePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => {
      return fetch('/api/family-members').then((res) => res.json());
    },
  });
  const [showForm, setShowForm] = useState(false);
  const transformComponentRef = useRef(null);

  const addMember = (member: Omit<Member, 'id' | 'position'>) => {
    const newMember: Member = {
      ...member,
      position: calculatePosition(member.parentid),
    };
    fetch('/api/members/add', {
      method: 'POST',
      body: JSON.stringify(newMember),
    });
    setShowForm(false);
  };

  const calculatePosition = (parentId?: string) => {
    // Canvas center points
    const centerX = 1500;
    const centerY = 1000;

    if (!parentId) {
      // If no parent, position around the center top of the canvas
      const existingRoots = data?.members.filter((m) => !m.parentid);
      const rootIndex = existingRoots.length;
      const rootOffset = rootIndex * 250 - (existingRoots.length * 250) / 2;
      return {
        x: centerX + rootOffset,
        y: 200, // Keep this fixed for the first generation
      };
    }

    const parent = data?.members.find((m) => m.id === parentId);
    if (!parent) return { x: centerX, y: 200 };

    // Find siblings (children of the same parent)
    const siblings = data?.members.filter((m) => m.parentid === parentId);
    const siblingIndex = siblings.length;
    const siblingOffset = siblingIndex * 250 - (siblings.length * 250) / 2;

    return {
      x: parent.position.x + siblingOffset,
      y: parent.position.y + 200,
    };
  };

  const centerTree = (centerCallback: (scale: number) => void) => {
    if (!data?.members.length) return;

    // Calculate the bounding box of all nodes
    const bounds = data.members.reduce(
      (acc, member) => {
        return {
          minX: Math.min(acc.minX, member.position.x),
          maxX: Math.max(acc.maxX, member.position.x),
          minY: Math.min(acc.minY, member.position.y),
          maxY: Math.max(acc.maxY, member.position.y),
        };
      },
      {
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      }
    );

    // Calculate center point of the tree
    const treeCenterX = (bounds.minX + bounds.maxX) / 2;
    const treeCenterY = (bounds.minY + bounds.maxY) / 2;

    // Get the container dimensions
    const container = document.querySelector('.transform-component-module_content__FBWxo');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;
    // Call the callback with the calculated positions
    centerCallback(containerCenterX - treeCenterX);
  };

  return (
    <div className="min-h-screen bg-background p-4 w-screen">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold">Family Tree</h1>
        </Link>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="relative h-[calc(100vh-8rem)] w-full rounded-lg border bg-muted/50 overflow-hidden">
        <TransformWrapper limitToBounds={false} initialScale={1} centerOnInit>
          {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
            <>
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    centerTree((x) => {
                      setTransform(x, 0, 0.8, 750);
                    })
                  }
                  title="Center Tree"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => resetTransform()}
                  title="Reset View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </Button>
                <Button variant="secondary" size="icon" onClick={() => zoomIn()} title="Zoom In">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" onClick={() => zoomOut()} title="Zoom Out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>

              <TransformComponent>
                <div className="relative w-[3000px] h-[2000px]">
                  {data?.members.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Add your first family member to start building the tree
                    </div>
                  ) : (
                    <>
                      {/* Draw connections first so they appear behind nodes */}
                      {/* {data?.members?.map((member) =>
                        member.parentId ? (
                          <TreeConnector
                            key={`${member.id}-${member.parentId}`}
                            from={
                              data.members.find((m) => m.id === member.parentId)?.position || {
                                x: 0,
                                y: 0,
                              }
                            }
                            to={member.position || { x: 0, y: 0 }}
                          />
                        ) : null
                      )} */}

                      {data?.members?.map((member, i) => {
                        console.log(member.position);
                        return (
                          <FamilyMember
                            key={member.id}
                            member={member}
                            style={{
                              position: 'absolute',
                              left: `${member.position.x + window.innerWidth / 2 + i * 250}px`,
                              top: `${member.position.y + 250 + i * 250}px`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <AddMemberForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={addMember}
        members={data?.members}
      />
    </div>
  );
}
