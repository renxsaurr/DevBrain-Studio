<?php

use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::get('/workspace', [WorkspaceController::class, 'show']);
Route::put('/workspace', [WorkspaceController::class, 'update']);
