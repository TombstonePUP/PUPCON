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
        $users = User::select('user_id', 'first_name', 'last_name', 'role_id', 'email')
            ->whereDoesntHave('Roles', function ($query) {
                $query->where('role_name', 'Admin');
            })
            ->with([
                'Roles' => function ($query) {
                    $query->select('roles.role_id', 'roles.role_name');
                },
                'Areas' => function ($query) {
                    $query->select('areas.area_id', 'areas.area_number', 'areas.area_name', 'areas.program_id');
                },
                'Areas.Programs' => function ($query) {
                    $query->select('programs.program_id', 'programs.degree_type', 'programs.program_name', 'programs.color');
                },
            ])->get();

        return inertia('user-management', [
            'userRecords' => $users,
        ]);
    }
}
