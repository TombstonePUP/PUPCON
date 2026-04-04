<?php

return [
    'ghostscript' => [
        'binary' => env('PDF_OPTIMIZER_BIN_PATH', 'C:\\Program Files\\gs\\gs10.06.0\\bin\\gswin64c.exe'),
    ],
    'options' => [
        '-dBATCH',
        '-dNOPAUSE',
        '-q',
        '-sDEVICE=pdfwrite',
        '-dPDFSETTINGS=/screen',
        '-sTEMP=C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON\\storage\\app\\public\\temp',
        //'-sTEMP=C:\\Users\\LENOVO\\Desktop\\Capstone\\PUPCON\\storage\\app\\public\\temp',
    ],
];
