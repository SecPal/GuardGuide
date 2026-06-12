<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;

test('locale cookie is propagated when it matches an allowed language', function () {
    $response = $this->withUnencryptedCookie('locale', 'de')
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="de"', escape: false);
    expect(View::shared('locale'))->toBe('de');
    expect(App::getLocale())->toBe('de');
});

test('locale cookie normalizes compatible values before applying them', function (string $cookie) {
    $response = $this->withUnencryptedCookie('locale', $cookie)
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="de"', escape: false);
    expect(View::shared('locale'))->toBe('de');
    expect(App::getLocale())->toBe('de');
})->with([
    'uppercase locale' => ['DE'],
    'locale with region' => ['de-DE'],
]);

test('locale cookie falls back to English when the value is unknown', function () {
    $response = $this->withUnencryptedCookie('locale', 'fr')
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale cookie falls back to English when the value tries to break out of the JS string', function () {
    $response = $this->withUnencryptedCookie('locale', "en'; alert(1); //")
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale defaults to English when no cookie is present', function () {
    $response = $this->get(route('login'))->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale is detected from Accept-Language when no cookie is present', function () {
    $response = $this->withHeaders(['Accept-Language' => 'de-DE,de;q=0.9,en;q=0.8'])
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="de"', escape: false);
    expect(View::shared('locale'))->toBe('de');
    expect(App::getLocale())->toBe('de');
});

test('locale falls back to English when Accept-Language has no allowed match', function () {
    $response = $this->withHeaders(['Accept-Language' => 'fr-FR,fr;q=0.9'])
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale cookie wins over Accept-Language', function () {
    $response = $this->withUnencryptedCookie('locale', 'en')
        ->withHeaders(['Accept-Language' => 'de-DE,de;q=0.9'])
        ->get(route('login'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});
