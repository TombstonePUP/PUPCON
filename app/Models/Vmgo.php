<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vmgo extends Model
{
    /** @use HasFactory<\Database\Factories\VmgoFactory> */
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
        'avp_link',
        'avp_title',
        'avp_description',
    ];
}
