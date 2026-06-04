<?php declare(strict_types = 1);

// osfsl-/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/PasskeyAuthenticatable.php-PHPStan\BetterReflection\Reflection\ReflectionClass-Laravel\Passkeys\PasskeyAuthenticatable
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-2548c0c9ac71cebdca156639e986b39d8a91d85a67b070f7e4525e7f77f554de-8.4.21-6.70.0.1',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'filename' => '/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/PasskeyAuthenticatable.php',
      ),
    ),
    'namespace' => 'Laravel\\Passkeys',
    'name' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
    'shortName' => 'PasskeyAuthenticatable',
    'isInterface' => false,
    'isTrait' => true,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * @phpstan-require-implements PasskeyUser
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 15,
    'endLine' => 78,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => NULL,
    'implementsClassNames' => 
    array (
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
 * @phpstan-return HasMany<Passkey, Model>
 */',
        'startLine' => 24,
        'endLine' => 27,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'implementingClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'currentClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
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
        'startLine' => 32,
        'endLine' => 35,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'implementingClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'currentClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
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
 *
 * This should be a stable identifier that does not reveal PII.
 */',
        'startLine' => 42,
        'endLine' => 50,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'implementingClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'currentClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
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
 *
 * Shown prominently in authenticator UIs (registration prompts,
 * account pickers, password manager entries). Falls back from
 * `name` to `email` to the auth identifier when columns are absent.
 */',
        'startLine' => 59,
        'endLine' => 64,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'implementingClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'currentClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
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
 *
 * Used as the account identifier in authenticator UIs, typically
 * rendered as the subtitle beneath the display name. Falls back
 * from `email` to the auth identifier when the column is absent.
 */',
        'startLine' => 73,
        'endLine' => 77,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'implementingClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
        'currentClassName' => 'Laravel\\Passkeys\\PasskeyAuthenticatable',
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