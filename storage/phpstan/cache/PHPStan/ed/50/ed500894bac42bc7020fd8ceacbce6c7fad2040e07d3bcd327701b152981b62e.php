<?php declare(strict_types = 1);

// osfsl-/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/Passkey.php-PHPStan\BetterReflection\Reflection\ReflectionClass-Laravel\Passkeys\Passkey
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-b59b3b22003ef4aac94f3a8e07ea153731062780dba01149c7894b7edbeea788-8.4.21-6.70.0.1',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'Laravel\\Passkeys\\Passkey',
        'filename' => '/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/passkeys/src/Passkey.php',
      ),
    ),
    'namespace' => 'Laravel\\Passkeys',
    'name' => 'Laravel\\Passkeys\\Passkey',
    'shortName' => 'Passkey',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * @mixin Builder<Passkey>
 *
 * @property int $id
 * @property int|string $user_id
 * @property string $name
 * @property string $credential_id
 * @property array<string, mixed> $credential
 * @property Carbon|null $last_used_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read PasskeyUser $user
 * @property-read string|null $authenticator
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 29,
    'endLine' => 92,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => 'Illuminate\\Database\\Eloquent\\Model',
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
      'fillable' => 
      array (
        'declaringClassName' => 'Laravel\\Passkeys\\Passkey',
        'implementingClassName' => 'Laravel\\Passkeys\\Passkey',
        'name' => 'fillable',
        'modifiers' => 2,
        'type' => NULL,
        'default' => 
        array (
          'code' => '[\'name\', \'credential_id\', \'credential\']',
          'attributes' => 
          array (
            'startLine' => 36,
            'endLine' => 40,
            'startTokenPos' => 70,
            'startFilePos' => 907,
            'endTokenPos' => 81,
            'endFilePos' => 976,
          ),
        ),
        'docComment' => '/**
 * The attributes that are mass assignable.
 *
 * @var list<string>
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 36,
        'endLine' => 40,
        'startColumn' => 5,
        'endColumn' => 6,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
      'appends' => 
      array (
        'declaringClassName' => 'Laravel\\Passkeys\\Passkey',
        'implementingClassName' => 'Laravel\\Passkeys\\Passkey',
        'name' => 'appends',
        'modifiers' => 2,
        'type' => NULL,
        'default' => 
        array (
          'code' => '[\'authenticator\']',
          'attributes' => 
          array (
            'startLine' => 47,
            'endLine' => 49,
            'startTokenPos' => 92,
            'startFilePos' => 1111,
            'endTokenPos' => 97,
            'endFilePos' => 1142,
          ),
        ),
        'docComment' => '/**
 * The accessors to append to the model\'s array form.
 *
 * @var list<string>
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 47,
        'endLine' => 49,
        'startColumn' => 5,
        'endColumn' => 6,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
    ),
    'immediateMethods' => 
    array (
      'casts' => 
      array (
        'name' => 'casts',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'array',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the attributes that should be cast.
 *
 * @return array<string, string>
 */',
        'startLine' => 56,
        'endLine' => 62,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 2,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\Passkey',
        'implementingClassName' => 'Laravel\\Passkeys\\Passkey',
        'currentClassName' => 'Laravel\\Passkeys\\Passkey',
        'aliasName' => NULL,
      ),
      'user' => 
      array (
        'name' => 'user',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
            'isIdentifier' => false,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the user that owns the passkey.
 *
 * @return BelongsTo<Model, $this>
 */',
        'startLine' => 69,
        'endLine' => 75,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\Passkey',
        'implementingClassName' => 'Laravel\\Passkeys\\Passkey',
        'currentClassName' => 'Laravel\\Passkeys\\Passkey',
        'aliasName' => NULL,
      ),
      'authenticator' => 
      array (
        'name' => 'authenticator',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'Illuminate\\Database\\Eloquent\\Casts\\Attribute',
            'isIdentifier' => false,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get the authenticator name based on the AAGUID.
 */',
        'startLine' => 80,
        'endLine' => 91,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 2,
        'namespace' => 'Laravel\\Passkeys',
        'declaringClassName' => 'Laravel\\Passkeys\\Passkey',
        'implementingClassName' => 'Laravel\\Passkeys\\Passkey',
        'currentClassName' => 'Laravel\\Passkeys\\Passkey',
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