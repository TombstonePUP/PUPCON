<?php

namespace App\Enums;

enum ActivityLogType: string
{
    case Authentication = 'Authentication';
    case FileManagement = 'File Management';
    case ContentManagement = 'Content Management';
    case UserManagement = 'User Management';
    case System = 'System';
}
