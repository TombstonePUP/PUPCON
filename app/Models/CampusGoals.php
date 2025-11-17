<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CampusGoals extends Model
{
    /** @use HasFactory<\Database\Factories\CampusGoalsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'campus_goals';
    protected $primaryKey = 'goal_id';
    protected $fillable = [
        'goal_title_eng',
        'goal_desc_eng',
        'goal_title_fil',
        'goal_desc_fil',
    ];
}
