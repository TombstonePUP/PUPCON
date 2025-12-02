<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaFormFilesController;
use App\Http\Controllers\Files\AreaFormsController;
use App\Http\Controllers\Files\DocumentRequestController;
use App\Http\Controllers\Files\DownloadPerAreaFilesController;
use App\Http\Controllers\Files\DownloadPerProgramFilesController;
use App\Http\Controllers\Parameters\AreaParameterOutlinesController;
use App\Http\Controllers\Programs\ManageProgramController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'update.password', 'user.accreditor.restriction'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/requests' , [DocumentRequestController::class, 'index'])->name('requests');

    Route::controller(ManageProgramController::class)->prefix('manage-programs')->as('manage.')->group(function () {
        Route::get('/', 'index')->name('manage-programs');

        Route::middleware(['user.program.role'])->group(function () {
            Route::get('/{program_id}/{level_id}/', 'show')->name('program')->middleware('program.level.exists');
            Route::get('/{program_id}/{level_id}/download', DownloadPerProgramFilesController::class)->name('program.download');
            Route::prefix('{program_id}/{level_id}')->group(function () {
                Route::get('/{area_id}/download', DownloadPerAreaFilesController::class)->name('area.download');

                Route::middleware(['user.area.role'])->group(function () {
                    Route::get('/{area_id}', [AreaParameterOutlinesController::class, 'index'])->name('area');

                    Route::as('area.')->prefix('/{area_id}')->group(function () {
                        Route::controller(AreaFilesController::class)->group(function () {
                            Route::get('/{outline_id}/download_file', 'download')->name('download.file');
                            Route::post('/upload_file', 'store')->name('upload.file');
                            Route::delete('/{outline_id}/delete_file', 'destroy')->name('delete.file');
                        });

                        Route::controller(AreaFormFilesController::class)->group(function () {
                            Route::get('/{form_id}/download_file_form', 'download')->name('download.area.form.file');
                            Route::post('/{form_id}/upload_file_form', 'store')->name('upload.area.form.file');
                            Route::delete('/{form_id}/delete_area_form_file', 'destroy')->name('delete.area.form.file');
                        });
                    });
                });
            });
        });
    });
});
