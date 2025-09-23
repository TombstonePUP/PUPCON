<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserRequest;
use App\Models\Programs;
use App\Models\Roles;
use App\Models\User;
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

        $users = User::select('user_id', 'first_name', 'last_name', 'role_id', 'email', 'is_active')
            ->where('user_id', '!=', $user->user_id)
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
    public function store(UserRequest $request)
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

        if($user->Roles->role_name === 'Accreditor'){
            $user->notify(new NewUser($user->email, $name, ''));
        } else {
            $user->notify(new NewUser($user->email, $name, $password));
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', "User Created Successfully")
            ->with('message', "A new user has been created and notified via email.");
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateUserCredentials(UserRequest $request)
    {
        dd("hello");
        $validated = $request->validated();
        dd($validated);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateUserPrivileges(UserRequest $request)
    {
        $validated = $request->validated();
        $user = User::findOrFail($validated['user_id']);

        if ($user->role_id != $validated['assigned_role']) {
            $user->role_id = $validated['assigned_role'];
        }
        $user->save();

        if (in_array($validated['assigned_role'], [1, 2])) {
            $user->Areas()->detach();
        } else {
            $user->Areas()->sync($validated['assigned_areas']);
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', "User Updated Successfully")
            ->with('message', "The user's roles and areas have been updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function disable(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->is_active = false;
        $user->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', "User Disabled Successfully")
            ->with('message', "The user has been disabled.");
    }

    /**
     * Enable the specified resource from storage.
     */
    public function enable(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->is_active = true;
        $user->save();
        return redirect()->back()
            ->with('type', 'success')
            ->with('title', "User Enabled Successfully")
            ->with('message', "The user has been enabled.");
    }
}
