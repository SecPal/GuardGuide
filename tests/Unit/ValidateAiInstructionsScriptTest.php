<?php

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
