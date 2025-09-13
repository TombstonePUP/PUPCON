<?php

namespace App\Traits;
use Illuminate\Support\Str;

trait ProgramLinkFormats
{
    public function formatPrograms($program): string
    {
        $program->program_link = Str::of($program->program_name)->snake();
        return $program;
    }
}
