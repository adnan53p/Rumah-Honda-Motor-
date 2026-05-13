import { NextResponse, type NextRequest } from 'next/server';

// Admin auth dijalankan di app/admin/layout.tsx menggunakan Supabase client session.
// Middleware server sengaja tidak dipakai agar tidak konflik dengan localStorage auth Supabase.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
