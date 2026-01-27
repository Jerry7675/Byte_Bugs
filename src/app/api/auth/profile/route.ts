import { NextRequest, NextResponse } from 'next/server';
import * as profileApi from '../../../server/api/profile';

function getRoleFromQueryOrBody(req: NextRequest, body?: any) {
  const url = new URL(req.url);
  return body?.role || url.searchParams.get('role');
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const role = url.searchParams.get('role');
  if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  if (id) {
    const profile = await profileApi.findById(role, id);
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(profile);
  }
  const profiles = await profileApi.findAll(role);
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const role = getRoleFromQueryOrBody(req, data);
  if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  const profile = await profileApi.create(role, data);
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const role = getRoleFromQueryOrBody(req, data);
  const { id, ...updateData } = data;
  if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const updated = await profileApi.update(role, id, updateData);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const role = url.searchParams.get('role');
  if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await profileApi.remove(role, id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
