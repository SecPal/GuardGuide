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
    $response->assertSee('<link rel="manifest" href="/manifest.webmanifest?appearance=dark">', escape: false);
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
    $response->assertSee('/manifest.webmanifest?appearance=${window.__guardGuideBrowserAppearance}', escape: false);
    $response->assertDontSee('<link rel="manifest" href="/site.webmanifest">', escape: false);

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
    $response->assertSee('<link rel="manifest" href="/manifest.webmanifest?appearance=light">', escape: false);
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

test('light manifest uses light browser metadata', function () {
    $response = $this->get('/manifest.webmanifest?appearance=light')
        ->assertOk()
        ->assertHeader('content-type', 'application/manifest+json');

    $response->assertJsonPath('theme_color', '#FFFFFF');
    $response->assertJsonPath('background_color', '#FFFFFF');
    $response->assertJsonPath('icons.0.src', '/icons/guardguide-192.png');
    $response->assertJsonPath('icons.1.src', '/icons/guardguide-512.png');
    $response->assertJsonPath('icons.2.src', '/icons/guardguide-maskable-512.png');
});

test('dark manifest uses dark browser metadata', function () {
    $response = $this->get('/manifest.webmanifest?appearance=dark')
        ->assertOk()
        ->assertHeader('content-type', 'application/manifest+json');

    $response->assertJsonPath('theme_color', '#011B2E');
    $response->assertJsonPath('background_color', '#011B2E');
    $response->assertJsonPath('icons.0.src', '/icons/guardguide-dark-192.png');
    $response->assertJsonPath('icons.1.src', '/icons/guardguide-dark-512.png');
    $response->assertJsonPath('icons.2.src', '/icons/guardguide-maskable-dark-512.png');
});

test('manifest reflects the configured app name', function () {
    config(['app.name' => 'GuardGuide Staging']);

    $response = $this->get('/manifest.webmanifest?appearance=light')->assertOk();

    $response->assertJsonPath('name', 'GuardGuide Staging');
    $response->assertJsonPath('short_name', 'GuardGuide Staging');
});
