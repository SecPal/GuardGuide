<?php

test('public registration routes are disabled', function () {
    expect(app('router')->has('register'))->toBeFalse();
    expect(app('router')->has('register.store'))->toBeFalse();

    $this->get('/register')->assertNotFound();
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();
});