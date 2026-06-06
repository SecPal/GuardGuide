<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleLocale
{
    /**
     * Locales that may be propagated from the cookie into the application.
     *
     * Keep this list in sync with `resources/js/i18n.ts` and `lingui.config.cjs`.
     */
    private const ALLOWED_LOCALES = ['en', 'de'];

    private const DEFAULT_LOCALE = 'en';

    private const COOKIE_NAME = 'locale';

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->resolveFromCookie($request)
            ?? $this->resolveFromAcceptLanguage($request)
            ?? self::DEFAULT_LOCALE;

        App::setLocale($locale);
        View::share('locale', $locale);

        return $next($request);
    }

    private function resolveFromCookie(Request $request): ?string
    {
        return $this->normalizeLocale($request->cookie(self::COOKIE_NAME));
    }

    /**
     * Pick the first allowed locale advertised by the browser. Returns null
     * when none of the preferences match so the caller can fall back to the
     * default locale.
     */
    private function resolveFromAcceptLanguage(Request $request): ?string
    {
        foreach ($request->getLanguages() as $language) {
            $locale = $this->normalizeLocale($language);

            if ($locale !== null) {
                return $locale;
            }
        }

        return null;
    }

    private function normalizeLocale(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $locale = strtolower(explode('-', str_replace('_', '-', $value), 2)[0]);

        if (! in_array($locale, self::ALLOWED_LOCALES, true)) {
            return null;
        }

        return $locale;
    }
}
