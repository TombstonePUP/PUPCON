<?php

use App\Http\Middleware\AccreditorPrivileges;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Http\Middleware\Admin as AdminPrivileges;
use App\Http\Middleware\EnsureMustUpdatePassword;
use App\Http\Middleware\MustUpdatePassword;
use App\Http\Middleware\UserProgramPrivileges;
use App\Http\Middleware\UserAreaPrivileges;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias( [
            'admin' => AdminPrivileges::class,
            'user.program.role' => UserProgramPrivileges::class,
            'user.area.role' => UserAreaPrivileges::class,
            'accreditor' => AccreditorPrivileges::class,
            'update.password' => MustUpdatePassword::class,
            'ensure.update.password' => EnsureMustUpdatePassword::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
