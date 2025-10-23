<?php

return [
    'ghostscript' => [
        'binary' => env('PDF_OPTIMIZER_BIN_PATH', 'C:\\Program Files\\gs\\gs10.06.0\\bin\\gswin64c.exe'),
        'temp_dir' => storage_path('app/public/temp'),
        'quality' => 'screen',
    ],
];
