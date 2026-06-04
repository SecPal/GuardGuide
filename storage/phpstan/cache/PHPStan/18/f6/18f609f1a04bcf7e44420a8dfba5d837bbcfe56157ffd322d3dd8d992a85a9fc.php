<?php declare(strict_types = 1);

// osfsl-/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/Contracts/PasskeyUser.php-PHPStan\BetterReflection\Reflection\ReflectionClass-Laravel\Passkeys\Contracts\PasskeyUser
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-ecccd921f6b50ada898cf8a52b56bc04affcbbc3a0e65b6f7aa8744597234fd8-8.4.21-6.70.0.1',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'filename' => '/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/Contracts/PasskeyUser.php',
      ),
    ),
    'namespace' => 'Laravel\\Passkeys\\Contracts',
    'name' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
    'shortName' => 'PasskeyUser',
    'isInterface' => true,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => NULL,
    'attributes' => 
    array (
    ),
    'startLine' => 11,
    'endLine' => 48,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => NULL,
    'implementsClassNames' => 
    array (
      0 => 'Illuminate\\Contracts\\Auth\\Authenticatable',
    ),
    'traitClassNames' => 
    array (
    ),
    'immediateConstants' => 
    array (
    ),
    'immediateProperties' => 
    array (
    ),
    'immediateMethods' => 
    array (
      'passkeys' => 
      array (
        'name' => 'passkeys',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
            'isIdentifier' => false,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the passkeys associated with the user.
 *
 * @return HasMany<Passkey, Model>
 *
 * @phpstan-return HasMany<\\Laravel\\Passkeys\\Passkey, Model>
 */',
        'startLine' => 20,
        'endLine' => 20,
        'startColumn' => 5,
        'endColumn' => 40,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
      'hasPasskeysEnabled' => 
      array (
        'name' => 'hasPasskeysEnabled',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'bool',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Determine if the user has any passkeys enabled.
 */',
        'startLine' => 25,
        'endLine' => 25,
        'startColumn' => 5,
        'endColumn' => 47,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
      'getKey' => 
      array (
        'name' => 'getKey',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the value of the model\'s primary key.
 *
 * @return mixed
 */',
        'startLine' => 32,
        'endLine' => 32,
        'startColumn' => 5,
        'endColumn' => 29,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
      'getPasskeyUserHandle' => 
      array (
        'name' => 'getPasskeyUserHandle',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'string',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the unique user handle for WebAuthn.
 */',
        'startLine' => 37,
        'endLine' => 37,
        'startColumn' => 5,
        'endColumn' => 51,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
      'getPasskeyDisplayName' => 
      array (
        'name' => 'getPasskeyDisplayName',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'string',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the display name for WebAuthn registration.
 */',
        'startLine' => 42,
        'endLine' => 42,
        'startColumn' => 5,
        'endColumn' => 52,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
      'getPasskeyUsername' => 
      array (
        'name' => 'getPasskeyUsername',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'string',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the username for WebAuthn registration.
 */',
        'startLine' => 47,
        'endLine' => 47,
        'startColumn' => 5,
        'endColumn' => 49,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys\\Contracts',
        'declaringClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'implementingClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'currentClassName' => 'Laravel\\Passkeys\\Contracts\\PasskeyUser',
        'aliasName' => NULL,
      ),
    ),
    'traitsData' => 
    array (
      'aliases' => 
      array (
      ),
      'modifiers' => 
      array (
      ),
      'precedences' => 
      array (
      ),
      'hashes' => 
      array (
      ),
    ),
  ),
));