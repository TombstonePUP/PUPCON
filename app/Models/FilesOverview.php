<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FilesOverview extends Model
{
    public $timestamp = false;

    public $table = 'files_overview';

    public $incrementing = false;

    public $keyType = 'string';

    public function save(array $options = [])
    {
        throw new \Exception("Can't write in Database Materialized View");
    }
}
