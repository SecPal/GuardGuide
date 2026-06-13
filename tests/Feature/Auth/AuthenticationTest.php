<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login'));
});

test('authenticated users are redirected from the login screen to the app entry', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('login'));

    $response->assertRedirect(route('dashboard', absolute: false));
});

test('home redirects authenticated users to the app entry', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertRedirect(route('dashboard'));
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('logout returns users through home to the login flow', function () {
    $user = User::factory()->create();

    $this->followingRedirects()
        ->actingAs($user)
        ->post(route('logout'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login'));

    $this->assertGuest();
});

test('guest logout returns through home to the login flow', function () {
    $this->followingRedirects()
        ->post(route('logout'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create([
        'email' => 'Mixed.Case@Example.COM',
    ]);

    // Mirror the login limiter key from FortifyServiceProvider::configureRateLimiting
    // (Str::transliterate(Str::lower($email).'|'.$ip)) and the ThrottleRequests
    // named-limiter hash so the bucket we seed is the same one the request hits.
    $throttleKey = Str::transliterate(Str::lower($user->email).'|127.0.0.1');

    RateLimiter::increment(md5('login'.$throttleKey), amount: 5);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertTooManyRequests();
});
