<?php

namespace App\Services;

use App\Models\Areas;
use App\Models\Programs;
use Illuminate\Support\Str;

class FilePathService
{
    public static function buildBasePath(
        Programs $program,
        string $level,
        Areas $area
    ): string {
        $degree = Str::slug($program->degree_type, '_');
        $progName = Str::slug($program->program_name, '_');
        $areaName = Str::slug($area->area_name, '_');

        return "documents/{$degree}_{$progName}/{$level}/{$areaName}";
    }

    public static function resolveLevel(int $level): string
    {
        return $level === 0 ? 'psv' : 'level_'.$level;
    }
}
