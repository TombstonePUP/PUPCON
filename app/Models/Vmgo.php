<?php

namespace App\Models;

use Database\Factories\VmgoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vmgo extends Model
{
    /** @use HasFactory<VmgoFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'vmgo';

    protected $primaryKey = 'vmgo_id';

    protected $fillable = [
        'vision',
        'mission',
    ];
}
