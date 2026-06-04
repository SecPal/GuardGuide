<?php

use Illuminate\Support\Facades\View;

test('appearance cookie is propagated when it matches an allowed mode', function () {
    $this->withUnencryptedCookie('appearance', 'dark')
        ->get(route('home'))
        ->assertOk();

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
    $this->get(route('home'))->assertOk();

    expect(View::shared('appearance'))->toBe('system');
});
