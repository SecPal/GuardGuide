<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;

test('locale cookie is propagated when it matches an allowed language', function () {
    $response = $this->withUnencryptedCookie('locale', 'de')
        ->get(route('home'))
        ->assertOk();

    $response->assertSee('lang="de"', escape: false);
    expect(View::shared('locale'))->toBe('de');
    expect(App::getLocale())->toBe('de');
});

test('locale cookie normalizes compatible values before applying them', function (string $cookie) {
    $response = $this->withUnencryptedCookie('locale', $cookie)
        ->get(route('home'))
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
        ->get(route('home'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale cookie falls back to English when the value tries to break out of the JS string', function () {
    $response = $this->withUnencryptedCookie('locale', "en'; alert(1); //")
        ->get(route('home'))
        ->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale defaults to English when no cookie is present', function () {
    $response = $this->get(route('home'))->assertOk();

    $response->assertSee('lang="en"', escape: false);
    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});
