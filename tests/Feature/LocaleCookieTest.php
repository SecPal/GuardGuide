<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;

test('locale cookie is propagated when it matches an allowed language', function () {
    $this->withUnencryptedCookie('locale', 'de')
        ->get(route('home'))
        ->assertOk();

    expect(View::shared('locale'))->toBe('de');
    expect(App::getLocale())->toBe('de');
});

test('locale cookie falls back to English when the value is unknown', function () {
    $this->withUnencryptedCookie('locale', 'fr')
        ->get(route('home'))
        ->assertOk();

    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale cookie falls back to English when the value tries to break out of the JS string', function () {
    $this->withUnencryptedCookie('locale', "en'; alert(1); //")
        ->get(route('home'))
        ->assertOk();

    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});

test('locale defaults to English when no cookie is present', function () {
    $this->get(route('home'))->assertOk();

    expect(View::shared('locale'))->toBe('en');
    expect(App::getLocale())->toBe('en');
});
