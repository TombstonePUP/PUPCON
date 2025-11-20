<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OtherServices extends Model
{
    /** @use HasFactory<\Database\Factories\OtherServicesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'other_services';
    protected $primaryKey = 'service_id';
    protected $fillable = [
        'service_name',
        'description',
        'service_link',
    ];
}
