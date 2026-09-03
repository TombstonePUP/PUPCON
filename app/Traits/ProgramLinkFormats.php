<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait ProgramLinkFormats
{
    public function formatPrograms($program)
    {
        $name = $program->program_name;
        $program->program_link = Str::slug($name, '_');

        return $program;
    }
}
