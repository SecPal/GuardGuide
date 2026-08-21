<?php

function instructionFixture(): string
{
    $repoRoot = realpath(__DIR__.'/../..');
    $fixtureRoot = sys_get_temp_dir().'/guardguide-instructions-'.bin2hex(random_bytes(8));

    expect($repoRoot)->not->toBeFalse();

    mkdir($fixtureRoot.'/.github', 0700, true);
    copy($repoRoot.'/AGENTS.md', $fixtureRoot.'/AGENTS.md');
    copy($repoRoot.'/.github/copilot-instructions.md', $fixtureRoot.'/.github/copilot-instructions.md');

    return $fixtureRoot;
}

function removeInstructionFixture(string $fixtureRoot): void
{
    @unlink($fixtureRoot.'/.github/copilot-instructions.md');
    @rmdir($fixtureRoot.'/.github');
    @unlink($fixtureRoot.'/AGENTS.md');
    @rmdir($fixtureRoot);
}

function runInstructionValidator(string $fixtureRoot): int
{
    $repoRoot = realpath(__DIR__.'/../..');
    $output = [];
    $exitCode = 0;

    expect($repoRoot)->not->toBeFalse();

    exec(sprintf(
        'bash %s %s 2>&1',
        escapeshellarg($repoRoot.'/scripts/validate-ai-instructions.sh'),
        escapeshellarg($fixtureRoot),
    ), $output, $exitCode);

    return $exitCode;
}

test('intended authoritative and compatibility instruction structure passes', function () {
    $fixtureRoot = instructionFixture();

    try {
        expect(runInstructionValidator($fixtureRoot))->toBe(0);
    } finally {
        removeInstructionFixture($fixtureRoot);
    }
});

test('compatibility instructions require the non-authoritative authority marker', function () {
    $fixtureRoot = instructionFixture();
    $copilotPath = $fixtureRoot.'/.github/copilot-instructions.md';

    try {
        $contents = file_get_contents($copilotPath);

        expect($contents)->not->toBeFalse();
        file_put_contents($copilotPath, str_replace('non-authoritative', 'secondary', $contents));

        expect(runInstructionValidator($fixtureRoot))->not->toBe(0);
    } finally {
        removeInstructionFixture($fixtureRoot);
    }
});

test('compatibility instructions require the resolvable canonical contract reference', function () {
    $fixtureRoot = instructionFixture();
    $copilotPath = $fixtureRoot.'/.github/copilot-instructions.md';

    try {
        $contents = file_get_contents($copilotPath);

        expect($contents)->not->toBeFalse();
        file_put_contents($copilotPath, str_replace(
            '[`SecPal/.github/docs/work-graph-contract.md`](https://github.com/SecPal/.github/blob/main/docs/work-graph-contract.md)',
            '[missing-contract.md](https://example.com/missing-contract.md)',
            $contents,
        ));

        expect(runInstructionValidator($fixtureRoot))->not->toBe(0);
    } finally {
        removeInstructionFixture($fixtureRoot);
    }
});

test('compatibility instructions require GuardGuide-specific invariants', function () {
    $fixtureRoot = instructionFixture();
    $copilotPath = $fixtureRoot.'/.github/copilot-instructions.md';

    try {
        $contents = file_get_contents($copilotPath);

        expect($contents)->not->toBeFalse();
        file_put_contents($copilotPath, str_replace(
            'Keep MariaDB and PostgreSQL equally supported',
            'Keep supported databases documented',
            $contents,
        ));

        expect(runInstructionValidator($fixtureRoot))->not->toBe(0);
    } finally {
        removeInstructionFixture($fixtureRoot);
    }
});

test('missing compatibility baseline cannot pass through empty extraction', function () {
    $fixtureRoot = instructionFixture();
    $copilotPath = $fixtureRoot.'/.github/copilot-instructions.md';

    try {
        file_put_contents($copilotPath, <<<'MARKDOWN'
This file mirrors the authoritative root `AGENTS.md` only as a non-authoritative
compatibility surface.

## Focused Overlays

- `.github/instructions/org-shared.instructions.md`
- `.github/instructions/github-workflows.instructions.md`
- `.github/instructions/php-laravel.instructions.md`
- `.github/instructions/react-shadcn.instructions.md`
MARKDOWN);

        expect(runInstructionValidator($fixtureRoot))->not->toBe(0);
    } finally {
        removeInstructionFixture($fixtureRoot);
    }
});

test('ai governance ref parsing preserves quoted pins', function () {
    $repoRoot = realpath(__DIR__.'/../..');

    expect($repoRoot)->not->toBeFalse();

    $scriptLines = file($repoRoot.'/scripts/validate-ai-instructions.sh', FILE_IGNORE_NEW_LINES);

    expect($scriptLines)->not->toBeFalse();

    $capturing = false;
    $awkProgram = [];

    foreach ($scriptLines as $line) {
        if (! $capturing && str_contains($line, 'ai_governance_ref="$(awk')) {
            $capturing = true;

            continue;
        }

        if ($capturing && str_contains($line, '$QUALITY_WORKFLOW")')) {
            break;
        }

        if ($capturing) {
            $awkProgram[] = $line;
        }
    }

    expect($awkProgram)->not->toBeEmpty();

    $workflowPath = tempnam(sys_get_temp_dir(), 'quality-workflow-');
    $parserPath = tempnam(sys_get_temp_dir(), 'parse-governance-ref-');

    expect($workflowPath)->not->toBeFalse()
        ->and($parserPath)->not->toBeFalse();

    file_put_contents($workflowPath, <<<'YAML'
jobs:
  ai-instructions:
    with:
      governance-ref: "6f8e13a7a62cee356811a7f58d6b92119941652f"
YAML);

    try {
        file_put_contents($parserPath, sprintf(
            "#!/usr/bin/env bash\nset -euo pipefail\nworkflow_path=\"\$1\"\nawk '\n%s\n' \"\$workflow_path\"\n",
            implode("\n", $awkProgram),
        ));

        chmod($parserPath, 0755);

        $output = [];
        $exitCode = 0;

        exec(sprintf('bash %s %s 2>&1', escapeshellarg($parserPath), escapeshellarg($workflowPath)), $output, $exitCode);

        expect($exitCode)->toBe(0)
            ->and($output)->toBe(['6f8e13a7a62cee356811a7f58d6b92119941652f']);
    } finally {
        @unlink($parserPath);
        @unlink($workflowPath);
    }
});
