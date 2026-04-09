<?php

namespace App\Enums;

enum ActivityLogAction: string
{
    // Authentication
    case Login          = 'Login';
    case Logout         = 'Logout';
    case FailedLogin    = 'Failed Login';
    case UpdateProfile  = 'Update Profile';
    case UpdatePassword = 'Update Password';
    case ResetPassword  = 'Reset Password';

    // File Management
    case Upload         = 'Upload';
    case Download       = 'Download';
    case Delete         = 'Delete';
    case Approve        = 'Approve';
    case Reject         = 'Reject';
    case Revert         = 'Revert';
    case Archive        = 'Archive';

    // Content Changes
    case Import         = 'Import';
    case Create         = 'Create';
    case Update         = 'Update';

    // User Management
    case UserCreated    = 'User Created';
    case UserUpdated    = 'User Updated';
    case RoleChanged    = 'Role Changed';
}
