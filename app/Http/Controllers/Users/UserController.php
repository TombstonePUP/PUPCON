<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Models\Programs;
use App\Models\Roles;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\UserAreaRoles;
use App\Notifications\NewUser;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $programs = Programs::select('program_id', 'program_name')
            ->where('under_survey', true)
            ->with([
                'Areas' => function ($query) {
                    $query->select('area_id', 'area_number', 'area_name', 'program_id');
                },
            ])
            ->get();
        $roles = [];
        if($user->Roles->role_name == 'Coordinator'){
            $roles = Roles::select('role_id', 'role_name')
                ->where('role_name', '!=', 'Admin')
                ->where('role_name', '!=', 'Coordinator')
                ->get();
        } elseif($user->Roles->role_name == 'Admin'){
            $roles = Roles::select('role_id', 'role_name')->get();
        }

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
            'programRoles' => $programs,
            'roles' => $roles,
            'userRecords' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = new User();
        $password = Str::password(16, true, true, false, false);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->email = $validated['email'];
        $user->role_id = $validated['assigned_role'];
        $user->password = bcrypt($password); // Set a default password or generate one
        $user->save();

        if ($validated['assigned_programs'] && $validated['assigned_areas']) {
            $user->Areas()->attach($validated['assigned_areas']);
        }

        $name = $user->first_name . ' ' . $user->last_name;

        $user->notify(new NewUser($user->email, $name, $password));

        return redirect()->back()
            ->with('success', 'User created successfully');

    }

    /**
     * Update the specified resource in storage.
     */
    public function edit(Request $request, int $user_id)
    {
        dd('hello edit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $user_id)
    {
        $user = User::findOrFail($user_id);
        $user->Areas()->detach();
        $user->delete();

        return redirect()->back()
            ->with('success', 'User deleted successfully');
    }


}
