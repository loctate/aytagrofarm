import { NextResponse, type NextRequest } from "next/server";

const REGISTRATION_PATH = "/hpdki/daftar";
const LOCKED_REGISTRATION_PATH = "/hpdki/daftar-terkunci";

function isHpdkiRegistrationOpen() {
  return (
    process.env.HPDKI_REGISTRATION_OPEN === "true" ||
    process.env.NEXT_PUBLIC_HPDKI_REGISTRATION_OPEN === "true"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === REGISTRATION_PATH && !isHpdkiRegistrationOpen()) {
    const lockedUrl = request.nextUrl.clone();
    lockedUrl.pathname = LOCKED_REGISTRATION_PATH;
    return NextResponse.rewrite(lockedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hpdki/daftar"],
};
