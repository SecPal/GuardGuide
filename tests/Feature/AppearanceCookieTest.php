<?php

use Illuminate\Support\Facades\View;

test('appearance cookie is propagated when it matches an allowed mode', function () {
    $response = $this->withUnencryptedCookie('appearance', 'dark')
        ->get(route('home'))
        ->assertOk();

    $response->assertSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-dark-32.png">',
        escape: false,
    );
    $response->assertSee('<meta name="theme-color" content="#011B2E">', escape: false);
    $response->assertDontSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-dark-32.png" media="(prefers-color-scheme: dark)">',
        escape: false,
    );
    $response->assertDontSee(
        '<meta name="theme-color" content="#011B2E" media="(prefers-color-scheme: dark)">',
        escape: false,
    );

    expect(View::shared('appearance'))->toBe('dark');
});

test('appearance cookie falls back to system when the value is unknown', function () {
    $this->withUnencryptedCookie('appearance', 'midnight')
        ->get(route('home'))
        ->assertOk();

    expect(View::shared('appearance'))->toBe('system');
});

test('appearance cookie falls back to system when the value tries to break out of the JS string', function () {
    $this->withUnencryptedCookie('appearance', "system'; alert(1); //")
        ->get(route('home'))
        ->assertOk();

    expect(View::shared('appearance'))->toBe('system');
});

test('appearance defaults to system when no cookie is present', function () {
    $response = $this->get(route('home'))->assertOk();

    $response->assertSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-light-32.png" media="(prefers-color-scheme: light)">',
        escape: false,
    );
    $response->assertSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-dark-32.png" media="(prefers-color-scheme: dark)">',
        escape: false,
    );
    $response->assertSee(
        '<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">',
        escape: false,
    );
    $response->assertSee(
        '<meta name="theme-color" content="#011B2E" media="(prefers-color-scheme: dark)">',
        escape: false,
    );

    expect(View::shared('appearance'))->toBe('system');
});

test('light appearance uses light browser metadata', function () {
    $response = $this->withUnencryptedCookie('appearance', 'light')
        ->get(route('home'))
        ->assertOk();

    $response->assertSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-light-32.png">',
        escape: false,
    );
    $response->assertSee('<meta name="theme-color" content="#FFFFFF">', escape: false);
    $response->assertDontSee(
        '<link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-light-32.png" media="(prefers-color-scheme: light)">',
        escape: false,
    );
    $response->assertDontSee(
        '<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">',
        escape: false,
    );

    expect(View::shared('appearance'))->toBe('light');
});
