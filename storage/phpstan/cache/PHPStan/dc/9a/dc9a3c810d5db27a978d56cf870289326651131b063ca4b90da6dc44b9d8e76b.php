<?php declare(strict_types = 1);

// osfsl-/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/framework/src/Illuminate/Auth/Middleware/RequirePassword.php-PHPStan\BetterReflection\Reflection\ReflectionClass-Illuminate\Auth\Middleware\RequirePassword
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-ac1e629eb2fd19cd2ad7df140074621b0001c9d4a5e497ad2a6e34c2c60bae63-8.4.21-6.70.0.1',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'filename' => '/home/secpal/.polyscope/clones/69a4e348/guardguide-pr-17/vendor/composer/../laravel/framework/src/Illuminate/Auth/Middleware/RequirePassword.php',
      ),
    ),
    'namespace' => 'Illuminate\\Auth\\Middleware',
    'name' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
    'shortName' => 'RequirePassword',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => NULL,
    'attributes' => 
    array (
    ),
    'startLine' => 10,
    'endLine' => 100,
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
      'responseFactory' => 
      array (
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'name' => 'responseFactory',
        'modifiers' => 2,
        'type' => NULL,
        'default' => NULL,
        'docComment' => '/**
 * The response factory instance.
 *
 * @var \\Illuminate\\Contracts\\Routing\\ResponseFactory
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 17,
        'endLine' => 17,
        'startColumn' => 5,
        'endColumn' => 31,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
      'urlGenerator' => 
      array (
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'name' => 'urlGenerator',
        'modifiers' => 2,
        'type' => NULL,
        'default' => NULL,
        'docComment' => '/**
 * The URL generator instance.
 *
 * @var \\Illuminate\\Contracts\\Routing\\UrlGenerator
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 24,
        'endLine' => 24,
        'startColumn' => 5,
        'endColumn' => 28,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
      'passwordTimeout' => 
      array (
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'name' => 'passwordTimeout',
        'modifiers' => 2,
        'type' => NULL,
        'default' => NULL,
        'docComment' => '/**
 * The password timeout.
 *
 * @var int
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 31,
        'endLine' => 31,
        'startColumn' => 5,
        'endColumn' => 31,
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
      '__construct' => 
      array (
        'name' => '__construct',
        'parameters' => 
        array (
          'responseFactory' => 
          array (
            'name' => 'responseFactory',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'Illuminate\\Contracts\\Routing\\ResponseFactory',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 40,
            'endLine' => 40,
            'startColumn' => 33,
            'endColumn' => 64,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'urlGenerator' => 
          array (
            'name' => 'urlGenerator',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'Illuminate\\Contracts\\Routing\\UrlGenerator',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 40,
            'endLine' => 40,
            'startColumn' => 67,
            'endColumn' => 92,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
          'passwordTimeout' => 
          array (
            'name' => 'passwordTimeout',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 40,
                'endLine' => 40,
                'startTokenPos' => 76,
                'startFilePos' => 985,
                'endTokenPos' => 76,
                'endFilePos' => 988,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 40,
            'endLine' => 40,
            'startColumn' => 95,
            'endColumn' => 117,
            'parameterIndex' => 2,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Create a new middleware instance.
 *
 * @param  \\Illuminate\\Contracts\\Routing\\ResponseFactory  $responseFactory
 * @param  \\Illuminate\\Contracts\\Routing\\UrlGenerator  $urlGenerator
 * @param  int|null  $passwordTimeout
 */',
        'startLine' => 40,
        'endLine' => 45,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Illuminate\\Auth\\Middleware',
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'currentClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'aliasName' => NULL,
      ),
      'using' => 
      array (
        'name' => 'using',
        'parameters' => 
        array (
          'redirectToRoute' => 
          array (
            'name' => 'redirectToRoute',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 56,
                'endLine' => 56,
                'startTokenPos' => 129,
                'startFilePos' => 1465,
                'endTokenPos' => 129,
                'endFilePos' => 1468,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 56,
            'endLine' => 56,
            'startColumn' => 34,
            'endColumn' => 56,
            'parameterIndex' => 0,
            'isOptional' => true,
          ),
          'passwordTimeoutSeconds' => 
          array (
            'name' => 'passwordTimeoutSeconds',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 56,
                'endLine' => 56,
                'startTokenPos' => 136,
                'startFilePos' => 1497,
                'endTokenPos' => 136,
                'endFilePos' => 1500,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 56,
            'endLine' => 56,
            'startColumn' => 59,
            'endColumn' => 88,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Specify the redirect route and timeout for the middleware.
 *
 * @param  string|null  $redirectToRoute
 * @param  string|int|null  $passwordTimeoutSeconds
 * @return string
 *
 * @named-arguments-supported
 */',
        'startLine' => 56,
        'endLine' => 59,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => true,
        'modifiers' => 17,
        'namespace' => 'Illuminate\\Auth\\Middleware',
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'currentClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'aliasName' => NULL,
      ),
      'handle' => 
      array (
        'name' => 'handle',
        'parameters' => 
        array (
          'request' => 
          array (
            'name' => 'request',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 70,
            'endLine' => 70,
            'startColumn' => 28,
            'endColumn' => 35,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'next' => 
          array (
            'name' => 'next',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'Closure',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 70,
            'endLine' => 70,
            'startColumn' => 38,
            'endColumn' => 50,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
          'redirectToRoute' => 
          array (
            'name' => 'redirectToRoute',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 70,
                'endLine' => 70,
                'startTokenPos' => 182,
                'startFilePos' => 1912,
                'endTokenPos' => 182,
                'endFilePos' => 1915,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 70,
            'endLine' => 70,
            'startColumn' => 53,
            'endColumn' => 75,
            'parameterIndex' => 2,
            'isOptional' => true,
          ),
          'passwordTimeoutSeconds' => 
          array (
            'name' => 'passwordTimeoutSeconds',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 70,
                'endLine' => 70,
                'startTokenPos' => 189,
                'startFilePos' => 1944,
                'endTokenPos' => 189,
                'endFilePos' => 1947,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 70,
            'endLine' => 70,
            'startColumn' => 78,
            'endColumn' => 107,
            'parameterIndex' => 3,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Handle an incoming request.
 *
 * @param  \\Illuminate\\Http\\Request  $request
 * @param  \\Closure  $next
 * @param  string|null  $redirectToRoute
 * @param  string|int|null  $passwordTimeoutSeconds
 * @return mixed
 */',
        'startLine' => 70,
        'endLine' => 85,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'Illuminate\\Auth\\Middleware',
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'currentClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'aliasName' => NULL,
      ),
      'shouldConfirmPassword' => 
      array (
        'name' => 'shouldConfirmPassword',
        'parameters' => 
        array (
          'request' => 
          array (
            'name' => 'request',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 94,
            'endLine' => 94,
            'startColumn' => 46,
            'endColumn' => 53,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'passwordTimeoutSeconds' => 
          array (
            'name' => 'passwordTimeoutSeconds',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 94,
                'endLine' => 94,
                'startTokenPos' => 301,
                'startFilePos' => 2727,
                'endTokenPos' => 301,
                'endFilePos' => 2730,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 94,
            'endLine' => 94,
            'startColumn' => 56,
            'endColumn' => 85,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Determine if the confirmation timeout has expired.
 *
 * @param  \\Illuminate\\Http\\Request  $request
 * @param  int|null  $passwordTimeoutSeconds
 * @return bool
 */',
        'startLine' => 94,
        'endLine' => 99,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 2,
        'namespace' => 'Illuminate\\Auth\\Middleware',
        'declaringClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'implementingClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
        'currentClassName' => 'Illuminate\\Auth\\Middleware\\RequirePassword',
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