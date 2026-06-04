<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Allowed appearance modes that may be propagated from the cookie into views.
     */
    private const ALLOWED_APPEARANCES = ['system', 'light', 'dark'];

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $cookie = $request->cookie('appearance');
        $appearance = is_string($cookie) && in_array($cookie, self::ALLOWED_APPEARANCES, true)
            ? $cookie
            : 'system';

        View::share('appearance', $appearance);

        return $next($request);
    }
}
