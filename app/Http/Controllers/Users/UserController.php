<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = DB::table('users as u')
            ->leftJoin('user_roles as ur', 'ur.user_id', '=', 'u.user_id')
            ->leftJoin('roles as r', 'r.role_id', '=', 'ur.role_id')
            ->leftJoin('user_program_roles as upr', 'upr.user_id', '=', 'u.user_id')
            ->leftJoin('programs as p', 'p.program_id', '=', 'upr.program_id')
            ->leftJoin('user_area_roles as uar', 'uar.user_role_id', '=', 'ur.user_role_id')
            ->leftJoin('areas as a', 'a.area_id', '=', 'uar.area_id')
            ->select(
                'u.first_name',
                'u.last_name',
                'u.email',
                'r.role_name as role',
                DB::raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.program_name), NULL) as program_roles'),
                DB::raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT a.area_name), NULL) as area_roles')
            )
            ->groupBy('u.user_id', 'u.first_name', 'u.last_name', 'u.email', 'r.role_name')
            ->get();
        return inertia('user-management', [
            'userRecords' => $users,
        ]);
    }
}
