<?php

return [
    'ghostscript' => [
        'binary' => env('PDF_OPTIMIZER_BIN_PATH', 'C:\\Program Files\\gs\\gs10.04.0\\bin\\gswin64c.exe'),
        'temp_dir' => storage_path('app/public/temp'),
    ],
];

