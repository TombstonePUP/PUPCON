<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /* $users = User::leftjoin('user_roles', 'users.user_id', '=', 'user_roles.user_id')
            ->leftjoin('
            ->with(['UserRoles'])
            ->get(); */
        // dd($users);
        return inertia('user-management', []);
    }
}
