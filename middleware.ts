import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Public paths
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/api/')

  // Auth paths
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthPath = authPaths.includes(pathname)

  // Admin paths
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))

  // Redirect logic
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check user role for admin paths
    if (isAdminPath) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('position')
        .eq('id', session.user.id)
        .single()

      if (profile?.position !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}