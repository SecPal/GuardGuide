<?php

declare(strict_types=1);

it('returns the backend baseline response', function (): void {
    $this->get('/')->assertOk()->assertSee('GuardGuide backend baseline');
});
