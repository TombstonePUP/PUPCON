<?php

namespace App\Models;

use Database\Factories\OtherServicesFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtherServices extends Model
{
    /** @use HasFactory<OtherServicesFactory> */
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
