<?php

test('home redirects guests to the login flow', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});
