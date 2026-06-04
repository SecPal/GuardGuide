<?php declare(strict_types = 1);

// odsl-/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/app/Actions/Fortify/ResetUserPassword.php-PHPStan\BetterReflection\Reflection\ReflectionClass-App\Actions\Fortify\ResetUserPassword
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.70.0.1-8.4.21-2b29803d5b5a703fe84a5e0cd6d9c70b697db7a5c679841fff7b203ebf3396df',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'App\\Actions\\Fortify\\ResetUserPassword',
        'filename' => '/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/app/Actions/Fortify/ResetUserPassword.php',
      ),
    ),
    'namespace' => 'App\\Actions\\Fortify',
    'name' => 'App\\Actions\\Fortify\\ResetUserPassword',
    'shortName' => 'ResetUserPassword',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => NULL,
    'attributes' => 
    array (
    ),
    'startLine' => 11,
    'endLine' => 32,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => NULL,
    'implementsClassNames' => 
    array (
      0 => 'Laravel\\Fortify\\Contracts\\ResetsUserPasswords',
    ),
    'traitClassNames' => 
    array (
      0 => 'App\\Concerns\\PasswordValidationRules',
    ),
    'immediateConstants' => 
    array (
    ),
    'immediateProperties' => 
    array (
    ),
    'immediateMethods' => 
    array (
      'reset' => 
      array (
        'name' => 'reset',
        'parameters' => 
        array (
          'user' => 
          array (
            'name' => 'user',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'App\\Models\\User',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 20,
            'endLine' => 20,
            'startColumn' => 27,
            'endColumn' => 36,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'input' => 
          array (
            'name' => 'input',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'array',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 20,
            'endLine' => 20,
            'startColumn' => 39,
            'endColumn' => 50,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'void',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Validate and reset the user\'s forgotten password.
 *
 * @param  array<string, string>  $input
 */',
        'startLine' => 20,
        'endLine' => 31,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'App\\Actions\\Fortify',
        'declaringClassName' => 'App\\Actions\\Fortify\\ResetUserPassword',
        'implementingClassName' => 'App\\Actions\\Fortify\\ResetUserPassword',
        'currentClassName' => 'App\\Actions\\Fortify\\ResetUserPassword',
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