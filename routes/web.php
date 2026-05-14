<?php

use App\Http\Controllers\Guest\AboutViewController;
use App\Http\Controllers\Guest\AdministrationViewController;
use App\Http\Controllers\Guest\AreasController;
use App\Http\Controllers\Guest\CertificateController;
use App\Http\Controllers\Guest\ExhibitsController;
use App\Http\Controllers\Guest\FacilitiesViewController;
use App\Http\Controllers\Guest\FacultyController;
use App\Http\Controllers\Guest\HistoryViewController;
use App\Http\Controllers\Guest\LocalTaskForceViewController;
use App\Http\Controllers\Guest\OtherServicesViewController;
use App\Http\Controllers\Guest\ProgramsController;
use App\Http\Controllers\Guest\VmgoViewController;
use App\Http\Controllers\Guest\WelcomeViewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeViewController::class)->name('home');

Route::get('about', AboutViewController::class)->name('about');

Route::get('about/vision-mission-goals', VmgoViewController::class)->name('vmgo');

Route::get('about/history', HistoryViewController::class)->name('history');

Route::get('about/administration', AdministrationViewController::class)->name('administration');

Route::get('about/facilities', FacilitiesViewController::class)->name('facilities');

Route::get('about/faculty-and-staff', [FacultyController::class, 'index'])
    ->name('faculty-and-staff');

Route::get('about/local-task-force', LocalTaskForceViewController::class)->name('local-task-force');

Route::get('certificate', CertificateController::class)->name('certificate');

Route::get('exhibits', ExhibitsController::class)->name('exhibits');

Route::get('others', OtherServicesViewController::class)->name('others');

Route::controller(ProgramsController::class)->prefix('programs')->group(function () {
    Route::get('/', 'index')->name('programs.index');
    Route::get('/{program_id}', 'show')->name('programs.show');
});

Route::get('/programs/{program_id}/{area_id}', AreasController::class)
    ->name('programs.areas.show');

/* Route::get('test/ui-testing', function () {
    return Inertia::render('test/ui-testing');
})->name('ui-testing'); */

// Dummy routes to be added later

/* Route::get('accreditor', function () {
    return Inertia::render('accreditor/accreditor-view');
})->name('accreditor'); */

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/shared.php';
require __DIR__.'/accreditor.php';
require __DIR__.'/admin.php';
