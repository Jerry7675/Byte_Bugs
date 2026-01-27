import { NextRequest, NextResponse } from 'next/server';
import * as profileApi from '../../../server/api/profile/profile';
import { withRequestContext } from '@/context/init-request-context';

function getRoleFromQueryOrBody(req: NextRequest, body?: any) {
  const url = new URL(req.url);
  return body?.role || url.searchParams.get('role');
}

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId');
    const role = url.searchParams.get('role');
    if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    if (id) {
      const profile = await profileApi.getProfileByIdApi(role, id);
      if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(profile);
    }
    if (userId) {
      //Find by userId (first match)
      const profiles = await profileApi.getAllProfilesApi(role);
      const myProfile = Array.isArray(profiles)
        ? profiles.find((p: any) => p.userId === userId)
        : null;
      if (!myProfile) return NextResponse.json({}, { status: 200 });
      return NextResponse.json(myProfile);
    }
    const profiles = await profileApi.getAllProfilesApi(role);
    return NextResponse.json(profiles);
  });
}

export async function PUT(req: NextRequest) {
  return withRequestContext(req, async () => {
    const data = await req.json();
    const role = getRoleFromQueryOrBody(req, data);
    if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    const profile = await profileApi.createProfileApi(role, data);
    return NextResponse.json(profile);
  });
}

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const data = await req.json();
    const role = getRoleFromQueryOrBody(req, data);
    const { id, ...updateData } = data;
    if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    try {
      const updated = await profileApi.updateProfileApi(role, id, updateData);
      return NextResponse.json(updated);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  });
}

export async function DELETE(req: NextRequest) {
  return withRequestContext(req, async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const role = url.searchParams.get('role');
    if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    try {
      await profileApi.deleteProfileApi(role, id);
      return NextResponse.json({ success: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
  });
}
