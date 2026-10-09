<?php

use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\AssistantController;
use Illuminate\Support\Facades\Route;

Route::get('/workspace', [WorkspaceController::class, 'show']);
Route::put('/workspace', [WorkspaceController::class, 'update']);
Route::post('/assistant/search', [AssistantController::class, 'search']);
